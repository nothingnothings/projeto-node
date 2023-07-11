// const http = require('http'); desnecessário, pois ESSE MÓDULO JÁ É 'IMPLÍCITO'/utilizado __ lá no EXPRESSJS, já está contido naquele MÉTODO '.listen(3000)' DE 'app' (que É O NOSSO APLICATIVO EXPRESSJS, no final das contas....)


const path = require('path');

const express = require('express'); ///necessário.

const bodyParser = require('body-parser');

const app = express(); /////necessário.




const adminRoutes = require('./routes/admin');


const shopRoutes = require('./routes/shop')




// app.use(
//     (req, res, next) => { ////////ESSE MIDDLEWARE FARÁ COM QUE ESSE HEADER SEJA SETTADO/ENVIADO EM TODAS AS ROUTES/PATH FILTERS DE NOSSO APP....
//         res.json({
//             message: 'EXEMPLO'
//         })

//     }
// )



app.use(bodyParser.urlencoded({extended: false})); ////1 DE _DIVERSOS_ MÉTODOS__ que podemos usar para PARSEAR NOSSAS 'INCOMING REQUESTS'....--> nesse caso, vamos usar 'urlencoded()', que é algo que usamos PARA PARSEAR DADOS ENVIADOS POR MEIO DE UMA FORM...




app.use(express.static(path.join(__dirname, 'public'))); ////////    COM ISSO, COM ESSE SIMPLES MIDDLEWARE, USERS  DEVERÃO/CONSEGUIRÃO  SER CAPAZES  DE ACESSAR O  FOLDER 'PUBLIC'  NO ROOT FOLDER.... --> FAZEOMS ISSO PARA CONSEGUIR FAZER 'SERVE' DAS __ FILES CSS__ DE NOSSO PROJETO (ver aula 'serving files statically', em que SOLUCIONAMOS O PROBLEMA ___ DOS ARQUIVOS CSS SERVIDOS/UTILIZADOS EM PÁGINAS SERVIDAS PELO NODEJS/EXPRESSJS...)
///^^^este código é MUITO IMPORTANTE.





/////// LINHAS MOVIDAS LÁ PARA O 'admin.js', que é ONDE DEFINIMOS UM 'EXPRESS ROUTER'...

// app.use( 
//     '/add-product', ///PATH FILTER. cumpre a mesma funçaõ de 'if(url === '/')' NO NODEJS NORMAL...
//     (req, res, next) => {
            
//   console.log('test; IN THE MIDDLEWARE');
//   res.send('<form action="/product" method="POST"><input type="text" name="title"></input><button type="submit">ADD PRODUCT</button></form>');
//   // res.send('<h1>Hello from product!</h1>');
// });


// // app.use( ///ACEITA/RECEBE __ REQUESTS__ DE TODO E QUALQUER METHOD, não se importa....
//   //app.get//// ACEITA/RECEBE APENAS REQUESTS DE METHOD 'GET', e nenhum outro....
//   app.post( ////ACEITA/RECEBE APENAS REQUESTS DE METHOD 'post', e nenhum outro... (isso nesse PATH específico...)
//   '/product', (req, res, next) => {
//       console.log(req.body);  ///feature do EXPRESSJS.... -> ver middleware de 'urlencoded', que é o que possibilita isto...
//       res.redirect('/');
//   }
// )


/////// ver mensagem logo acima... 







app.use(
 

  '/admin', //será APLICADO NA URL de nosso path, do path desse negócio aí... (que está lá em 'admin.js')...


   adminRoutes   ////uso do EXPRESSJS...
);



app.use(
  shopRoutes   ////uso do EXPRESSJS...
)




// app.use(
//     '/', ///////PATH FILTER.
//     (req, res, next) => {


//   console.log('test2; IN ANOTHER MIDDLEWARE'); ///agora este código será alcançado...
//   res.send('<h1>Hello from express!</h1>'); ////o 'send()' já setta nos headers UM CONTENT-TYPE DE 'html/text' POR DEFAULT.. (e é claro que você pode OVERWRITTAR ESSE COMPORTAMENTO POR MEIO DE CÓDIGOS COMO  'setHead' e 'setHeader'...)
// });

// const server = http.createServer(app); ////app ---> é a constante que temos logo acima (sim, o expressJS, quando armazenado em uma CONST, fica com um formato parecido com o de um REQUESTHANDLER, parecido com um '(req, res) => {}')
                    /////^^^^^SUBSTITUÍDO POR 'app.listen(3000)', assim como a linha logo abaixo....


// server.listen(3000); ///resumido/substituído por 'app.listen(3000)', que age como shorthand disso... (É UMA FEATURE DO EXPRESS.).




app.use(
  (req, res, next) => { ///CLÁSSICO USE-CASE DE UM __ RETORNADOR DE PÁGINA DE 'ERRO 404'... ---> PAGE NOT FOUND... ---> COMO ESSE MIDDLEWARE ESTÁ DEFINIDO BEM NO FINAL DESSE ARQUIVO 'app.js', ELE __ SÓ SERÁ EXECUTADO SE NENHUM OUTRO MIDDLEWARE FOR ATIVADO A PARTIR DO PATH/URL besteirol/inexistente que o usuário inputtou...
      // res.status(404).send('<h1>PAGE NOT FOUND!</h1>'); ///EXEMPLO DE CHAINING DE METHODS JUNTO DE 'send' (aqui usamos 'status' antes, para definir um STATUS CODE DE 404, page not found...)
 
      res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
 
    } 
)




app.listen(3000); ///é um resumo/shorthand de 'const server = http.createServer(app);' e 'server.listen(3000)'...
                    ///também torna desnecessário o import de 'const http = require('http'), PQ ESES MÓDULO JÁ VEM COM esse método '.listen()' no nosso app EXPRESS..