"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/// <reference path="solc.d.ts">
var cli_ux_1 = require("cli-ux");
var fs = require("fs");
var request = require("request-promise");
var solc = require("solc");
var parser = require("solidity-parser-antlr");
var getFileContent = function (filepath) {
    var stats = fs.statSync(filepath);
    if (stats.isFile()) {
        importedFiles.push(filepath);
        return fs.readFileSync(filepath).toString();
    }
    else {
        throw new Error("File " + filepath + " not found");
    }
};
var findImports = function (pathName) {
    try {
        return { contents: getFileContent(pathName) };
    }
    catch (e) {
        return { error: e.message };
    }
};
var importedFiles;
var Compiler = /** @class */ (function () {
    function Compiler() {
    }
    Compiler.prototype.solidity = function (fileName, fileContents, version) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, input, solcVersion, sv, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        importedFiles = [];
                        input = {
                            language: 'Solidity',
                            sources: (_a = {},
                                _a[fileName] = {
                                    content: fileContents
                                },
                                _a),
                            settings: {
                                outputSelection: {
                                    '*': {
                                        '*': ['*'],
                                        '': ['ast']
                                    }
                                }
                            }
                        };
                        solcVersion = 'latest';
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        if (!(version === undefined)) return [3 /*break*/, 4];
                        sv = this.solidityVersion(fileContents);
                        if (!(sv !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.solcVersion(sv)];
                    case 2:
                        solcVersion = _b.sent();
                        _b.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.solcVersion(version)];
                    case 5:
                        solcVersion = _b.sent();
                        _b.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _b.sent();
                        return [2 /*return*/, new Promise(function (_, reject) {
                                reject(error_1);
                            })];
                    case 8:
                        importedFiles.push(fileName);
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                cli_ux_1["default"].info("Compiling with Solidity version: " + solcVersion);
                                solc.loadRemoteVersion(solcVersion, function (err, solcSnapshot) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        var compiled = JSON.parse(solcSnapshot.compile(JSON.stringify(input), { "import": findImports }));
                                        // Reject if there are errors
                                        if (compiled.errors !== undefined) {
                                            for (var _i = 0, _a = compiled.errors; _i < _a.length; _i++) {
                                                var e = _a[_i];
                                                if (e.severity === 'error') {
                                                    reject(compiled);
                                                }
                                            }
                                        }
                                        resolve({ compiled: compiled, importedFiles: importedFiles });
                                    }
                                });
                            })];
                }
            });
        });
    };
    Compiler.prototype.solidityVersion = function (fileContents) {
        var ast;
        try {
            ast = parser.parse(fileContents, {});
            // @ts-ignore
            for (var _i = 0, _a = ast.children; _i < _a.length; _i++) {
                var n = _a[_i];
                if ((n.name === 'solidity') && (n.type === 'PragmaDirective')) {
                    return n.value;
                }
            }
        }
        catch (error) {
            for (var _b = 0, _c = error.errors; _b < _c.length; _b++) {
                var err = _c[_b];
                cli_ux_1["default"].error(err.message);
            }
        }
    };
    Compiler.prototype.solcVersion = function (solidityVersion) {
        return __awaiter(this, void 0, void 0, function () {
            var upperLimit, solcVersion, i, x, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        solidityVersion = solidityVersion.replace(/[\^v]/g, '');
                        upperLimit = 'latest';
                        solcVersion = 'latest';
                        for (i = 0; i < solidityVersion.length; i++) {
                            if (solidityVersion[i] === '<') {
                                if (solidityVersion[i + 1] === '=') {
                                    solidityVersion = solidityVersion.substring(i + 2, solidityVersion.length);
                                    break;
                                }
                                upperLimit = solidityVersion.substring(i + 1, solidityVersion.length);
                                break;
                            }
                        }
                        if (upperLimit !== 'latest') {
                            if (upperLimit === '0.7.0') {
                                solidityVersion = '0.6.10';
                            }
                            else if (upperLimit === '0.6.0') {
                                solidityVersion = '0.5.17';
                            }
                            else if (upperLimit === '0.5.0') {
                                solidityVersion = '0.4.26';
                            }
                            else if (upperLimit === '0.4.0') {
                                solidityVersion = '0.3.6';
                            }
                            else if (upperLimit === '0.3.0') {
                                solidityVersion = '0.2.2';
                            }
                            else {
                                x = parseInt(upperLimit[upperLimit.length - 1], 10) - 1;
                                solidityVersion = '';
                                for (i = 0; i < upperLimit.length - 1; i++) {
                                    solidityVersion += upperLimit[i];
                                }
                                solidityVersion += x.toString();
                            }
                        }
                        return [4 /*yield*/, request.get('https://ethereum.github.io/solc-bin/bin/list.txt')
                                .then(function (body) {
                                var lines = body.split('\n');
                                for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                                    var v = lines_1[_i];
                                    var versionName = v.replace('soljson-v', '');
                                    if (versionName.indexOf(solidityVersion + "+") === 0) {
                                        solcVersion = v.replace('soljson-', '').replace('.js', '');
                                        return;
                                    }
                                }
                            })["catch"](function (err) {
                                cli_ux_1["default"].error(err);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, solcVersion];
                }
            });
        });
    };
    return Compiler;
}());
exports.Compiler = Compiler;
