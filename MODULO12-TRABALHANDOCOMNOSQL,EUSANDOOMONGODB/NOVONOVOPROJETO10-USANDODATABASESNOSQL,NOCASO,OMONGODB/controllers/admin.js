const Product = require('../models/product');

const fs = require('fs');

// exports.getAddProductPage = (req, res, next) => {
//     res.render('admin/add-product', {        //RENDER. USADO COM TEMPLATING ENGINES COMO 'pug'...
//       pageTitle: 'Add Product',
//       path: '/admin/add-product',
//       activeAddProduct: true,
//       productCSS: true,
//       formsCSS: true,
//     });
//   };

exports.getAddProductPage = (req, res, next) => {
  const editMode = req.query.edit;

  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: editMode,
  });
};

exports.getEditProductPage = (req, res, next) => {
  const editMode = req.query.edit;

  // console.log(req.params.productId);

  if (!editMode) {
    return res.redirect('/'); ////redireciona admin que NÃO TIVER O QUERY PARAM de 'edit=true' na url que é enviada a route de '/admin/edit-product/:productId?'....
  }

  const productId = req.params.productId;




  Product.getSingleProduct(productId)
  .then(
    (product) => {


      if(!product) {

        return;
      }

            res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                prod: product,
      })

    }
  )
  .catch(
    (err) => {

      console.log(err);
    }
  )





  ///CÓDIGO QUE USA/USAVA ___ SEQUELIZE E UMA DATABASE SQL...
  // req.user.getProducts( ///approach mais ELEGANTE do que 'Product.findByPk(productId)', mas __RETORNA 1 ARRAY em vez de 1 'objeto', o que nos força A MANIPULÁ-LO com códigos como 'const product = products[0]', visto logo abaixo....
  //   {
  //     where: {id: productId}
  //   }

  // )
  // .then(
  //   (products) => {

  //     const product = products[0];

  //     if (!product) {
  //       return res.redirect('/');
  //     }
  //     res.render('admin/edit-product', {
  //       pageTitle: 'Edit Product',
  //               path: '/admin/edit-product',
  //               editing: editMode,
  //               prod: product,
  //     })
  //   }
  // )

              ////o 'getProducts', exemplo de MAGIC METHOD do sequelize, é approach MAIS ELEGANTE do que esse de '.findByPk(productId)'...
  // Product.findByPk(productId) //código COM O SEQUELIZE... ///substituímos pelo código logo acima, que é a mesma coisa, MAS __RESTRINGINDO O SEARCH DOS PRODUCTS APENAS àQUELES PRODUCTS QUE REALMENTE TENHAM SIDO CRIADOS POR ESSE 'user' específico (o 'req.user.id' deve bater, ser o mesmo valor do field 'userId' em um dado record/product na nossa database...)
  //   .then((product) => {
  //     if (!product) {
  //       alert(
  //         'The requested product has not been found in the database.'
  //       );
  //       return;
  //     } else {
  //       res.render('admin/edit-product', {
  //         pageTitle: 'Edit Product',
  //         path: '/admin/edit-product',
  //         editing: editMode, ////TRABALHO COM QUERY PARAMS.... --> usado para comunicar/diferenciar entre requests que querem ADICIONAR UM NOVO PRODUTO E ___ REQUESTS__ QUE QUEREM __ ALTERAR UM PRODUTO QUE JÁ EXISTE ('editMode = true'....)
  //         prod: product,
  //       });
  //     }
  //   });

  // Product.findProduct(productId).then(([rows, fieldData]) => { //CÓDIGO SEM O SEQUELIZE...

  //   console.log(rows);
  //   if (!rows) {
  //     return res.redirect('/');
  //   } else {
  //     const prod = {
  //       ...rows[0],
  //     };
  //     res.render('admin/edit-product', {
  //       pageTitle: 'Edit Product',
  //       path: '/admin/edit-product',
  //       editing: editMode, ////TRABALHO COM QUERY PARAMS.... --> usado para comunicar/diferenciar entre requests que querem ADICIONAR UM NOVO PRODUTO E ___ REQUESTS__ QUE QUEREM __ ALTERAR UM PRODUTO QUE JÁ EXISTE ('editMode = true'....)
  //       prod: prod,
  //     });
  //   }
  // });

  // Product.findProduct(productId,
  //     (product) => {

  //       if (!product) {
  //         return res.redirect('/'); //não é a melhor user experience, mas dá pro gasto.... (devíamos mostrar um error....)
  //       }
  //       // console.log(product);
  //       res.render('admin/edit-product', {
  //         pageTitle: 'Edit Product',
  //         path: '/admin/edit-product',
  //         editing: editMode, ////TRABALHO COM QUERY PARAMS.... --> usado para comunicar/diferenciar entre requests que querem ADICIONAR UM NOVO PRODUTO E ___ REQUESTS__ QUE QUEREM __ ALTERAR UM PRODUTO QUE JÁ EXISTE ('editMode = true'....)
  //         prod: product
  //       });
  //     }

  //   )
};

exports.editProduct = (req, res, next) => {


const productId = req.body.id;
const userId = req.user._id;

console.log(productId);


  // Product.update( ///////MINHA VERSÃO DO CÓDIGO SEQUELIZE,  QUE NÃO USAVA 'Product.save()', como a do professor....
  //   {title: req.body.title,
  //   imageUrl: req.body.imageUrl,
  //   description: req.body.description,
  //   price: req.body.price,
  //   },

  //   {where: {id: productId} }
  // )

  // .then(
  //   (result) => {
  //       console.log(result);
  //       res.status(302).redirect('/');
  //   }
  // )
  // .catch(
  //   (err) => {
  //       console.log(err);
  //   }
  // )

 const title = req.body.title;
const imageUrl = req.body.imageUrl;
const description = req.body.description;
const price = req.body.price;



  // Product.editProduct(productId, title, price, imageUrl, description)
  // .then(
  //   (result) => {

  //     console.log(result);
  //     res.redirect('/admin/product-list-admin');
  //   }
  // )
  // .catch(
  //   (err) => {
  //     console.log(err);
      
  //     res.redirect('/admin/product-list-admin');
  //   }
  // )

const product = new Product( title, price, imageUrl, description, userId, productId)
  product.save() ///CÓDIGO DO PROFESSOR... UM POUCO MAIS OPTIMIZADO DO QUE O MEU, POIS USA UM MESMO MÉTODO, 'save()', para RODAR 2 OPERAÇÕES DIFERENTES, 1 OPERAÇÃO DE EDIT E OUTRA DE ADD....
  .then(
    (result) => {

      console.log(result);
      res.redirect('/admin/product-list-admin');
    }
  )
  .catch(
    (err) => {
      console.log(err);
      
      res.redirect('/admin/product-list-admin');
    }
  )






  ///CÓDIGO QUE USA/USAVA SEQUELIZE...
//   Product.findByPk(productId) ///versão do PROFESSOR de 'findById()', que mais embaixo usa 'Product.save()' PARA __ EDITAR (se o product JÁ existia como record na table de products) ou ADICIONAR (se o product NÃO EXISTIA AINDA na nossa table de products) ___ UM OBJECT COM ESSES VALORES, como um record, lá na nossa DATABASE SQL..
//   .then(
//       product => {
  
  
//           product.title = req.body.title;
//           product.price = req.body.price;
//           product.description = req.body.description;
//           product.imageUrl = req.body.imageUrl;
//         //  return Product.save(); 
//           return product.save();          //fazemos isso, esse return, para que o THEN e CATCH blocks logo abaixo CONSIGAM executar código a partir desse return....
//       }
//   )
//   .then(
// (result) => {console.log('UPDATED PRODUCT')
// res.status(302).redirect('/products');




// }
//   )
//   .catch(
//       (err) => {
//           console.log(err);
//       }
//   )










  // const productId = req.params.productId; ///DEIXAMOS DE USAR PARAMS, POIS AGORA VAMOS NOS APROVEITAR DAS INFORMAÇÕES CONTIDAS NO REQUEST DE TIPO POST QUE NOS FORA ENVIADO....
  // const editedProduct = new Product();
  // console.log(req.params);
  // const newProduct = {
  //   ...req.body
  // }
  //   console.log(newProduct);
  // const editedProduct = new Product( /////CÓDIGO SEM O SEQUELIZE...
  //   req.body.id,
  //   req.body.title,
  //   req.body.imageUrl,
  //   req.body.description,
  //   req.body.price
  // );
  // editedProduct.save();
  // res.redirect('/admin/product-list-admin');
  // Product.findProduct(
  //   productId, (product) => {
  //         // console.log(product);
  //         // console.log(req.body);
  //         // res.redirect('/');
  //         const newProduct = {
  //             ...req.body,
  //             id: productId
  //         }
  //         // console.log(newProduct, 'LINE2');
  //        if (product === newProduct) {
  //         alert('No changes to product were detected, redirecting to home page...');
  //          res.redirect('/');
  //        } else {
  //        editedProduct.save(newProduct);
  //       //  console.log('TEST');
  //         res.redirect('/');
  //        }
  //   }
  // )
};

exports.postDeleteProduct = (req, res, next) => {
  // Product.deleteProduct(req.body.id); ///////CÓDIGO QUE NÃO USAVA O SEQUELIZE...
  // console.log('TEST');
  // res.redirect('/');

  const productId = req.body.id; 
  
  
  
  Product.deleteProduct(productId)
  .then(
    (result) => {
          console.log(result, 'LINE');
          res.redirect('/admin/product-list-admin');

    }
  )
  .catch(
    (err) => {
      console.log(err);
      res.redirect('/admin/product-list-admin');
    }
  )
  
  
  
  
  
  ////MEU CÓDIGO SEQUELIZE. Funciona, mas é um pouco pior do que o do professor, que usa 'product.destroy()' em vez de 'Product.destroy()' (a versão com MAIÚSCULO vai RODAR UMA QUERY, aceitando um OBJETO QUE AJUDA A IDENTIFICAR QUAL PRODUCT QUEREMOS DESTRUIR... JÁ A VERSÃO EM MINÚSCULO destrói o OBJETO/product que FOI ENCONTRADO pelo run da query 'FindByPk()'...)
  
  
  
  
  // Product.destroy(
  //   {
  //     where: {id: productId}
  //   }
  // )
  // .then(
  //   (result) => {
  //     console.log(result);
  //     res.redirect('/products')
  //   }
  // )
  // .catch(
  //   (err) => {
  //     console.log(err);
  //   }
  // )


  // Product.findByPk(productId)
  // .then(
  //   (product) => {
  //       return product.destroy(); //esse return nos ajuda com O HANDLE DO then e catch blocks logo abaixo, que dependem dele...
  //   }
  // )
  // .then(
  //   (result) => {
  //       console.log('DELETED PRODUCT');
  //       res.status(302).redirect('/admin/product-list-admin');
  //   }
  // )
  // .catch(
  //   (err) => {console.log(err)}
  // )

};

// exports.postAddProduct = (req, res, next) => { ///VERSÃO QUE NÃO USAVA SEQUELIZE.....
//     // products.push({ title: req.body.title });

//                                   //id, title, imageUrl, description, price
//     const newProduct = new Product(null, req.body.title, req.body.imageUrl, req.body.description, req.body.price );
//     // newProduct.save();  //é código assíncrono, no final das contas...
//     // // res.status(302).redirect('/');

//     newProduct.save()
//     .then(
//       () => {
//         res.status(302).redirect('/');
//       }
//     )
//   };

exports.postAddProduct = (req, res, next) => {
  

  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const user = req.user;
  const userId = req.user._id;

 



  const newProduct = new Product(title, price, imageUrl, description, userId); ///com isso, estamos usando A VERSÃO 'NOSQL'/mongodb do código de 'add a product to our database'... 

   newProduct.save().then(
     (result) => {

          // console.log(result);
          res.redirect('/admin/product-list-admin');

     }
   )
   .catch(
     (err) => {
          // console.log(err);
          res.redirect('/product-list-admin');
     }
   )



   ////VERSÃO QUE USA SEQUELIZE...
    ///VVVVVVV ---> este método 'createProduct' foi/é adicionado no OBJETO SEQUELIZE de 'user' __NO EXATO MOMENTO EM QUE DEFINIMOS UMA ASSOCIATION ENTRE 'User' e 'Product', vista lá no 'app.js', com os métodos 'Product.belongsTo(user)'...  
  // req.user.createProduct( ///////MÉTODO ''MÁGICO'''__ DO sequelize.... --> é mais conveniente do que o código de '.create()' visto logo abaixo, pois vai ADICIONAR o campo 'userId' ao nosso 'Product' AUTOMATICAMENTE... (não vamos precisar escrever aquele 'userId: req.user.id', visto logo abaixo no '.create()')
  //   {
  //     title: req.body.title,
  //     price: req.body.price,
  //     imageUrl: req.body.imageUrl,
  //     description: req.body.description

  //       ///userId: req.user.id; //////FIELD e valor de field adicionado __ AUTOMATICAMENTE pelo sequelize, por estarmos usando esse MAGIC METHOD de 'req.user.createProduct()'  (pq esse 'createProduct' realmente passa a existir dentro de 'user', devido à relation estabelecida em app.js pela escrita de 'Product.belongsTo(user)'....)


  //   }

  // )
  // .then((result) => {
  //   console.log(result);
  //   res.redirect('/admin/product-list-admin');
  // })
  // .catch((err) => {
  //   console.log(err);
  // });

  // Product.create( //// MÉTODO 'NÃO MÁGICO' do sequelize.... ----> é melhor usar a versão 'mágica' desse method, vista logo acima...
  
  //   ///EIS O CÓDIGO EM QUESTÃO. --> ISSO VAI __CRIAR UM OBJECT A PARTIR DO MODEL DE 'Product', com aqueles FIELDS QUE DEFINIMOS ALI EMBAIXO ASSIGNADOS àQUELES VALORES de 'title', 'price', etc etc, E AÍ __ VAI AUTOMATICAMENTE __ SALVAR ISSO NA NOSSA DATABASE DE 'products'... (tudo graças ao sequelize)...
  //   {
  //     description: description,
  //     imageUrl: imageUrl,
  //     title: title,
  //     price: price,
  //     // userId: req.user.id ///////approach __ NÃO MUITO ELEGANTE (não é um MAGIC METHOD, método mágico do sequelize....)__, usado para settar nossa RELATION/association entre 'Product' e 'User'... ---> ver aula 159 do professor (using magic association) e também o arquivo de texto 'usando magic association', do módulo 11... //// OBS:: VOCÊ DEVE USAR __ O 'MÉTODO MÁGICO' DE 'createProduct()', do sequelize.... --> esse método é MA´GICO PQ ELE´E DINÂMICO, seu nome MUDA DE ACORDO COM A RELATION QUE VOCÊ SETTOU E OS NOMES DOS SEUS 'models' envolvidos na relation...
  //   }
  // )
    // .then((result) => {
    //   console.log(result);
    //   res.redirect('/admin/product-list-admin');
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
};

exports.getProductsAdminPage = (req, res, next) => {
  // Product.findAll().then((products) => {
  //   res.render('admin/product-list-admin', {
  //     path: '/admin/products-list',
  //     pageTitle: 'Admin Products Page',
  //     prods: products,
  //   });
  // });

  Product.getProducts(

     
  )
.then(
    (products) => {


        res.render('admin/product-list-admin', {
        path: '/admin/products-list',
        pageTitle: 'Admin Products Page',
        prods: products
      })

    }
)

  // Product.fetchAll(
  //   (products) => {
  //res.render('admin/product-list-admin', {
  //     path: '/admin/products-list',
  //     pageTitle: 'Admin Products Page',
  //     prods: products
  //   })
  //}
  // )
};
