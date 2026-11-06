import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parse } from 'yaml';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const taskId = 'TASK-20260102030405-ABC123';

function fixture(t) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'domore-hub-test-'));
  const hub = path.join(base, 'hub');
  fs.mkdirSync(hub);
  for (const name of ['.workspace', 'scripts', 'templates', 'docs', 'requirements', 'specifications', 'architecture', 'tasks', 'agents', 'execution']) {
    fs.cpSync(path.join(source, name), path.join(hub, name), { recursive: true });
  }
  for (const name of ['README.md', 'AGENTS.md', 'CONTRIBUTING.md']) fs.copyFileSync(path.join(source, name), path.join(hub, name));
  fs.mkdirSync(path.join(hub, 'node_modules'));
  fs.cpSync(path.join(source, 'node_modules', 'yaml'), path.join(hub, 'node_modules', 'yaml'), { recursive: true });
  for (const name of ['web-api', 'web-app']) {
    const repo = path.join(base, name);
    fs.mkdirSync(repo);
    const result = spawnSync('git', ['init', '-q', repo], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  }
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  return { base, hub, run: (...args) => spawnSync(process.execPath, [path.join(hub, 'scripts', 'hub.mjs'), ...args], { encoding: 'utf8' }) };
}

test('valid workspace and task lifecycle preserve content, prevent duplicates and reject invalid transitions', t => {
  const f = fixture(t);
  const validation = f.run('validate');
  assert.equal(validation.status, 0, validation.stderr);
  let result = f.run('create', 'FEATURE', 'A useful feature', '--id', taskId);
  assert.equal(result.status, 0, result.stderr);
  const todo = path.join(f.hub, 'tasks', 'TODO', `${taskId}.md`);
  const original = fs.readFileSync(todo, 'utf8');
  assert.match(original, /requirement: TBD/);
  assert.notEqual(f.run('create', 'FEATURE', 'Duplicate', '--id', taskId).status, 0);
  assert.notEqual(f.run('status', taskId, 'DONE').status, 0);
  assert.equal(fs.readFileSync(todo, 'utf8'), original);
  for (const state of ['IN_PROGRESS', 'REVIEW', 'BLOCKED', 'IN_PROGRESS', 'REVIEW', 'DONE']) {
    result = f.run('status', taskId, state);
    assert.equal(result.status, 0, result.stderr);
    const current = fs.readFileSync(path.join(f.hub, 'tasks', state, `${taskId}.md`), 'utf8');
    assert.equal(current, original.replace('status: TODO', `status: ${state}`));
  }
  assert.equal(f.run('validate').status, 0);
});

test('rejects missing repositories and parent repositories masquerading as configured root', t => {
  const f = fixture(t);
  const configPath = path.join(f.hub, '.workspace', 'config.yaml');
  const original = fs.readFileSync(configPath, 'utf8');
  fs.writeFileSync(configPath, original.replace('../web-api', '../missing'));
  assert.notEqual(f.run('validate').status, 0);
  const nested = path.join(f.base, 'web-api', 'not-a-repository');
  fs.mkdirSync(nested);
  fs.writeFileSync(configPath, original.replace('../web-api', '../web-api/not-a-repository'));
  const result = f.run('init');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /not repository root/);
});

test('rejects malformed YAML and malformed task metadata', t => {
  const f = fixture(t);
  const configPath = path.join(f.hub, '.workspace', 'config.yaml');
  const original = fs.readFileSync(configPath, 'utf8');
  fs.writeFileSync(configPath, `${original}\nworkspace: duplicate\n`);
  assert.notEqual(f.run('validate').status, 0);
  fs.writeFileSync(configPath, original);
  assert.equal(f.run('create', 'FEATURE', 'Task', '--id', taskId).status, 0);
  const task = path.join(f.hub, 'tasks', 'TODO', `${taskId}.md`);
  fs.writeFileSync(task, fs.readFileSync(task, 'utf8').replace('status: TODO', 'status: DONE'));
  assert.notEqual(f.run('validate').status, 0);
});

test('OpenAPI example is valid YAML and documents the source-inspected public operation', () => {
  const spec = parse(fs.readFileSync(path.join(source, 'specifications/api-contracts/products-list.example.yaml'), 'utf8'));
  assert.equal(spec.openapi, '3.0.3');
  assert.deepEqual(spec.paths['/api/v1/products'].get.security, []);
  assert.equal(spec.paths['/api/v1/products'].get.responses['200'].content['application/json'].schema.type, 'array');
});

test('Bash entry points create and move a task', t => {
  const f = fixture(t);
  const bash = process.platform === 'win32' ? 'C:\\Program Files\\Git\\bin\\bash.exe' : 'bash';
  if (process.platform === 'win32' && !fs.existsSync(bash)) return t.skip('Git Bash not installed at standard path');
  const create = spawnSync(bash, [path.join(f.hub, 'scripts', 'create-task.sh'), 'FEATURE', 'Wrapper check', '--id', taskId], { encoding: 'utf8' });
  assert.equal(create.status, 0, create.stderr);
  const move = spawnSync(bash, [path.join(f.hub, 'scripts', 'task-status.sh'), taskId, 'IN_PROGRESS'], { encoding: 'utf8' });
  assert.equal(move.status, 0, move.stderr);
  assert.ok(fs.existsSync(path.join(f.hub, 'tasks', 'IN_PROGRESS', `${taskId}.md`)));
});
