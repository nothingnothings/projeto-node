const path = require('path');

const express = require('express');

const rootDir = require('../util/path'); /////UTILITY FUNCTION DE AUTORIA DO PROFESSOR.... --> substitui o trecho ""'__dirname, '..' ""       VISTO EM CÓDIGOS COMO 'path.join(__dirname, '..', 'views', 'add-product.html') , que ficam tipo 'path.join(rootDir, 'views', 'add-product.html');'....

const productsController = require('../controllers/products');


const router = express.Router();

// const products = [];

router.get('/add-product',
 productsController.getAddProductPage

//   res.render('add-product', 
  
//   {pageTitle: 'Add Product',  //RENDER. USADO COM TEMPLATING ENGINES COMO 'pug'....
  
//   path: '/admin/add-product',
//   activeAddProduct: true,
//   productCSS: true,
//   formsCSS: true

// }

);

router.post('/add-product', 

      productsController.postAddProduct
// (req, res, next) => {

//   products.push(
//     {title: req.body.title}
//   )
//   console.log(products);
//   res.status(302).redirect('/');
// }
);


// exports.routes = router; 

// exports.products = products; /////COMO NÃO TEREMOS/TEMOS MAIS O ARRAY VAZIO DE 'PRODUCTS' AQUI NESSE ARQUIVO ROUTE(foi transferido para o arquivo de CONTROLLERS de 'products.js'...), PODEMOS SIMPLESMENTE REMOVER ESSE EXPORT __ E PASSAR __ a MANTER APENAS O EXPORT DO 'router', da const 'router 'que SEGURA NOSSA ROUTE...


module.exports = router;//tipo assim....

