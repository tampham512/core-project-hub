import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { isScalar, parse, parseDocument, stringify } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const states = ['TODO', 'IN_PROGRESS', 'REVIEW', 'BLOCKED', 'DONE'];
const transitions = { TODO: ['IN_PROGRESS', 'BLOCKED'], IN_PROGRESS: ['REVIEW', 'BLOCKED'], REVIEW: ['DONE', 'IN_PROGRESS', 'BLOCKED'], BLOCKED: ['IN_PROGRESS'], DONE: [] };
const idPattern = /^TASK-[0-9]{14}-[A-F0-9]{6}$/;
const skillNames = ['ralph-loop', 'cross-repo-development', 'requirement-analysis', 'code-review', 'documentation-sync'];
const requiredFiles = ['README.md', 'AGENTS.md', 'CONTRIBUTING.md', '.workspace/config.yaml', 'docs/project-overview.md', 'docs/system-architecture.md', 'docs/business-domain.md', 'docs/development-setup.md', 'docs/coding-standards.md', 'docs/glossary.md', 'requirements/README.md', 'architecture/README.md', 'tasks/README.md', 'agents/README.md', 'execution/README.md', ...['requirement', 'user-story', 'task', 'implementation-plan', 'execution-report', 'adr', 'api-contract'].map(n => `templates/${n}-template.md`), ...skillNames.map(n => `agents/skills/${n}/SKILL.md`), ...['new-feature', 'bug-fix', 'code-review', 'resume'].map(n => `agents/workflows/${n}.md`), ...['init-workspace', 'validate-workspace', 'create-task', 'task-status'].map(n => `scripts/${n}.sh`)];
const requiredDirs = ['requirements/backlog', 'requirements/features', 'requirements/user-stories', 'requirements/acceptance-criteria', 'specifications/api-contracts', 'specifications/database', 'specifications/data-models', 'specifications/workflows', 'specifications/integrations', 'architecture/diagrams', 'architecture/ADR', ...states.map(s => `tasks/${s}`), 'agents/skills', 'agents/workflows', 'agents/prompts', 'agents/rules', 'execution/active', 'execution/history', 'execution/templates'];
const fail = message => { throw new Error(message); };
function config() {
  const cfg = parse(fs.readFileSync(path.join(root, '.workspace/config.yaml'), 'utf8'), { uniqueKeys: true });
  const w = cfg?.workspace;
  if (!w || typeof w.name !== 'string' || !w.name.trim() || !w.repositories || typeof w.repositories !== 'object' || Array.isArray(w.repositories)) fail('Invalid workspace configuration');
  if (!w.agent || typeof w.agent.default !== 'string' || !Number.isInteger(w.agent.max_iterations) || w.agent.max_iterations < 1) fail('Invalid agent configuration');
  for (const key of ['require_plan', 'require_tests', 'require_review', 'update_execution_history']) if (typeof w.workflow?.[key] !== 'boolean') fail(`Invalid workflow.${key}`);
  for (const name of ['backend', 'frontend']) {
    const repo = w.repositories[name];
    if (!repo || typeof repo.path !== 'string' || !repo.path.trim() || repo.type !== name || typeof repo.required !== 'boolean') fail(`Invalid repository configuration: ${name}`);
  }
  return w;
}
function repos(w, showStatus = false) {
  let missing = false;
  for (const [name, repo] of Object.entries(w.repositories)) {
    if (!repo || typeof repo.path !== 'string' || typeof repo.required !== 'boolean') fail(`Invalid repository: ${name}`);
    const location = path.resolve(root, repo.path);
    try {
      const real = fs.realpathSync(location);
      const top = fs.realpathSync(execFileSync('git', ['-C', location, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim());
      const a = fs.statSync(real, { bigint: true });
      const b = fs.statSync(top, { bigint: true });
      const samePath = process.platform === 'win32' ? real.toLowerCase() === top.toLowerCase() : real === top;
      const sameDirectory = a.ino !== 0n && a.dev === b.dev && a.ino === b.ino;
      if (!samePath && !sameDirectory) throw new Error('path is not repository root');
      console.log(`${name}: ${location} (Git repository)`);
      if (showStatus) {
        const status = execFileSync('git', ['-C', location, 'status', '--short'], { encoding: 'utf8' }).trimEnd();
        console.log(status || '  clean');
      }
    } catch (error) {
      console.error(`${name}: ${location}: ${error.message}`);
      if (repo.required) missing = true;
    }
  }
  if (missing) fail('Required repositories are missing or not repository roots');
}
function parseTask(content, filename) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(content);
  if (!match) fail(`Missing YAML metadata: ${filename}`);
  const document = parseDocument(match[1], { uniqueKeys: true });
  if (document.errors.length) fail(`Invalid YAML metadata: ${filename}`);
  const meta = document.toJS();
  if (!meta || !idPattern.test(meta.id ?? '') || typeof meta.title !== 'string' || !meta.title.trim() || !/^[A-Z][A-Z0-9_-]{0,31}$/.test(meta.type ?? '') || typeof meta.requirement !== 'string' || !meta.requirement.trim() || !states.includes(meta.status) || !Array.isArray(meta.repositories) || meta.repositories.some(x => !['frontend', 'backend', 'hub'].includes(x))) fail(`Invalid task metadata: ${filename}`);
  const statusNode = document.get('status', true);
  if (!isScalar(statusNode) || !statusNode.range) fail(`Invalid task status field: ${filename}`);
  const offset = match[0].indexOf(match[1]);
  return { meta, statusRange: [offset + statusNode.range[0], offset + statusNode.range[1]] };
}
function findTask(id) {
  if (!idPattern.test(id ?? '')) fail('Invalid task ID');
  const matches = states.map(state => ({ state, file: path.join(root, 'tasks', state, `${id}.md`) })).filter(x => fs.existsSync(x.file));
  if (matches.length !== 1) fail(matches.length ? `Duplicate task ID: ${id}` : `Task not found: ${id}`);
  return matches[0];
}
function validate() {
  for (const file of requiredFiles) {
    const p = path.join(root, file);
    if (!fs.existsSync(p) || !fs.statSync(p).isFile() || !fs.readFileSync(p, 'utf8').trim()) fail(`Missing or empty file: ${file}`);
  }
  for (const dir of requiredDirs) if (!fs.existsSync(path.join(root, dir)) || !fs.statSync(path.join(root, dir)).isDirectory()) fail(`Missing directory: ${dir}`);
  function checkMarkdown(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) checkMarkdown(p);
      else if (entry.isFile() && entry.name.endsWith('.md') && !fs.readFileSync(p, 'utf8').trim()) fail(`Empty Markdown file: ${p}`);
    }
  }
  for (const dir of ['docs', 'requirements', 'specifications', 'architecture', 'tasks', 'agents', 'execution', 'templates']) checkMarkdown(path.join(root, dir));
  for (const name of skillNames) {
    const content = fs.readFileSync(path.join(root, 'agents', 'skills', name, 'SKILL.md'), 'utf8');
    const header = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(content);
    if (!header) fail(`Missing skill frontmatter: ${name}`);
    const metadata = parse(header[1], { uniqueKeys: true });
    if (metadata?.name !== name || typeof metadata.description !== 'string' || !metadata.description.trim() || !content.slice(header[0].length).trim()) fail(`Invalid skill metadata or instructions: ${name}`);
  }
  const seen = new Set();
  for (const state of states) for (const entry of fs.readdirSync(path.join(root, 'tasks', state))) {
    if (!entry.endsWith('.md') || entry === 'README.md') continue;
    const p = path.join(root, 'tasks', state, entry);
    const { meta } = parseTask(fs.readFileSync(p, 'utf8'), p);
    if (entry !== `${meta.id}.md` || meta.status !== state || seen.has(meta.id)) fail(`Task ID/status mismatch or duplicate: ${p}`);
    seen.add(meta.id);
  }
  const w = config(); repos(w); console.log(`Validated hub, configuration and ${seen.size} task(s).`);
}
function create(args) {
  const [type, title, ...rest] = args;
  if (!/^[A-Z][A-Z0-9_-]{0,31}$/.test(type ?? '') || typeof title !== 'string' || !title.trim() || title.length > 120 || /[\r\n]/.test(title) || (rest.length && (rest.length !== 2 || rest[0] !== '--id'))) fail('Usage: create-task.sh FEATURE "Task title" [--id TASK-YYYYMMDDHHMMSS-XXXXXX]');
  const id = rest[1] ?? `TASK-${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}-${randomBytes(3).toString('hex').toUpperCase()}`;
  if (!idPattern.test(id)) fail('Invalid task ID');
  if (states.some(s => fs.existsSync(path.join(root, 'tasks', s, `${id}.md`)))) fail(`Task already exists: ${id}`);
  const meta = { id, title: title.trim(), type, requirement: 'TBD', status: 'TODO', repositories: [] };
  const template = fs.readFileSync(path.join(root, 'templates/task-template.md'), 'utf8');
  const marker = '<!-- TASK_BODY -->';
  if (!template.includes(marker)) fail('Task template is missing TASK_BODY marker');
  const body = template.slice(template.indexOf(marker) + marker.length).replace(/^\s*\r?\n/, '');
  const file = path.join(root, 'tasks', 'TODO', `${id}.md`);
  fs.writeFileSync(file, `---\n${stringify(meta)}---\n${body}`, { flag: 'wx' });
  console.log(`Created ${path.relative(root, file)}; fill in requirement and scope.`);
}
function changeStatus(args) {
  if (args.length !== 2) fail('Usage: task-status.sh TASK-ID NEW_STATUS');
  const [id, next] = args;
  const current = findTask(id);
  const content = fs.readFileSync(current.file, 'utf8');
  const { meta, statusRange } = parseTask(content, current.file);
  if (meta.id !== id || meta.status !== current.state) fail('Task metadata does not match its location');
  if (!transitions[current.state].includes(next)) fail(`Invalid transition: ${current.state} -> ${next}`);
  const destination = path.join(root, 'tasks', next, `${id}.md`);
  if (fs.existsSync(destination)) fail(`Destination already exists: ${destination}`);
  // Exclusive creation prevents overwrites. If source removal fails, remove the new copy.
  fs.writeFileSync(destination, content.slice(0, statusRange[0]) + next + content.slice(statusRange[1]), { flag: 'wx' });
  try { fs.unlinkSync(current.file); } catch (e) { fs.unlinkSync(destination); throw e; }
  console.log(`${id}: ${current.state} -> ${next}`);
}
try {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'init' && !args.length) { const w = config(); console.log(`Workspace: ${w.name}`); repos(w, true); }
  else if (command === 'validate' && !args.length) validate();
  else if (command === 'create') create(args);
  else if (command === 'status') changeStatus(args);
  else fail('Use init, validate, create or status');
} catch (error) { console.error(`Error: ${error.message}`); process.exitCode = 1; }
