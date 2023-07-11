// const fs = require('fs');
//const readFile = requireq('fs').readFile;


// import fs from 'fs';  

//import { readFile } from 'fs';

// const express = require('express');


import pageRoute from './routes/route.js'; ///esse '.js' é NECESSÁRIO, QUANDO VOCÊ USA A SINTAXE DE IMPORT/EXPORT ES6 _ NO SERVERSIDE, COM SEUS ARQUIVOS DO PROJETO (só não é necessário o '.js' no final __ QUANDO VOCÊ IMPORTA PACKAGES, COMO 'express', visto logo acima)....


import express from 'express'; ///COMO ISSO É UMA PACKAGE, E NÃO UM ARQUIVO DE NOSSO PROJETO (como 'route.js'), NÃO PRECISAMOS COLOCAR A TERMINAÇÃO DE '.js'....


import { chinelo } from './routes/route.js';


const app = express();



app.get('/', pageRoute);





app.listen(3000);
