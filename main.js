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
           try {
                const response = await agent.get(`https://http.cat/${code}`);
                await fs.writeFile(cache, response.body);
                res.writeHead(200, { "Content-Type": 'image/jpeg', "Source": "http.cat" });
                res.end(response.body);
            } catch (err) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("Not Found");
            }
        }
    } else if (req.method == "PUT") {
        try {
            const chunks = [];
            for await (const chunk of req) {
                chunks.push(chunk);
            }
            const image = Buffer.concat(chunks);

            await fs.writeFile(`${options.cache}/${code}.jpg`, image);
            res.writeHead(201, { "Content-Type": "text/plain" });
            res.end("Created");
        } catch (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not Found");
        }
        
    } else if (req.method == "DELETE") {
        try {
            await fs.unlink(`${options.cache}/${code}.jpg`);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Deleted");
        } catch (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not Found");
        }
        
    } else {
        res.writeHead(405, { "Content-Type": "text/plain", "Allow": "GET, PUT, DELETE" });
        res.end("Method Not Allowed");
    }

});

await server.listen(options.port, options.host);
console.log(`Сервер успішно запущено.`);
console.log(`Слухаю на http://${options.host}:${options.port}/`);