












// let message: string = 'Hi there!';






// console.log(message);








const text = 'this is a text - and it should be stored in a file';
    




const encoder = new TextEncoder();  ////CONSTRUCTOR FUNCTION __ DISPONÍVEL___ GLOBALMENTE NO DENO.... (vamos o utilizar para CONVERTER NOSSA STRING EM BYTES, EM 1 DATA NO FORMATO 'Uint8Array', que é o formato ACTUALLY SUPORTADO POR 'writeFile'...)




const data = encoder.encode(text);



Deno.writeFile('message.txt', data)
.then(
    (result) => { ////COMO O DENO É UMA LANGUAGE QUE 'embraces new javascript features', ELE ACEITA TOTALMENTE PROMISES, E ODEIA CALLBACKS em funções... (pq elas fedem)...
            console.log( ///NOSSO CÓDIGO VAI __ FALHAR/DAR ERROR, INICIALMENTE, POR 'FALTA DE PERMISSOES' no execute dessa função...
                'wrote to file!'
            )
    }
)
.catch(
    (err) => {
        console.log(err);
    }
)




///////////// 'STANDARD LIBRARY' DO DENO, USADA PARA __ 'SPIN UP A WEB SERVER', de protocolo HTTP.... ----> ainda é uma versão meio 'VANILLA' de um webserver deno (raramente vamos usar SÓ O DENO E ESSA LIBRARY DE HTTP PARA SETTAR UM SERVER HTTP DENO)....

// import { serve } from "https://deno.land/std@0.119.0/http/server.ts"; ////OUTRO DIFERENCIAL DO DENO... ELE NOS PERMITE REALIZAR 'URL IMPORTS' (ou seja, importar FUNCTIONS DE ARQUIVOS CONTIDOS EM URLS NA INTERNET, em servidores remotos... --> aqui estamos IMPORTANDO A FUNCTION 'serve' LÁ DESSE ARQUIVO 'server.ts', contido nessa url do deno...)
// serve(() => new Response("Hello World\n"), {port: 3000}); ///// 1o argumento de 'serve' __ É UM HANDLER, objeto em que você DEFINE A RESPONSE QUE VOCÊ VAI QUERER MANDAR....



// console.log("http://localhost:3000/"); 
// for await(const req of server) { ///////VELHO -_ CÓDIGO__ Da standard library de 'http'... não é mais suportado..
//     req.respond({body: 'Hello World\n'})
// }









import { Application } from "https://deno.land/x/oak/mod.ts";  ///// 'THIRD PARTY MODULE/LIBRARY' do _DENO__, a library de 'OAK' (middleware que é '''TIPO O EXPRESS DO DENO''', usado para FACILITAR O WRITE DE RESPONSES AOS SEUS USERS, E O SETUP DO SEU WEBSERVER)...

const app = new Application();

app.use((ctx, next) => { ///'ctx' SIGNIFICA 'CONTEXT'... 
  ctx.response.body = "Hello World!";   
});

await app.listen({ port: 3000 });





// Deno.seek
