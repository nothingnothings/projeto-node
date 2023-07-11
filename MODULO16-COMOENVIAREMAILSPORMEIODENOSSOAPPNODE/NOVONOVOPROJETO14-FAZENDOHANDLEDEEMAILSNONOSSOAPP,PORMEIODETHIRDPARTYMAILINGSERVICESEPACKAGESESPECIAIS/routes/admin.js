// const path = require('path');

const express = require('express');

// const rootDir = require('../util/path'); /////UTILITY FUNCTION DE AUTORIA DO PROFESSOR.... --> substitui o trecho ""'__dirname, '..' ""       VISTO EM CÓDIGOS COMO 'path.join(__dirname, '..', 'views', 'add-product.html') , que ficam tipo 'path.join(rootDir, 'views', 'add-product.html');'....

const adminController = require('../controllers/admin');



const authCheckerAndRedirecter = require('../middleware/isAuth');


const router = express.Router();

// const admin = [];




router.get('/product-list-admin', 

authCheckerAndRedirecter,
adminController.getProductsAdminPage);



router.post('/edit-product', authCheckerAndRedirecter, adminController.editProduct);



router.get('/edit-product/:productId', authCheckerAndRedirecter, adminController.getEditProductPage
);


// // router.patch('/edit-product/:productId', adminController.editProduct);


// // router.post('/edit-product/:productId', adminController.editProduct); __QUERY PARAMS_ NÃO SÃO NECESSÁRIOS EM REQUESTS DE TIPO 'POST'/ROUTES ACESSADAS POR REQUESTS DE TIPO POST... (isso pq a DATA NECESSÁRIA JÁ SERÁ 'ENCLOSED' DENTRO DO REQUEST DE TIPO POST, E A URL EM SI, COM OS QUERY PARAMS, SERÁ INÚTIL PARA ISSO, REDUNDANTE...)




router.get('/add-product',

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


router.post('/delete-product', 

authCheckerAndRedirecter,
adminController.postDeleteProduct)







router.post('/add-product', 
            authCheckerAndRedirecter,
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

