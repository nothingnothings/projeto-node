// const path = require('path');

const express = require('express');

// const rootDir = require('../util/path'); /////UTILITY FUNCTION DE AUTORIA DO PROFESSOR.... --> substitui o trecho ""'__dirname, '..' ""       VISTO EM CÓDIGOS COMO 'path.join(__dirname, '..', 'views', 'add-product.html') , que ficam tipo 'path.join(rootDir, 'views', 'add-product.html');'....

const adminController = require('../controllers/admin');

const { check, body } = require('express-validator');

const Product = require('../models/product');

const authCheckerAndRedirecter = require('../middleware/isAuth');

const router = express.Router();

// const admin = [];

router.get(
  '/product-list-admin',

  authCheckerAndRedirecter,
  adminController.getProductsAdminPage
);

router.post(
  '/edit-product',
  authCheckerAndRedirecter,



[
  check('title')
    // .isAlpha() ///se vocÊ escrever 1 WHITE SPACE, NÃO SERÁ CONSIDERADO 1 LETTER, E NEM UM NUMBER, E VAI TE DAR 1 ERRO de validation...
    .isString() //JÁ 'isString()' ACEITA QUE VOCÊ ESCREVA WHITESPACES, pq strings aceitam isso...
    .withMessage('Products must contain only letters.')
    .trim(),

      check('imageUrl')
      .isURL()
      .withMessage('Please input a valid URL')
      .trim()
      ,


      check('price')
      // .isNumeric()
      .isFloat({min: 1})
      .withMessage('Price must be a number, and must be greater than 0.')
      .isDecimal({force_decimal: true, decimal_digits: 2})
      .withMessage('Price must include cents.')
      .trim()
      .toFloat()
      ,

      check('description')
      .isLength({min: 6})
      // .isAlpha()
      .isString()
      .withMessage('Your description must contain only letters')
],


  adminController.editProduct
);

router.get(
  '/edit-product/:productId',
  authCheckerAndRedirecter,
  adminController.getEditProductPage
);

// // router.patch('/edit-product/:productId', adminController.editProduct);

// // router.post('/edit-product/:productId', adminController.editProduct); __QUERY PARAMS_ NÃO SÃO NECESSÁRIOS EM REQUESTS DE TIPO 'POST'/ROUTES ACESSADAS POR REQUESTS DE TIPO POST... (isso pq a DATA NECESSÁRIA JÁ SERÁ 'ENCLOSED' DENTRO DO REQUEST DE TIPO POST, E A URL EM SI, COM OS QUERY PARAMS, SERÁ INÚTIL PARA ISSO, REDUNDANTE...)

router.get(
  '/add-product',

  authCheckerAndRedirecter,
  adminController.getAddProductPage

  //   res.render('add-product',

  //   {pageTitle: 'Add Product',  //RENDER. USADO COM TEMPLATING ENGINES COMO 'pug'....

  //   path: '/admin/add-product',
  //   activeAddProduct: true,
  //   productCSS: true,
  //   formsCSS: true

  // }
);

router.post(
  '/delete-product',

  authCheckerAndRedirecter,
  adminController.postDeleteProduct
);

router.post(
  '/add-product',
  authCheckerAndRedirecter,

  check('title')
    // .isAlpha()
    .isString()
    .withMessage('Products must contain only letters.')
    .trim()
    .custom((value, { req }) => {
      ////EIS O CÓDIGO EM QUESTÃO. //////ESSE BLOCO '.custom()' É UM __ EXEMPLO DE ' ASYNC VALIDATION'.. --> para mais informações, VER AULA 291, adding async validation.... (é async validation pq NOSSO APP VAI QUERER CONTATAR A DATABASE PARA CHECAR SE O EMAIL INPUTTADO PELO USER JÁ NÃO EXISTE DENTRO DE 1 USER PRÉVIO, O QUE O TORNARIA INVÁLIDO/INUSÁVEL...)

      console.log(value);
      return Product.findOne({ title: value }).then((product) => {
        console.log(product);
        if (product) {
          console.log(product, 'LINE');
          return Promise.reject(
            'A product with the chosen title already exists, please choose another one.'
          );
        } else {
          return value;
        }
      });
    }),



      check('imageUrl')
      .isURL()
      .withMessage('Please input a valid URL')
      .trim()
      .custom((value, { req }) => {
            ////EIS O CÓDIGO EM QUESTÃO. //////ESSE BLOCO '.custom()' É UM __ EXEMPLO DE ' ASYNC VALIDATION'.. --> para mais informações, VER AULA 291, adding async validation.... (é async validation pq NOSSO APP VAI QUERER CONTATAR A DATABASE PARA CHECAR SE O EMAIL INPUTTADO PELO USER JÁ NÃO EXISTE DENTRO DE 1 USER PRÉVIO, O QUE O TORNARIA INVÁLIDO/INUSÁVEL...)
      
            console.log(value);
            return Product.findOne({ imageUrl: value }).then((product) => {
              console.log(product);
              if (product) {
                console.log(product, 'LINE');
                return Promise.reject(
                  'A product with the chosen imageUrl already exists, please type another url.'
                );
              } else {
                return value;
              }
            });
          })
      


      ,


      check('price')
      // .isNumeric()
      .isFloat({min: 1})
      .withMessage('Price must be a number, and must be greater than 0.')
      .isDecimal({force_decimal: true, decimal_digits: 2})
      .withMessage('Price must include cents.')
      .toFloat(),




      check('description')
      .isAlpha()
      .withMessage('Your description must contain only letters'),








  adminController.postAddProduct
  // (req, res, next) => {

  //   admin.push(
  //     {title: req.body.title}
  //   )
  //   console.log(admin);
  //   res.status(302).redirect('/');
  // }
);

// exports.routes = router;

// exports.admin = admin; /////COMO NÃO TEREMOS/TEMOS MAIS O ARRAY VAZIO DE 'admin' AQUI NESSE ARQUIVO ROUTE(foi transferido para o arquivo de CONTROLLERS de 'admin.js'...), PODEMOS SIMPLESMENTE REMOVER ESSE EXPORT __ E PASSAR __ a MANTER APENAS O EXPORT DO 'router', da const 'router 'que SEGURA NOSSA ROUTE...

module.exports = router; //tipo assim....
