const SourceMappingDecoder = require('remix-lib/src/sourceMappingDecoder')

export class Sourcemap {
  report: any
  source: string
  filename: string

  constructor(filename: string, source: string, issues: any) {
    this.filename = filename
    this.source = source
    this.report = issues
  }

  formatIssue(issue: any): string {
    const decoder = new SourceMappingDecoder()
    const lineBreakPositions = decoder.getLinebreakPositions(this.source)

    let out = ''
    out += `Title: ${issue.swcTitle}\n`
    out += `Severity: ${issue.severity}\n`
    out += `Head: ${issue.description.head}\n`
    out += `Description: ${issue.description.tail}\n`

    out += 'Source code:' + '\n\n'
    issue.locations.forEach((location: {sourceMap: string}) => {
      const arr = location.sourceMap.split(':')
      const sourceLocation = {
        start: parseInt(arr[0], 10),
        length: parseInt(arr[1], 10)
      }
      const lineLocation = decoder.convertOffsetToLineColumn(sourceLocation, lineBreakPositions)

      if (lineLocation.start) {
        lineLocation.start.line++
      }
      if (lineLocation.end) {
        lineLocation.end.line++
      }

      out += `${this.filename} ${lineLocation.start.line}:${lineLocation.start.column}\n`
      out += '--------------------------------------------------\n'
      out += this.source.substring(sourceLocation.start, sourceLocation.start + sourceLocation.length) + '\n'
      out += '--------------------------------------------------\n'
    })
    out += '\n==================================================\n'

    return out
  }

  output(): string[] {
    let outputList: string[] = []

    for (let issueList of this.report.issues) {
      for (let issue of issueList.issues) {
        outputList.push(this.formatIssue(issue))
      }
    }

    return outputList
  }

}
