
// This is a helper script to run Next.js in compatibility mode with the existing setup
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if Next.js is available in node_modules
try {
  require.resolve('next');
  console.log('Next.js found in node_modules, starting in compatibility mode...');
  
  // Launch Next.js dev server with Turbopack
  const nextProcess = spawn('npx', ['next', 'dev', '--turbo'], {
    stdio: 'inherit',
    shell: true
  });
  
  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
  });
  
} catch (e) {
  console.error('Next.js is not installed. Please run: npm install next@latest');
  console.log('You can install it manually without modifying package.json by running:');
  console.log('npx -p next@latest next dev --turbo');
}
