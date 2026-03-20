import { spawn } from 'node:child_process';

const child = spawn(process.execPath, ['server.mjs'], {
  stdio: 'inherit',
  shell: false,
  env: {
    ...process.env,
    HOST: '0.0.0.0'
  }
});

child.on('exit', (code) => process.exit(code ?? 0));
