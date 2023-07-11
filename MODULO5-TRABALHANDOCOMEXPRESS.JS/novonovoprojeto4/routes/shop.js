

const path = require('path');



const express = require('express');



const rootDir = require('../util/path');

const router = express.Router();

router.get(
  ///diferente de 'app.use()', pq aqui vamos querer USAR AQUELE ROUTER ALI...
  '/', ///////PATH FILTER.
  (req, res, next) => {
    console.log('test2; IN ANOTHER MIDDLEWARE');
    // res.status(200).send('<h1>Hello from express!</h1>');


    console.log(path.join(__dirname, '..', 'views', 'shop.html')); //'..' em vez de '/..'
    console.log(path.resolve('../novonovoprojeto4', 'views', 'shop.html'));
    // res.status(200).sendFile(path.resolve('../novonovoprojeto4', 'views', 'shop.html')); ///COM ISSO, PODEMOS ENVIAR PÁGINAS HTML AO NOSSO USER. É UM METHOD DO EXPRESSJS, e AUTOMATICAMENTE SETTA NOSSO HEADER 'Content-Type'.... (só que às vezes setta de forma ERRADA.)
    // res.status(200).sendFile(path.resolve('../novonovoprojeto4', 'views', 'shop.html')); ///RESOLVE --> USADO PARA CONSTRUIR ABSOLUTE PATHS... --> ESSE FORMATO TAMBÉM FUNCIONA, NESSE NOSSO EXEMPLO...
    // res.status(200).sendFile(path.join(__dirname, '..', 'views', 'shop.html')); /////ISTO FORMULA RELATIVE PATHS E __ ABSOLUTE PATHS___ (para isso, precisamos de '__dirname', como visto nesse exemplo...)
    res.status(200).sendFile(path.join(rootDir, 'views', 'shop.html')); //VERSÃO QUE UTILIZA UTILITY FUNCTION DO PROFESSOR PARA abreviar '__dirname' e '..' em uma única expressão, 'rootDir'...

  }
);

module.exports = router; ///////// DIFERENTE DOS IMPORTS ES6...








///OBS: em 'path.join()' E FUNÇÕES SIMILARES DE 'path', USE SEMPRE '..' EM VEZ DE '/..', PQ ESSE '/' é coisa do WINDOWS, e não vamos querer sugerir que PREFERIMOS WINDOWS, não é mesmo?