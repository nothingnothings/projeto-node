

// import fs from 'fs';

// import path from 'path'; ///ESSES 2 TIPOS DE CÓDIGO (que importam CORE NODE MODULES) não vao funcionar com o typescript.... siga o modelo logo abaixo:




import * as fs from 'fs/promises';    ////vamos querer a versão PROMISES desse código do 'fileSystem'....

import * as path from 'path';


// One more thing - you will need to tell the typescript compiler where do these come from - it is done in the tsconfig.json, with 

// the following line: "compilerOptions": { "types": [ "node" ] } //// CERTO, ISSO FUNCIONOU....




import express from 'express';

import http from 'http';

const app = express();


const text = 'this is a text - and it should be stored in a file, with the help of NODE.'



const filePath = 'message.txt';





fs.writeFile(
    filePath, text
)
.then(
    (result) => {
        console.log(result);
        console.log('Wrote file!');
    }
)
.catch(
    (error) => {
        console.log(error);
    }
)






app.get('/', 

    (req, res, next) => {

            res.send('Hello World! (from NODEEXPRESS)')
    }

)


app.listen(3000);





///VERSÃO PURE NODE DO CODIGO ACIMA....

// const server = http.createServer((req, res) => {

//     res.end('Hello World (from pure Node.js)')


// })



// server.listen(3000);


















//VERSÃO DO DENO DESTE NOSSO CÓDIGO:









// const text = 'this is a text - and it should be stored in a file';
    




// const encoder = new TextEncoder();  ////CONSTRUCTOR FUNCTION __ DISPONÍVEL___ GLOBALMENTE NO DENO.... (vamos o utilizar para CONVERTER NOSSA STRING EM BYTES, EM 1 DATA NO FORMATO 'Uint8Array', que é o formato ACTUALLY SUPORTADO POR 'writeFile'...)




// const data = encoder.encode(text);



// Deno.writeFile('message.txt', data)
// .then(
//     (result) => { ////COMO O DENO É UMA LANGUAGE QUE 'embraces new javascript features', ELE ACEITA TOTALMENTE PROMISES, E ODEIA CALLBACKS em funções... (pq elas fedem)...
//             console.log( ///NOSSO CÓDIGO VAI __ FALHAR/DAR ERROR, INICIALMENTE, POR 'FALTA DE PERMISSOES' no execute dessa função...
//                 'wrote to file!'
//             )
//     }
// )
// .catch(
//     (err) => {
//         console.log(err);
//     }
// )



// import { serve } from "https://deno.land/std@0.119.0/http/server.ts"; ////OUTRO DIFERENCIAL DO DENO... ELE NOS PERMITE REALIZAR 'URL IMPORTS' (ou seja, importar FUNCTIONS DE ARQUIVOS CONTIDOS EM URLS NA INTERNET, em servidores remotos... --> aqui estamos IMPORTANDO A FUNCTION 'serve' LÁ DESSE ARQUIVO 'server.ts', contido nessa url do deno...)
// serve(() => new Response("Hello World\n"), {port: 3000}); ///// 1o argumento de 'serve' __ É UM HANDLER, objeto em que você DEFINE A RESPONSE QUE VOCÊ VAI QUERER MANDAR....




