#!/usr/bin/env tsx
/**
 * Apply GitHub PR review suggestion blocks (```suggestion) to the local workspace.
 * Usage: npm run apply:qodo -- --pr <number> [--repo <owner/repo>] [--token <gh_token>]
 * Defaults: repo inferred from package.json git remote, token from GITHUB_TOKEN or gh auth.
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

interface Args {
  pr: number
  repo?: string
  token?: string
}

function parseArgs(): Args {
  const args = process.argv.slice(2)
  let pr = 0
  let repo: string | undefined
  let token: string | undefined
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--pr') pr = Number(args[++i])
    else if (a === '--repo') repo = args[++i]
    else if (a === '--token') token = args[++i]
  }
  if (!pr || Number.isNaN(pr)) {
    console.error('Missing --pr <number>')
    process.exit(1)
  }
  if (!repo) {
    try {
      const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim()
      // formats: https://github.com/owner/repo.git or git@github.com:owner/repo.git
      const m = remote.match(/[:/]([^/:]+)\/([^/]+?)(?:\.git)?$/)
      if (m) repo = `${m[1]}/${m[2]}`
    } catch {
      // ignore; repo must be provided explicitly if inference fails
    }
  }
  if (!repo) {
    console.error('Cannot infer repo. Provide --repo <owner/repo>.')
    process.exit(1)
  }
  token ||= process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  return { pr, repo, token }
}

async function fetchJson(url: string, token?: string) {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  return res.json()
}

function applySuggestion(filePath: string, startLine: number, endLine: number, suggestion: string) {
  const abs = path.resolve(process.cwd(), filePath)
  const original = fs.readFileSync(abs, 'utf8').split(/\r?\n/)
  const pre = original.slice(0, startLine - 1)
  const post = original.slice(endLine)
  const suggestionLines = suggestion
    .replace(/^```suggestion\s*\n?|```$/g, '')
    .replace(/```$/m, '')
    .split(/\r?\n/)
  const merged = [...pre, ...suggestionLines, ...post].join('\n')
  fs.writeFileSync(abs, merged, 'utf8')
}

function extractSuggestion(body: string): string | null {
  // Look for a fenced code block starting with ```suggestion
  const match = body.match(/```suggestion[\s\S]*?```/)
  return match ? match[0] : null
}

async function main() {
  const { pr, repo, token } = parseArgs()
  console.log(`Fetching review comments for ${repo}#${pr} ...`)
  // PR review comments (diff comments)
  let page = 1
  const suggestions: Array<{
    path: string
    start: number
    end: number
    body: string
    id: number
  }> = []
  while (true) {
    const url = `https://api.github.com/repos/${repo}/pulls/${pr}/comments?per_page=100&page=${page}`
    const data = await fetchJson(url, token)
    if (!Array.isArray(data) || data.length === 0) break
    for (const c of data) {
      const s = extractSuggestion(c.body || '')
      if (!s) continue
      // line info can be in original_position / line / start_line
      const start = (c.start_line ?? c.original_start_line ?? c.line ?? c.original_line) as number
      const end = (c.line ?? c.original_line ?? c.start_line ?? c.original_start_line) as number
      if (!c.path || !start || !end) continue
      suggestions.push({
        path: c.path as string,
        start: start as number,
        end: end as number,
        body: s,
        id: c.id as number,
      })
    }
    page++
  }
  if (suggestions.length === 0) {
    console.log('No suggestions found.')
    return
  }
  console.log(`Applying ${suggestions.length} suggestion(s)...`)
  for (const s of suggestions) {
    console.log(`- ${s.path} [${s.start}-${s.end}] (comment ${s.id})`)
    applySuggestion(s.path, s.start, s.end, s.body)
  }
  // Stage changes so user can commit
  execSync('git add -A', { stdio: 'inherit' })
  console.log('Applied suggestions and staged changes. Review with git diff, then commit.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
