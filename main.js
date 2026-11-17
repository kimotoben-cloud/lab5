import { program } from 'commander';
import fs from 'fs/promises';
import http from 'http';
import agent from 'superagent';

program
  .requiredOption('-h, --host <address>', "адреса на якій працює сервер")
  .requiredOption('-p, --port <number>', "порт сервера")
  .requiredOption('-c, --cache <path>', "Шлях до теки, у якій зберігаються кешовані картинки");

program.parse();
const options = program.opts();