const express = require('express');


//const bodyParser = require('body-parser'); //////ESTE CÓDIGO É NECESSÁRIO PARA INTRODUZIR ESSA THIRD PARTY PACKAGE DE 'body-parser' AO NOSSO CÓDIGO... ELA É MUITO POPULAR (e conveniente).
//CÓDIGO DE MERDA, DEPRECADO.



const locationRoutes = require('./routes/location');


const app = express();



//app.use(bodyParser.urlencoded({extended: true})); //////EIS O CÓDIGO-REFERENCIA DO BODYPARSER... tem varios métodos, que podemos ver se digitarmos '.' MAS ESSE BODYPARSER É UMA BOSTA... FOI INTEGRADO AO EXPRESS.JS, POR ISSO NÃO PRECISAMOS MAIS DELE... Use a versão do EXPRESS.JS, que não está deprecada...




app.set('view engine', 'ejs');
app.set('views', 'views');





/*
app.use(express.urlencoded({extended: false}));
*/


//app.use(express.json());


app.use(express.json());



app.use((req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.setHeader('Access-Control-Allow-Method', 'POST, GET, OPTIONS');  //////o método de tipo 'OPTIONS' sempre é necessário quando queremos USAR O BROWSERSIDE PARA __ENVIAR ____ REQUESTS DE TIPO 'POST'... (ou, vice-versa, quando queremos RECEBER REQUESTS DE TIPO 'POST' de nosso browser/client/usuário)...
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();

})







app.use(locationRoutes);





//app.use(express.urlencoded({extended: false})); ///////ESSE CÓDIGO FAZ A MESMA COISA DO DE CIMA (teoricamente)... mas não ESTÁ DEPRECADO, o que é melhor



app.use((req, resp, next ) => {
    resp.setHeader('Content-Type', 'text/html');
    next();
});






app.use((req, resp, next) => {
    const userName = req.body.username || 'Unknown user';
  /*  if(body) {      -----------------> ESSE IF CHECK DO BODY NÃO É NECESSÁRIO NO 'EXPRESS.JS'... só é necessário no node.js PURO.
        userName = body.split('=')[1];
    } */
    /*resp.send('<h1>Hello World!</h1>');
    resp.send(`<h1>Hi, ${userName}</h1><form method="POST" action="/"><input name="username" type="text"><button type="submit">Send</button></form>`);*/
  resp.render('index', {
      user: userName,
      message: 'funciona'
  })
    



      })  



app.listen(3000);