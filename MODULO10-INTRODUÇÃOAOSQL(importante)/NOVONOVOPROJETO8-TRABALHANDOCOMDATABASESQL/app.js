
const path = require('path');

const express = require('express'); ///necessário.

const bodyParser = require('body-parser');

const expressHbs = require('express-handlebars');

const app = express(); /////necessário.





app.set('view engine', 'ejs'); 



// const adminData = require('./routes/admin');


const adminRoutes = require('./routes/admin');


const shopRoutes = require('./routes/shop');


const errorController = require('./controllers/error');


const db = require('./util/database'); ///////SERÁ/É O EXPORT da 'pool'/'database' SQL que vamos querer utilizar....





// db.execute('SELECT * FROM products').then(
//   (result) => {
//     console.log(result[0]); ////o primeiro elemento do  ARRAY retrievado por uma query DE FETCH DISPARADA a uma database SQL é __SEMPRE _UM ARRAY COM A 'PRÓPRIA DATA'... (é a data que queremos fetchear)...
//     console.log(result[1]); //JÁ O SEGUNDO ELEMENTO NESSE array é SEMPRE __ UM ARRAY__ COM METADATA acerca da data que foi fetcheada (A data que foi fetcheada fica no 'result[0]'...)
//   }

// ).catch(
//   (err) => {
//     console.log(err);
//   }
// );

app.use(bodyParser.urlencoded({extended: false})); ////1 DE _DIVERSOS_ MÉTODOS__ que podemos usar para PARSEAR NOSSAS 'INCOMING REQUESTS'....--> nesse caso, vamos usar 'urlencoded()', que é algo que usamos PARA PARSEAR DADOS ENVIADOS POR MEIO DE UMA FORM...




app.use(express.static(path.join(__dirname, 'public'))); ////////    COM ISSO, COM ESSE SIMPLES MIDDLEWARE, USERS  DEVERÃO/CONSEGUIRÃO  SER CAPAZES  DE ACESSAR O  FOLDER 'PUBLIC'  NO ROOT FOLDER.... --> FAZEOMS ISSO PARA CONSEGUIR FAZER 'SERVE' DAS __ FILES CSS__ DE NOSSO PROJETO (ver aula 'serving files statically', em que SOLUCIONAMOS O PROBLEMA ___ DOS ARQUIVOS CSS SERVIDOS/UTILIZADOS EM PÁGINAS SERVIDAS PELO NODEJS/EXPRESSJS...)
///^^^este código é MUITO IMPORTANTE.



app.use(
 

  '/admin', //será APLICADO NA URL de nosso path, do path desse negócio aí... (que está lá em 'admin.js')...


      

    adminRoutes ////uso do EXPRESSJS...
);



app.use(
  shopRoutes   ////uso do EXPRESSJS...
)




app.use(

  errorController.error404
)




app.listen(3000); ///é um resumo/shorthand de 'const server = http.createServer(app);' e 'server.listen(3000)'...
                    ///também torna desnecessário o import de 'const http = require('http'), PQ ESES MÓDULO JÁ VEM COM esse método '.listen()' no nosso app EXPRESS..