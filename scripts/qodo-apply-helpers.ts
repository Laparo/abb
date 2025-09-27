/**
 * Pure, testable helpers for applying Qodo/GitHub suggestion blocks.
 */

export function extractSuggestion(body: string): string | null {
  // Find a fenced code block starting with ```suggestion and capture until closing fence
  const match = body.match(/```suggestion[\s\S]*?```/)
  return match ? match[0] : null
}

export function stripSuggestionFences(suggestionBlock: string): string {
  // Remove opening ```suggestion and trailing ``` fence only
  let content = suggestionBlock
  content = content.replace(/^```suggestion\s*\n?/, '')
  content = content.replace(/```\s*$/, '')
  // Avoid introducing an extra blank line: drop a single trailing newline if present
  content = content.replace(/\r?\n$/, '')
  return content
}

export function applySuggestionToContent(
  originalContent: string,
  startLine: number,
  endLine: number,
  suggestionBlock: string
): string {
  if (!Number.isInteger(startLine) || !Number.isInteger(endLine) || startLine < 1 || endLine < 1) {
    throw new Error('Invalid line range')
  }
  if (endLine < startLine) {
    // swap defensively
    ;[startLine, endLine] = [endLine, startLine]
  }
  const lines = originalContent.split(/\r?\n/)
  const pre = lines.slice(0, startLine - 1)
  const post = lines.slice(endLine)
  const suggestion = stripSuggestionFences(suggestionBlock)
  const suggestionLines = suggestion.split(/\r?\n/)
  return [...pre, ...suggestionLines, ...post].join('\n')
}

export function parsePathsFromBody(body: string): string[] {
  const paths = new Set<string>()
  // Inline references like: path/to/file.ts or path/to/file.ts:123
  const inlineRegex = /([\w./-]+\.(?:ts|vue|js|json|md))(?::(\d+))?/g
  let m: RegExpExecArray | null
  while ((m = inlineRegex.exec(body)) !== null) {
    paths.add(m[1])
  }

  // Hint line like: Affected: path/to/file.ts, another/file.js
  const match = body.match(/Affected\s*:\s*([^\n]+)/i)
  if (match) {
    match[1]
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((p) => paths.add(p))
  }

  return Array.from(paths)
}
