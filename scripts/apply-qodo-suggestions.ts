#!/usr/bin/env tsx
/**
 * Apply GitHub PR review suggestion blocks (```suggestion) to the local workspace.
 * Usage: npm run apply:qodo -- --pr <number> [--repo <owner/repo>] [--token <gh_token>] [--dry]
 * Defaults: repo inferred from package.json git remote, token from GITHUB_TOKEN or gh auth.
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import {
  extractSuggestion,
  applySuggestionToContent,
  parsePathsFromBody,
} from './qodo-apply-helpers'

interface Args {
  pr: number
  repo: string
  token?: string
  dry: boolean
}

function printUsage() {
  console.log(
    `\nApply GitHub suggestion blocks to the local workspace\n\n` +
      `Options:\n` +
      `  --pr <number>            Pull Request number (required)\n` +
      `  --repo <owner/repo>      Repository in owner/name format (auto-inferred)\n` +
      `  --token <gh_token>       GitHub token (GITHUB_TOKEN/GH_TOKEN fallback)\n` +
      `  --dry                    Dry run (no file writes, only logs)\n` +
      `  --help                   Show this help\n` +
      `\nExamples:\n` +
      `  npm run apply:qodo -- --pr 12\n` +
      `  npm run apply:qodo -- --pr 12 --dry\n`
  )
}

function parseArgs(): Args {
  const args = process.argv.slice(2)
  let pr = 0
  let repo: string | undefined
  let token: string | undefined
  let dry = false
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--help' || a === '-h') {
      printUsage()
      process.exit(0)
    } else if (a === '--pr') pr = Number(args[++i])
    else if (a === '--repo') repo = args[++i]
    else if (a === '--token') token = args[++i]
    else if (a === '--dry') dry = true
  }
  if (!pr || Number.isNaN(pr)) {
    console.error('Missing --pr <number>')
    printUsage()
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
  return { pr, repo: repo as string, token, dry }
}

async function fetchJson(url: string, token?: string) {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  return res.json()
}

async function fetchChangedFiles(repo: string, pr: number, token?: string): Promise<string[]> {
  let page = 1
  const files: string[] = []
  while (true) {
    const url = `https://api.github.com/repos/${repo}/pulls/${pr}/files?per_page=100&page=${page}`
    const data = await fetchJson(url, token)
    if (!Array.isArray(data) || data.length === 0) break
    for (const f of data) if (f.filename) files.push(f.filename as string)
    page++
  }
  return files
}

function applySuggestion(filePath: string, startLine: number, endLine: number, suggestion: string) {
  const abs = path.resolve(process.cwd(), filePath)
  const original = fs.readFileSync(abs, 'utf8')
  const merged = applySuggestionToContent(original, startLine, endLine, suggestion)
  fs.writeFileSync(abs, merged, 'utf8')
}

function maybeRunFixers(targetFiles: string[]) {
  if (!targetFiles.length) return
  // Only fix supported extensions and existing files
  const filtered = targetFiles.filter((p) => /\.(ts|vue|js|json|md)$/.test(p) && fs.existsSync(p))
  if (!filtered.length) return
  console.log(`Running ESLint --fix on ${filtered.length} file(s) ...`)
  try {
    execSync(`npx eslint --fix --ext .ts,.vue ${filtered.map((f) => `'${f}'`).join(' ')}`, {
      stdio: 'inherit',
    })
  } catch {
    console.warn('ESLint fix encountered issues (continuing).')
  }
  console.log('Running Prettier --write ...')
  try {
    execSync(`npx prettier --write ${filtered.map((f) => `'${f}'`).join(' ')}`, {
      stdio: 'inherit',
    })
  } catch {
    console.warn('Prettier write encountered issues (continuing).')
  }
}

async function main() {
  const { pr, repo, token, dry } = parseArgs()
  // Runtime checks
  const nodeMajor = Number(process.versions.node.split('.')?.[0] || '0')
  if (Number.isFinite(nodeMajor) && nodeMajor < 18) {
    console.warn('This script requires Node 18+ for global fetch. Recommended: Node 20+.')
  }
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available. Please use Node.js v18+ (recommended v20+).')
  }

  if (dry) {
    console.log('Dry-run mode enabled: no files will be modified or staged.')
  }
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
  const hintedPaths = new Set<string>()
  while (true) {
    const url = `https://api.github.com/repos/${repo}/pulls/${pr}/comments?per_page=100&page=${page}`
    const data = await fetchJson(url, token)
    if (!Array.isArray(data) || data.length === 0) break
    for (const c of data) {
      const s = extractSuggestion(c.body || '')
      if (!s) continue
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
      hintedPaths.add(c.path as string)
    }
    page++
  }

  // Also scan top-level issue comments for additional hints (filenames in text)
  console.log('Scanning issue comments for additional file hints ...')
  page = 1
  while (true) {
    const url = `https://api.github.com/repos/${repo}/issues/${pr}/comments?per_page=100&page=${page}`
    const data = await fetchJson(url, token)
    if (!Array.isArray(data) || data.length === 0) break
    for (const c of data) {
      const paths = parsePathsFromBody(c.body || '')
      paths.forEach((p) => hintedPaths.add(p))
    }
    page++
  }

  if (suggestions.length > 0) {
    console.log(`${dry ? 'Would apply' : 'Applying'} ${suggestions.length} suggestion(s)...`)
    for (const s of suggestions) {
      console.log(`- ${s.path} [${s.start}-${s.end}] (comment ${s.id})`)
      if (dry) {
        // Show a concise preview of the suggestion content
        const preview = s.body.split(/\r?\n/).slice(0, 6).join('\n')
        console.log(`  preview:\n${preview}${s.body.split(/\r?\n/).length > 6 ? '\n  ...' : ''}`)
      } else {
        applySuggestion(s.path, s.start, s.end, s.body)
      }
    }
    if (!dry) {
      execSync('git add -A', { stdio: 'inherit' })
      console.log('Applied suggestions and staged changes.')
    }
  } else {
    console.log('No suggestion blocks found.')
  }

  // Limit fixers to changed files intersected with hinted paths; if none hinted, use all changed files
  const changed = await fetchChangedFiles(repo, pr, token)
  const target = new Set<string>()
  if (hintedPaths.size) {
    for (const p of hintedPaths) if (changed.includes(p)) target.add(p)
  } else {
    changed.forEach((p) => target.add(p))
  }
  if (dry) {
    if (target.size) {
      console.log(`Would run fixers (ESLint/Prettier) on ${target.size} file(s):`)
      for (const f of target) console.log(`  - ${f}`)
    } else {
      console.log('No target files for fixers.')
    }
  } else {
    maybeRunFixers(Array.from(target))
  }

  // Stage any formatting changes as well
  if (!dry) {
    execSync('git add -A', { stdio: 'inherit' })
    console.log('Staged formatting/fix changes (if any). Review with git diff, then commit.')
  } else {
    console.log('Dry run complete. No changes written.')
  }
}

void (async () => {
  try {
    await main()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
