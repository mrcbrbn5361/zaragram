import { spawn } from 'node:child_process';
import { getNpmCommand } from './runtime-utils.mjs';

const port = process.env.PORT ?? '3000';
const npmCommand = getNpmCommand();

const child = spawn(npmCommand, ['run', 'dev', '--', '--hostname', '0.0.0.0', '--port', port], {
  stdio: 'inherit',
  shell: false,
  env: process.env
});

child.on('exit', (code) => process.exit(code ?? 0));
