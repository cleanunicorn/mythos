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
    out += `Title: (${issue.swcID}) ${issue.swcTitle}\n`
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

  formatMeta(meta: any): string {
    let out = ''
    out += `Covered instructions: ${meta.coveredInstructions}\n`
    out += `Covered paths: ${meta.coveredPaths}\n`
    out += `Selected compiler version: v${meta.selectedCompiler}\n`
    return out
  }

  formatStatus(status: any): string {
    let out = '\n'
    out += `UUID: ${status.uuid}\n`
    out += `API Version: ${status.apiVersion}\n`
    out += `Harvey Version: ${status.harveyVersion}\n`
    out += `Maestro Version: ${status.maestroVersion}\n`
    out += `Maru Version: ${status.maruVersion}\n`
    out += `Mythril Version: ${status.mythrilVersion}\n`
    return out
  }

  output(): string[] {
    let outputList: string[] = []

    outputList.push(this.formatStatus(this.report.status))

    outputList.push(`Report found: ${this.report.issues[0].issues.length} issues`)

    for (let issueList of this.report.issues) {
      outputList.push(this.formatMeta(issueList.meta))
      for (let issue of issueList.issues) {
        outputList.push(this.formatIssue(issue))
      }
    }

    return outputList
  }

}
