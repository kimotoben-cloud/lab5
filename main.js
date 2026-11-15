import {program} from 'commander'
import fs from 'fs/promises'
import http from 'http'
import agent from 'superagent'

program
 .requiredOption('-h, --host <address>',"адреса на якій працює сервер")
 .requiredOption('-p,--port <number>',"порт сервера")
 .requiredOption('-c,--cache <path>',"Шлях до теки, у якій зберігаються кешовані картинки")

 program.parse()
 const options = program.opts()

 async function file(files){
	 try{
		const data = await fs.access(files)
		
	 }
	 catch(err){
	 console.log(err)
	 }
 }
 file(options.cache)
  const server = http.createServer(async(req,res)=>{
	  
  })
  await server.listen(options.port,options.host)
	      console.log(`Сервер успішно запущено.`)
    console.log(`Слухаю на http://${options.host}:${options.port}/`)

 