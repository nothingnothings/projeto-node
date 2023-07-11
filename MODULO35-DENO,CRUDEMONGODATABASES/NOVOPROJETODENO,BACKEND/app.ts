import { Application } from "https://deno.land/x/oak/mod.ts";  ///// 'THIRD PARTY MODULE/LIBRARY' do _DENO__, a library de 'OAK' (middleware que é '''TIPO O EXPRESS DO DENO''', usado para FACILITAR O WRITE DE RESPONSES AOS SEUS USERS, E O SETUP DO SEU WEBSERVER)...

const app = new Application();



import todoRoutes from './routes/todos.ts';



import { connect } from './helpers/db_client.ts';





connect(); /// fazemos isso para conseguirmos EXECUTAR/CONECTAR NOSSO BACKEND à DATABASe mongodb, inicialmente (2 methods, 'connect' e 'getDb()'; o 'getDb()' é chamado quando querem _ RAELIZAR __ OPERAÇÕES NOS DOCUMENTS PRESOS NA DATABASE...)


// const MONGODB_URI = 'https:/' ///VER ARQUIVO 'db.ts', lá em 'helpers' (folder)....



// import {
//     Bson,
//     MongoClient,
//   } from "https://deno.land/x/mongo@v0.29.0/mod.ts";
  
  






// app.use((ctx, next) => { ///'ctx' SIGNIFICA 'CONTEXT'...
//   ctx.response.body = "Hello World!"; //////ESTE MIDDLEWARE É SIMPLES DEMAIS, VAMOS QUERER USAR ALGO MAIS POTENTE/COMPLEXO PARA RESPONDER AOS REQUESTS ENVIADOS POR NOSSO 'USER'....
// });





// app.use( ////NÃO ESCREVA ASSIM.... (essa é a sintaxe EXPRESS, E NÃO O DENO)...
//     todoRoutes
// )



app.use( ///MIDDLEWARE USADO PARA __ SOLUCIONAR O PROBLEMA __ DE 'CORS' (set de headers conferindo acesso)...
    async (ctx, next) => {
        ctx.response.headers.set('Access-Control-Allow-Origin', '*'); /////vamos usar isso, esse method 'set',  para __ SETTAR NOSSOS HEADERS__, headers na RESPONSe... -> por meio deste 'set', deixamos QUALQUER TIPO DE DOMAIN ENVIAR REQUESTS AO NOSSO SERVEr...
        ctx.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); 
        ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
        await next(); ////respeitará a ORDEM DE EXECUÇÃO.
        
    }
)



app.use(
   async (ctx, next) => { ///QUANDO VOCÊ TEM MÚLTIPLOS MIDDLEWARES QUE FAZEM 'ASYNC STUFF', você (Ao contrário do que vemos em node) É OBRIGADO A COLOCAR 'async' no run desses middlewares, para fazer com que a ORDEM SEJA RESPEITADA ( e para que a response, nesse caso, NÃO SEJA ENVIADA _ CEDO DEMAIS_)....
        console.log('Middleware logged');
      await next();           ///COLOQUE ESSE 'await' em nexT() para INFORMAR O OAK _ DE QUE _ ELE __ DEVE __ ESPERAR__ O RUN DO RESTO DOS MIDDLEWARES (mais para baixo) ANTES _ DE ENVIARMOS DE VOLTA UMA RESPONSE por meio deste middleware de console.log... 
    }
)

app.use( ////ESCREVA ASSIM (sintaxe DENO, com esse method de 'routes' dentro do seu OBJETO importado lá do seu arquivo DE ROUTES)...
    todoRoutes.routes()
)

app.use(
    todoRoutes.allowedMethods() ///////este middleware TAMBÉM É NECESSÁRIo....  (é um request que fará com que o OAK 'PROPERLY HANDLES INCOMING REQUESST' Às suas routes)...
    );





await app.listen({ port: 8080 });

