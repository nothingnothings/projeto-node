
/////////////////////////////////////////


//ESTE É UM WORKAROUND PARA CONSEGUIRMOS USAR '__DIRNAME' E '__FILENAME' AO MESMO TEMPO QUE USAMOS A  SINTAXE DE IMPORTS/EXPORTS ES6...
 
// import { fileURLToPath } from 'url';

// import { dirname } from 'path';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);



//////////////////////////////////////////


 
import { fileURLToPath } from 'url'; ///gambiarra para podermos usar '__dirname'...

import { dirname } from 'path';

import fs from 'fs/promises'; //VERSÃO 'PROMISE-BASED' de 'fileSystem' (a única diferença é a MANEIRA QUE VOCê ESCREVE AS OPERAÇÕES, PQ A FUNCIONALIDADE EM SI É IGUAL)... --> EM VEZ DE USARMOS 'CALLBACKS', como na versão 'from fs' NORMAL, __ AQUI__ VAMOS ESCREVER then-catch blocks, ou então 'ASYNC/AWAIT'.... (bem mais legível e moderno)...


// const fs = require('fs').promises; ////versão DE __ 'IMPORT VELHO' (node) DESSE PACOTE DE 'PROMISES' (pq você não é obrigado a USAR A SINTAXE DE IMPORTS NOVA, ES6, para conseguir USAR ESSA NOVA SINTAXE DE 'PROMISES' no lugar da sintaxe dos callbacks, com seus módulos)...

// import fs from 'fs';





const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);





import path from 'path';

// const pageRoute = (req, res, next) => { ///VERSÃO COM CALLBACK (sintaxe antiga, sem A VERSÃO 'promise' do pacote 'fs'.... ) --> se quisermos a versÃO promise, devemos escrever 'import fs from 'fs/promises'.. 
//     fs.readFile('my-page.html', 'utf8', (err, data) => {
//       res.send(data);
//     });
//   }



export const pageRoute = (req, res, next) => { ///VERSÃO __ COM PROMISES (then-catch)....

  fs.readFile('my-page.html', 'utf8')
  .then(
      (data) => {
          res.send(data);
      }
  )
  .catch(
      (err) => {
          console.log(err);
      }
  )
}










//   export const pageRoute = async (req, res, next) => { //versão async/await.... (TAMBÉM COM PROMISES, MAS SINTAXE ALTERNATIVA)..


//     try {

//    const examinedFile = await fs.readFile('my-page.html', 'utf8');

//    res.send(examinedFile);

//     } catch (err) {
//                 console.log(err);
//     }


// }




  const pageRoute = (req, res, next) => {
    fs.readFile('my-page.html', 'utf8', (err, data) => {
    //   res.sendFile(path.join(__dirname, 'my-page.html')) //ISSO __ NÃO FUNCIONARÁ, NOS DARÁ UM __ ERRO ('__dirname' is not defined)....

    res.sendFile(path.join(process.cwd(), 'my-page.html' )) ///já o 'process.cwd()', no lugar de DIRNAME, funciona...
    });
  }




  export const chinelo = () => {
      console.log('exemplo');
  }



  export default pageRoute;