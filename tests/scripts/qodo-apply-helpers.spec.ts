import { describe, it, expect } from 'vitest'
import {
  extractSuggestion,
  stripSuggestionFences,
  applySuggestionToContent,
  parsePathsFromBody,
} from '../../scripts/qodo-apply-helpers'

describe('qodo-apply-helpers', () => {
  it('extractSuggestion finds fenced suggestion block', () => {
    const body = 'Some text\n```suggestion\nconst a = 1\n```\nmore text'
    const block = extractSuggestion(body)
    expect(block).toBeTruthy()
    expect(block).toContain('```suggestion')
    expect(block).toContain('const a = 1')
  })

  it('stripSuggestionFences removes fences only (no trailing newline)', () => {
    const block = '```suggestion\nconst a = 1\n```'
    const content = stripSuggestionFences(block)
    expect(content).toBe('const a = 1')
  })

  it('applySuggestionToContent replaces given line range', () => {
    const original = ['line1', 'line2', 'line3', 'line4'].join('\n')
    const block = '```suggestion\nX\nY\n```'
    const out = applySuggestionToContent(original, 2, 3, block)
    expect(out).toBe(['line1', 'X', 'Y', 'line4'].join('\n'))
  })

  it('applySuggestionToContent is order agnostic for start/end (no extra blank line)', () => {
    const original = ['a', 'b', 'c'].join('\n')
    const block = '```suggestion\nB\n```'
    const out = applySuggestionToContent(original, 2, 2, block)
    expect(out).toBe(['a', 'B', 'c'].join('\n'))
    const out2 = applySuggestionToContent(original, 3, 2, block)
    expect(out2).toBe(['a', 'B'].join('\n')) // replace lines 2..3 with single B
  })

  it('parsePathsFromBody extracts file hints', () => {
    const text = 'Please fix components/HelloCard.vue:12 and scripts/apply-qodo-suggestions.ts.'
    const paths = parsePathsFromBody(text)
    expect(paths).toContain('components/HelloCard.vue')
    expect(paths).toContain('scripts/apply-qodo-suggestions.ts')
  })
})
