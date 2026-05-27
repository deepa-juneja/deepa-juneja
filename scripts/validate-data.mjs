import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DATA = join(ROOT, 'data');

const REQUIRED_PROFILE_KEYS = [
  'name', 'tagline', 'contact', 'languages', 'summary_general',
  'about', 'pull_quote', 'education', 'experience', 'career_chapters',
  'skills', 'certifications'
];

const REQUIRED_OVERLAY_KEYS = [
  'role_key', 'role_title', 'summary',
  'include_experience', 'experience_overrides',
  'emphasized_skills', 'include_certifications', 'keywords'
];

const errors = [];
const note = (msg) => errors.push(msg);

async function loadJson(path) {
  const raw = await readFile(path, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    note(`${path}: invalid JSON — ${e.message}`);
    return null;
  }
}

const profile = await loadJson(join(DATA, 'profile.json'));
if (profile) {
  for (const k of REQUIRED_PROFILE_KEYS) {
    if (!(k in profile)) note(`profile.json: missing key "${k}"`);
  }
  const expIds = new Set((profile.experience ?? []).map(x => x.id));
  const certIds = new Set((profile.certifications ?? []).map(x => x.id));

  const roleFiles = await readdir(join(DATA, 'roles'));
  for (const file of roleFiles) {
    if (!file.endsWith('.json')) continue;
    const overlay = await loadJson(join(DATA, 'roles', file));
    if (!overlay) continue;
    for (const k of REQUIRED_OVERLAY_KEYS) {
      if (!(k in overlay)) note(`roles/${file}: missing key "${k}"`);
    }
    const inc = overlay.include_experience;
    if (Array.isArray(inc)) {
      for (const id of inc) {
        if (!expIds.has(id)) note(`roles/${file}: include_experience references unknown id "${id}"`);
      }
    } else if (inc !== 'all') {
      note(`roles/${file}: include_experience must be array or "all"`);
    }
    const incc = overlay.include_certifications;
    if (Array.isArray(incc)) {
      for (const id of incc) {
        if (!certIds.has(id)) note(`roles/${file}: include_certifications references unknown id "${id}"`);
      }
    } else if (incc !== 'all') {
      note(`roles/${file}: include_certifications must be array or "all"`);
    }
    for (const id of Object.keys(overlay.experience_overrides ?? {})) {
      if (!expIds.has(id)) note(`roles/${file}: experience_overrides has unknown id "${id}"`);
    }
  }
}

if (errors.length) {
  console.error('Data validation failed:');
  for (const e of errors) console.error('  • ' + e);
  process.exit(1);
}
console.log('Data validation passed.');
