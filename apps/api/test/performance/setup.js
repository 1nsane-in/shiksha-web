// ponytail: Node.js setup script — NOT a k6 script.
// Run: node test/performance/setup.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function platform() {
  if (process.platform === 'win32') return 'windows';
  if (process.platform === 'darwin') return 'mac';
  return 'linux';
}

function installGuide() {
  const guides = {
    windows:
      'Download the installer from https://k6.io/docs/get-started/installation/\nOr using winget: winget install k6',
    mac: 'brew install k6',
    linux: 'sudo apt install k6  # or snap install k6\nSee https://k6.io/docs/get-started/installation/ for other distros',
  };
  return guides[platform()] || guides.linux;
}

async function main() {
  console.log('=== k6 Performance Test Setup ===\n');

  // Check if k6 is available
  try {
    const ver = execSync('k6 version', { encoding: 'utf8', stdio: 'pipe' }).trim();
    console.log(`✅ k6 is installed: ${ver}`);
  } catch {
    console.log('❌ k6 is not installed.');
    console.log(`\nInstall it for ${platform()}:\n${installGuide()}\n`);
    const ans = await ask('Open the installation page in your browser? (y/n): ');
    if (ans.toLowerCase() === 'y') {
      execSync('start https://k6.io/docs/get-started/installation/', { stdio: 'ignore' });
    }
    rl.close();
    return;
  }

  // Create .env.perf if missing
  const envPath = path.join(__dirname, '.env.perf');
  if (!fs.existsSync(envPath)) {
    const example = path.join(__dirname, '.env.example');
    if (fs.existsSync(example)) {
      fs.copyFileSync(example, envPath);
      console.log(`✅ Created .env.perf from .env.example — edit it with your server details.`);
    }
  } else {
    console.log(`✅ .env.perf already exists.`);
  }

  console.log('\nReady. Run tests with:');
  console.log('  npm run test:perf:check   # health check');
  console.log('  npm run test:perf:smoke   # smoke test');
  console.log('  bash test/performance/run-all.sh  # full pipeline\n');

  rl.close();
}

main();
