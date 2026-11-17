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

async function file(files) {
    try {
        await fs.access(files);
    } catch (err) {
        await fs.mkdir(files, { recursive: true });
    }
}

await file(options.cache);


const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${options.host}:${options.port}`);
    const code = url.pathname.slice(1);
    const cache = `${options.cache}/${code}.jpg`;
 

    if (req.method == "GET") {
        try {
            const image = await fs.readFile(cache);
            res.writeHead(200, { "Content-Type": 'image/jpeg', "Source": "cache" });
            res.end(image);
        } catch (err) {
           
        }
    }

});

await server.listen(options.port, options.host);
console.log(`Сервер успішно запущено.`);
console.log(`Слухаю на http://${options.host}:${options.port}/`);