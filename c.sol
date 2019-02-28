pragma solidity ^0.4.21;
pragma solidity ^0.4.21;

contract AbstractPaymentQuantum {

    address public platform;
    address public wallet;
    uint public platformRate = 5; //percent 5%

    mapping (address => uint) public platformFee;
    mapping (address => uint) public deposits;

    modifier onlyBy(address _account)
    {
        require(msg.sender == _account);
        _;
    }

    event Deposit(address indexed _participant, uint _amount, uint _time);
    event Payment(address indexed _to, uint _amount, uint _time);

    function deposit() payable public returns (uint);

    /**
     * @dev Change the contract platform address
     * @param _platform Address of the contract platform
    */
    function changePlatform(address _platform) public
        onlyBy(platform)
    {
        platform = _platform;
    }

    /**
     * @dev Change the address of the platform's wallet
     * @param _wallet Address of the wallet where the platform fee will be stored
    */
    function changeWallet(address _wallet) public
        onlyBy(platform)
    {
        wallet = _wallet;
    }

    /**
     * @dev Change the value of the platform rate
     * @param _rate Value of the rate
    */
    function changePlatformRate(uint _rate) public
        onlyBy(platform)
    {
        require(_rate <= 100);
        platformRate = _rate;
    }

    /**
     * @dev Send the platform the amount of eth resulting by applying the specific rate
     * @return The available amount of wei from the deposit (it should be 0)
    */
    function payPlatform() public
        onlyBy(platform)
        returns (uint)
    {
        uint fee = platformFee[wallet];
        platformFee[wallet] = 0;

        wallet.transfer(fee);

        // solium-disable-next-line security/no-block-members
        emit Payment(wallet, fee, now);
        return platformFee[wallet];
    }

     /**
     * @dev Send the platform the amount of eth resulting by applying the specific rate
     * @param _amount Amount to calculate the contract platform fee
     * @return bool True is success
    */
    function collectPlatformFee(uint _amount) public
        returns (uint)
    {
        uint fee = (_amount * platformRate) / 100;
        platformFee[wallet] += fee;
        return fee;
    }

    /**
     * @dev Make some payment to a member which can be participant or KP
     * @param _kp Address of the user
     * @param _amount the amount to pay
     * @return bool True if success
    */
    function payKp(address _kp, uint _amount) public
        returns (bool)
    {
        _kp.transfer(_amount);
        // solium-disable-next-line security/no-block-members
        emit Payment(_kp, _amount, now);
        return true;
    }
}



contract Quantum is AbstractPaymentQuantum {
    uint public withdrawTimeLimit = 240;
    mapping(address => Withdraw) public withdrawMap;
    mapping(uint => mapping(address => uint)) participantPayment;

    struct Withdraw {
        uint8 withdrawed;
        uint time;
    }

    event WithdrawDeposit(address indexed _participant, uint _amount, uint _time);

    event Commit(address indexed _participant,
                address indexed _kp,
                uint _amount,
                uint _remainingValue,
                uint _sessionId,
                uint _time
    );

    modifier isValidAmount(address _participant, uint _amount, uint _sessionId) {
        if (_amount <= participantPayment[_sessionId][_participant]) {
            revert();
        }
        _;
    }

    modifier hasFunds(address _user) {
        if (deposits[_user] == 0) {
            revert();
        }
        _;
    }

    function Quantum(address _platform, address _wallet) public {
        platform = _platform;
        wallet = _wallet;
    }

     /**
     * @dev Deposit funds into the participant account
     * @return uint Value of the deposit
    */
    function deposit()
        public
        payable
        returns (uint)
    {
        require(withdrawMap[msg.sender].withdrawed == 0);
        deposits[msg.sender] += msg.value;
        // solium-disable-next-line security/no-block-members
        emit Deposit(msg.sender, msg.value, now);

        return deposits[msg.sender];
    }

     /**
     * @dev Get the deposit of a specified member if the withdraw flag is 0 or 0 when the withdraw flag is 1
     * @param _participant Address of the participant
     * @return Amount in wei or 0 when the withdraw flag is 1
    */
    function getDeposit(address _participant)
        public
        constant
        returns (uint)
    {
        if (withdrawMap[_participant].withdrawed == 1) {
            return 0;
        } else {
            return (deposits[_participant]);
        }
    }

    /**
     * @dev Get deposit, withdraw flag and the timestamp when the withdraw is enabled
     * @param _participant Address of the participant
     * @return Amount in wei of the balance, the withdraw flag and the time when the withdraw is enabled
    */
    function getWithdrawInfo(address _participant)
        public
        constant
        returns (uint, uint8, uint)
    {
        return (deposits[_participant],
                withdrawMap[_participant].withdrawed,
                withdrawMap[_participant].time + withdrawTimeLimit
            );
    }

    /**
     * @dev Withdraw the amount of wei deposited in the deposit. Can be performed only by the owner of the deposit
     * @return true if the withdraw action was successful, false otherwise
     */
    function withdraw()
        public
        hasFunds(msg.sender)
        returns (bool)
    {
        bool success = false;
        // solium-disable-next-line security/no-block-members
        if (now > withdrawMap[msg.sender].time + withdrawTimeLimit &&
            withdrawMap[msg.sender].withdrawed == 1) {

            if (consumeDeposit(msg.sender)) {
                resetWithdraw(msg.sender);
                success = true;
            }
        }

        return success;
    }

     /**
     * @dev AutoWithdraw the amount of wei deposited in the deposit.
     * @param  _participant Address of the participant
     * @param _v Signature component
     * @param _r Signature component
     * @param _s Signature component
     * @return true if the withdraw action was successful, false otherwise of if the ecrecover check fails
     */
    function autoWithdraw(address _participant, uint8 _v, bytes32 _r, bytes32 _s)
        public
        hasFunds(_participant)
        returns (bool)
    {
        if (_participant != ecrecover(keccak256(_participant), _v, _r, _s)) {
            revert();
        }

        bool success = false;
        // solium-disable-next-line security/no-block-members
        if (now > withdrawMap[_participant].time + withdrawTimeLimit &&
            withdrawMap[_participant].withdrawed == 1) {

            if (consumeDeposit(_participant)) {
                resetWithdraw(_participant);
                success = true;
            }
        }

        return success;
    }

     /**
     * @dev Mark the initiation of the withdraw action
     * @return true if marked
     */
    function initWithdraw()
        public
        hasFunds(msg.sender)
        returns (bool)
    {
        if (withdrawMap[msg.sender].withdrawed == 0) {
            withdrawMap[msg.sender].withdrawed = 1;
            // solium-disable-next-line security/no-block-members
            withdrawMap[msg.sender].time = now;
        }
        return true;
    }

    /**
     * @dev Commit the last message and make the payments to KP and platform
     * @param _participant Address of the participant
     * @param _kp Address of the KP
     * @param _value The amount of wei the participant has to pay for the given session
     * @param _v Signature component
     * @param _r Signature component
     * @param _s Signature component
     * @param _sessionId The session identifier
     * @return bool
    */
    function commit(
        address _participant,
        address _kp,
        uint _value,
        uint _sessionId,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
        )
        public
        isValidAmount(_participant, _value, _sessionId)
        returns (bool)
    {
        if (_participant != ecrecover(keccak256(_sessionId, _participant, _kp, _value), _v, _r, _s)) {
            revert();
        }

        uint[1] memory remainingValue;
        remainingValue[0] = _value;
        remainingValue[0] -= participantPayment[_sessionId][_participant];

        if (deposits[_participant] < remainingValue[0]) {
            revert();
        }

        deposits[_participant] -= remainingValue[0];
        participantPayment[_sessionId][_participant] += remainingValue[0];
        remainingValue[0] -= collectPlatformFee(remainingValue[0]);

        // solium-disable-next-line security/no-block-members
        emit Commit(_participant, _kp, _value, remainingValue[0], _sessionId, now);
        return payKp(_kp, remainingValue[0]);
    }

    /**
    * @dev Change the withdrow time limit
    * @param _timeLimit the new limit
    */
    function changeWithdrawLimit(uint _timeLimit)
        public
        onlyBy(platform)
    {
        withdrawTimeLimit = _timeLimit;
    }

    /**
     * @dev only for testing purpose
    */
    function getParticipantPayment(address _participant, uint _sessionId)
        public
        constant
        returns (uint)
    {
        return participantPayment[_sessionId][_participant];
    }

     /**
     * @dev Unmark the initiation of the withdraw action (opposite action of initWithdraw)
     * @param  _participant Address of the participant
     * @return true if unmarked
     */
    function resetWithdraw(address _participant)
        internal
        returns (bool)
    {
        if (withdrawMap[_participant].withdrawed == 1) {
            withdrawMap[_participant].withdrawed = 0;
            withdrawMap[_participant].time = 0;
        }
        return true;
    }

    /**
     * @dev Empty the participant's deposit by transferring all the funds to the participant address
     * @param _user Address of the participant
     * @return true if success
     */
    function consumeDeposit(address _user)
        internal
        returns (bool)
    {
        if (deposits[_user] > 0) {

            uint userDeposit = deposits[_user];
            deposits[_user] = 0;
            _user.transfer(userDeposit);
            // solium-disable-next-line security/no-block-members
            emit WithdrawDeposit(_user, userDeposit, now);
        }

        return true;
    }
}
