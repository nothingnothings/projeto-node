

const path = require('path');



const express = require('express');



const rootDir = require('../util/path');


const shopController = require('../controllers/shop')

const router = express.Router();

// const adminData = require('../routes/admin');





router.get(
  '/products',
  shopController.getProductsPage
)



router.get(
  '/cart',
  shopController.getCartPage
)



router.get(
  '/orders', 
  shopController.getOrdersPage
)



router.get(
  ///diferente de 'app.use()', pq aqui vamos querer USAR AQUELE ROUTER ALI...
  '/', ///////PATH FILTER.
  // (req, res, next) => {
  //   console.log('test2; IN ANOTHER MIDDLEWARE');
  //   // res.status(200).send('<h1>Hello from express!</h1>');

  //   console.log(adminData.shop);

  //   console.log(path.join(__dirname, '..', 'views', 'shop.html')); //'..' em vez de '/..'
  //   console.log(path.resolve('../novonovoprojeto4', 'views', 'shop.html'));
  //   // res.status(200).sendFile(path.resolve('../novonovoprojeto4', 'views', 'shop.html')); ///COM ISSO, PODEMOS ENVIAR PÁGINAS HTML AO NOSSO USER. É UM METHOD DO EXPRESSJS, e AUTOMATICAMENTE SETTA NOSSO HEADER 'Content-Type'.... (só que às vezes setta de forma ERRADA.)
  //   // res.status(200).sendFile(path.resolve('../novonovoprojeto4', 'views', 'shop.html')); ///RESOLVE --> USADO PARA CONSTRUIR ABSOLUTE PATHS... --> ESSE FORMATO TAMBÉM FUNCIONA, NESSE NOSSO EXEMPLO...
  //   // res.status(200).sendFile(path.join(__dirname, '..', 'views', 'shop.html')); /////ISTO FORMULA RELATIVE PATHS E __ ABSOLUTE PATHS___ (para isso, precisamos de '__dirname', como visto nesse exemplo...)
  //   // res.status(200).sendFile(path.join(rootDir, 'views', 'shop.html')); //VERSÃO QUE UTILIZA UTILITY FUNCTION DO PROFESSOR PARA abreviar '__dirname' e '..' em uma única expressão, 'rootDir'...
  //     //^^^^^ISTO É O SEND DE 'PLAIN HTML' ( sem templating engines em jogo/SEM templates sendo renderizados, como 'pug'...)

  //   const shop = adminData.shop;
                                                                       
  //     res.render('shop', {prods: shop, pageTitle: 'Shop', path: '/',  ////.render() --> É UM MÉTODO PROVIDENCIADO PELO EXPRESSJS, e que vai 'USE THE DEFAULT TEMPLATING ENGINE', a engine que definimos em 'app.set('view engine', 'pug')'... 
  //     productCSS: true,
  //     activeShop: true,
  //     hasshop: shop.length > 0});   ////hasshop, essa propriedade que FAZ UM CHECK pela existência de alguma coisa dentro do array de 'shop', SERÁ APENAS USADA NA VERSÃO DE NOSSO PROJETO QUE USA A TEMPLATING ENGINE DO 'handlebars', devido a SUAS LIMITAÇÕES (ver aula 'convertendo nosso projeto em handlebars')... 
               
  //     ///VAI RENDERIZAR O ARQUIVO 'shop.pug' LÁ NO FOLDER 'views', tudo graças aos códigos 'app.set()' que definimos LÁ EM 'app.js'..
  //                             ///(ou 'shop.hbs')
  //             ////O SEGUNDO PARÂMETRO DE 'render' SERVE __ PARA INJETAR__ DATA ___ DENTRO DO ARQUIVO 'view' QUE VAMOS QUERER RENDERIZARA COM ESSE '.render()'...  (nesse caso, o ARRAY DE 'shop'...)
  //             ///essa data que queremos USAR NO NOSSO TEMPLATE___ DEVE SER MAPPEADA A UM KEYNAME... (nesse caso usamos 'shop' mesmo..)
  //           }
  // shopController.getshop
      shopController.getStartingPage

);


router.get(
  '/checkout',  
  shopController.getCheckoutPage
)




module.exports = router; ///////// DIFERENTE DOS IMPORTS ES6...





///OBS: em 'path.join()' E FUNÇÕES SIMILARES DE 'path', USE SEMPRE '..' EM VEZ DE '/..', PQ ESSE '/' é coisa do WINDOWS, e não vamos querer sugerir que PREFERIMOS WINDOWS, não é mesmo?