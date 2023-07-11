// import express from 'express'; //import ES6+  --> PODEMOS USAR ESSA SINTAXE COM ARQUIVOS TYPESCRIPT, PQ ELA SERÁ AUTOMATICAMENTE CONVERTIDA em 'const xx = require(xxx)' pelo TYPESCRIPT, lá nos arquivos '.js' criados a partir dos '.ts'...







// import express = require('express'); ///// FUSÃO DE SINTAXES DE IMPORTS...



import express from 'express';

const app = express();



import bodyParser from 'body-parser';



// import routes from './routes/routes.ts'; ////IMPORTS DE ARQUIVOS '.ts' NÃO FUNCIONAM/NUNCA FUNCIONARÃO...

import routes from './routes/routes';


console.log('TESDXZ')



// app.listen( ///ESSA SINTAXE É __ ERRADA_, E O TYPESCRIPT NOS AVISARÁ DISSO...
// {
//     porta: 'assaas'
// }
// );


console.log('TEST');

console.log('TESTAa');


app.use(bodyParser.json()); ////vamos precisar disso para parsear nossos BODIES, com a json data enfiada neles...



console.log('TEST5666')


app.use(
    (req, res, next) => {

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Method', 'POST, GET, PUT, PATCH, DELETE OPTIONS');  //////o método de tipo 'OPTIONS' sempre é necessário quando queremos USAR O BROWSERSIDE PARA __ENVIAR ____ REQUESTS DE TIPO 'POST'... (ou, vice-versa, quando queremos RECEBER REQUESTS DE TIPO 'POST' de nosso browser/client/usuário)...
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); ///content-type ---> usado para CONSEGUIR ENVIAR REQUESTS COM JSON DATA... ---> 'Authorization -->  USADO PARA FAZER COM QUE NOSSOS REQUEST OBJECTS consigam SEGURAR UM HEADER ADICIONAL QUE TERÁ 'AUTHORIZATION DATA' acerca de nossos users...
        next(); ///necessário

    }
)

console.log('exampasle, example2');


app.use(routes);




app.listen(3000
);




