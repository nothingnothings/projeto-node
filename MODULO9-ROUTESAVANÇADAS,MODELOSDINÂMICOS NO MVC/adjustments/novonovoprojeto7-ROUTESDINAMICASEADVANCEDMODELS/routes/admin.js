// const path = require('path');

const express = require('express');

// const rootDir = require('../util/path'); /////UTILITY FUNCTION DE AUTORIA DO PROFESSOR.... --> substitui o trecho ""'__dirname, '..' ""       VISTO EM CÓDIGOS COMO 'path.join(__dirname, '..', 'views', 'add-product.html') , que ficam tipo 'path.join(rootDir, 'views', 'add-product.html');'....

const adminController = require('../controllers/admin');


const router = express.Router();

// const admin = [];







router.get('/product-list-admin', 


adminController.getProductsAdminPage);






router.delete('/product-list-admin', 

adminController.deleteProduct);




router.get('/edit-product/:productId', adminController.getEditProductPage
);


// router.patch('/edit-product/:productId', adminController.editProduct);


router.post('/edit-product/:productId', adminController.editProduct);



router.get('/add-product',
 adminController.getAddProductPage

//   res.render('add-product', 
  
//   {pageTitle: 'Add Product',  //RENDER. USADO COM TEMPLATING ENGINES COMO 'pug'....
  
//   path: '/admin/add-product',
//   activeAddProduct: true,
//   productCSS: true,
//   formsCSS: true

// }

);










router.post('/add-product', 

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


module.exports = router;//tipo assim....

