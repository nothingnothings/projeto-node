const express = require('express');

const bodyParser = require('body-parser'); ///PRECISO DISSO PARA 'PARSE INCOMING REQUEST BODIES'...





const app = express();

const feedRoutes = require('./routes/feed');



// app.use(bodyParser.urlencoded()); ///x-www-form-urlencoded <form> ------> USADO EM APPS NODEEXPRESS __ COMUNS__, apps que __ RECARREGAM A PAGE QUANDO UMA FORM É SUBMITTADA.... (e que NÃO TRABALHAM COM O SEND DE JSON DATA NOS REQUESTS E RESPOSNES...) --> E ISSO __ NÃO FUNCIONA COM REST APIs (SPAS e apps de tipo MOBILE...)



app.use(bodyParser.json()); //////application/json  nas suas RESPONSES E REQUESTS.... --> USADO EM REST APIs, apps REACT, apps MOBILE, apps com 'DECOUPLED FRONTEND AND BACKEND'...  --> APPS SEM RELOAD DE PAGE... -------> O MÉTODO '.json()' do bodyParser é USADO PARA __ PARSEAR COM SUCESSO A JSON DATA EMBUTIDA NOS REQUESTS QUE VAO SER ENVIADOS AO NOSSO BACKEND/APP NODEEXPRESS...




app.use(
    (req, res, next) => { ////VER AULA 360 ---> USADO PARA __ EVITAR ERROS DE 'CORS' no nosso app..... é usado para DAR PERMISSÃO, PARA DIZER 'ITS FINE TO ACCEPT REQUESTS FROM A FRONTEND THAT IS NOT SERVED BY THE SAME SERVER THAT RUNS OUR BACKEND'....

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Method', 'POST, GET, PUT, PATCH, DELETE OPTIONS');  //////o método de tipo 'OPTIONS' sempre é necessário quando queremos USAR O BROWSERSIDE PARA __ENVIAR ____ REQUESTS DE TIPO 'POST'... (ou, vice-versa, quando queremos RECEBER REQUESTS DE TIPO 'POST' de nosso browser/client/usuário)...
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); ///content-type ---> usado para CONSEGUIR ENVIAR REQUESTS COM JSON DATA... ---> 'Authorization -->  USADO PARA FAZER COM QUE NOSSOS REQUEST OBJECTS consigam SEGURAR UM HEADER ADICIONAL QUE TERÁ 'AUTHORIZATION DATA' acerca de nossos users...
        next(); ///necessário

    }
)



app.use('/feed', feedRoutes);








app.listen(8080); ///usamos '8080' em vez de '3000', em REST APIs como esta....