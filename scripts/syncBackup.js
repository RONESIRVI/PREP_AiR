import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

if (process.platform !== 'win32') {
  console.log('Not on Windows, skipping offline backup sync.');
  process.exit(0);
}

console.log('Syncing backup to R:\\UPSC CONQUEST...');

// Using robocopy to mirror the directory, excluding node_modules and .git
// /MIR = Mirror directory tree
// /XD = Exclude Directories
// /NJH /NJS = No Job Header / No Job Summary (less console spam)
const cmd = `robocopy "${projectRoot}" "R:\\UPSC CONQUEST" /MIR /XD node_modules .git /NJH /NJS`;

exec(cmd, (error, stdout, stderr) => {
  // robocopy returns codes 1-3 for successful copies. >= 4 is an error.
  if (error && error.code >= 4) {
    console.error('Backup sync failed:', error.message);
  } else {
    console.log('✅ Offline Backup synced successfully to R:\\UPSC CONQUEST!');
  }
});
