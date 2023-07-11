const path = require('path');



const express = require('express');




const rootDir = require('../util/path'); /////UTILITY FUNCTION DE AUTORIA DO PROFESSOR.... --> substitui o trecho ""'__dirname, '..' ""       VISTO EM CÓDIGOS COMO 'path.join(__dirname, '..', 'views', 'add-product.html') , que ficam tipo 'path.join(rootDir, 'views', 'add-product.html');'....

const router = express.Router();

// router.use('/add-product',  ///ALTERAMOS ESSE PATH AÍ
//(req, res, next) => {
// router.get('/add-product', (req, res, next) => {
//   console.log('test; IN THE MIDDLEWARE');
//   res
//   .status(200)
//   .send(
//     '<form action="/product" method="POST"><input type="text" name="title"></input><button type="submit">ADD PRODUCT</button></form>'
//   );
// });

// router.post('/product',  ////ALTERAMOS ESSE PATH AÍ, COLOCAMOS O 'COMMON STARTING PATH' de '/admin'..
//(req, res, next) => {
//   console.log(req.body);
//   res
//   .status(302)
//   .redirect('/');
// });





// router.get('/admin/add-product', (req, res, next) => {
    router.get('/add-product', (req, res, next) => { ///esse path de 'add-product' NÃO VAI CONFLITAR COM O DE BAIXO PQ os METHODS QUE TRIGGAM ESSAS 2 ROUTES SÃO DIFERENTES (um é 'post', o o outro é get...)
    console.log('test; IN THE MIDDLEWARE');
    res
    .status(200)
    .sendFile(
        // path.join(__dirname, '..', 'views', 'add-product.html') //versão nua e crua desse código.
        path.join(rootDir, 'views', 'add-product.html') // VERSÃO DO PROFESSOR DESSE CÓDIGO de cima... --> utiliza-se de uma função helper 'rootDir' para substituir '__dirname' e '..'...
    )
    // .send(
    //   '<form action="/admin/add-product" method="POST"><input type="text" name="title"></input><button type="submit">ADD PRODUCT</button></form>'
    // );
  });
  
//   router.post('/admin/product', (req, res, next) => {
    router.post('/add-product', (req, res, next) => { ///esse '/admin' FOI TRANSPORTADO/OUTSOURCEADO como filter lá no 'app.use()' em 'app.js' (arquivo) QUE SE UTILIZA DESSA NOSSA ROUTE/MIDDLEWARE que faz esse redirect.... 
    console.log(req.body);
    res
    .status(302)
    .redirect('/');
  });









// router.use();

// router.get();
// router.post();

module.exports = router;
