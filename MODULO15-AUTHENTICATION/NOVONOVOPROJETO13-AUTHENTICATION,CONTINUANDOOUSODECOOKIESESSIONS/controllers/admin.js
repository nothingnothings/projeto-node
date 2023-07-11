const Product = require('../models/product');



const ObjectId = require('mongodb').ObjectId;

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





  // if(!req.session.isLoggedIn) { 
    
  //   ///É ___A GUARD__ DE NOSSA PÁGINA... -> se o usuário NÃO ESTIVER 'LOGGED IN'/ autenticado, NÃO VAMOS RENDERIZAR A PAGE COMUM DE 'ADD A PRODUCT' para ele... (vamos bloquear a route, essencialmente; ou, em outras palavras, renderizar OUTRA COISA que não a page original, de 'add a product', destinada AOS USERS AUTENTICADOOS...)
  //     ////É CLARO QUE ESSE APPROACH É MEIO CUMBERSOME.... --> NA AULA 254, PROFESSOR NOS MOSTRA__ APPROACH BEM MENOS CUMBERSOME, E BEM MAIS 'SCALABLE'...
  //       ////examinar arquivo 'isAuth.js', lá no FOLDER de 'middlewares'... -- > vamos importar esse middleware LÁ NOS NOSSOS ARQUIVOS DE 'routes'...
  //       return res.redirect('/login');


  // }


  // const isLoggedIn = req.get('Cookie').trim().split('=')[1];


  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: editMode,
    // isLoggedIn: req.session.isLoggedIn,  ///FUNCIONAL, MAS CUMBERSOME (vamos ter que adicionar essa property EM TODO E CADA CONTROLLER DE NOSSO APP, 1 por 1.... mt chato).
    // csrfToken: req.csrfToken() /// FUNCIONAL, MAS CUMBERSOME (como o código de cima)....
    // isLoggedIn: req.isLoggedIn
    // isLoggedIn: isLoggedIn
  });
};

exports.getEditProductPage = (req, res, next) => {
  const editMode = req.query.edit;

  // console.log(req.params.productId);

  if (!editMode) {
    return res.redirect('/'); ////redireciona admin que NÃO TIVER O QUERY PARAM de 'edit=true' na url que é enviada a route de '/admin/edit-product/:productId?'....
  }

  const productId = req.params.productId;




  // Product.getSingleProduct(productId) ///método custom/criado por nós... --> foi usado com o MONGODB DRIVER COMUM, e não com o mongoose (que é claramente melhor, pois possui o builtin method de 'findById'....)
  Product.findById(productId)
  .then(
    (product) => {


      if(!product) {

        return;
      }

      // const isLoggedIn = req.get('Cookie').trim().split('=')[1];


            res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                prod: product,
                // isLoggedIn: req.session.isLoggedIn
                // isLoggedIn: isLoggedIn
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
// const userId = req.user._id;


 const title = req.body.title;
const imageUrl = req.body.imageUrl;
const description = req.body.description;
const price = req.body.price;


// const product = new Product( title, price, imageUrl, description, userId, productId) /////////CÓDIGO VELHO, QUE USAVA O 'MONGODB DRIVER' default, ___ SEM O MONGOOSE__ E SEUS HELPER METHODS, HELPER METHODS EXISTENTES NOS 'MODELOS MONGOOSE'...
//   product.save() ///CÓDIGO DO PROFESSOR... UM POUCO MAIS OPTIMIZADO DO QUE O MEU, POIS USA UM MESMO MÉTODO, 'save()', para RODAR 2 OPERAÇÕES DIFERENTES, 1 OPERAÇÃO DE EDIT E OUTRA DE ADD....
//   .then(
//     (result) => {

//       console.log(result);
//       res.redirect('/admin/product-list-admin');
//     }
//   )
//   .catch(
//     (err) => {
//       console.log(err);
      
//       res.redirect('/admin/product-list-admin');
//     }
//   )



    //APPROACH DO MONGOOSE...

    ///MÉTODO DO MONGOOSE QUE EXPERIMENTEI E FUNCIONOU, MAS QUE NÃO FOI USADO PELO PROFESSOR, por alguma razão....
    // Product.findOneAndUpdate( ///MÉTODO BUILTIN DO MONGOOSE, BUILTIN NOS MODELS MONGOOSE DEFINIDOS POR NÓS....

  //   {_id: ObjectId(productId)}, 

  //   {
  //       title: title,
  //       imageUrl: imageUrl,
  //       description: description,
  //       price: price

  //   }


  // )

  Product.findById(productId) //método MONGOOSE, builtin...
  .then(
    (product) => {

      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      
      return product.save(); /////MUITO IMPORTANTE, é isso que 'SALVA' as mudanças que você escreveu logo acima, com a dot notation....

    }
  )
  .then(
    (result) => {


      console.log('UPDATED PRODUCT');
      res.redirect('/admin/product-list-admin');
    }
  )
  .catch(
    (err) => {
      console.log(err);
      
      res.redirect('/admin/product-list-admin');
    }
  )





};

exports.postDeleteProduct = (req, res, next) => {
  // Product.deleteProduct(req.body.id); ///////CÓDIGO QUE NÃO USAVA O SEQUELIZE...
  // console.log('TEST');
  // res.redirect('/');

  const productId = req.body.id; 
  
  




  Product.findByIdAndDelete(productId) ///////MÉTODO __ DO MONGOOSE__, USADO COM FREQUÊNCIA... (use sempre 'findByIdAndDelete()', que é a versão que DEPRECOU o 'findByIdAndRemove()'....)
  .then(
    (result) => {

      console.log(result);
      res.redirect('/admin/product-list-admin');
    }
  )
  .catch(
    (err) => {
      console.log(err);
    }
  )





  
  // Product.deleteProduct(productId) //////CÓDIGO QUE __ NÃO USAVA O 'MONGOOSE', e sim apenas o 'mongodb driver' default.... --> devemos usar o MONGOOSE, aquele method de 'findByIdAndDelete()'...
  // .then(
  //   (result) => {
  //         console.log(result, 'LINE');
  //         res.redirect('/admin/product-list-admin');

  //   }
  // )
  // .catch(
  //   (err) => {
  //     console.log(err);
  //     res.redirect('/admin/product-list-admin');
  //   }
  // )
  
  
  
  
  
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
  // const user = req.user;
  console.log(req.user);
  const userId = req.user._id; ////importante

    ////VERSÃO QUE UTILIZA/UTILIZAVA O DRIVER PADRÃO DE 'MONGODB' do node, em vez de 'mongoose'.... passamos a usar O MONGOOSE, por isso não vamos mais INSTANCIAR ESSE 'product' com esses argumentos, dessa forma aí...
  // const newProduct = new Product(title, price, imageUrl, description, userId); ///com isso, estamos usando A VERSÃO 'NOSQL'/mongodb do código de 'add a product to our database'... 

  //  newProduct.save().then(
  //    (result) => {

  //         // console.log(result);
  //         res.redirect('/admin/product-list-admin');

  //    }
  //  )
  //  .catch(
  //    (err) => {
  //         // console.log(err);
  //         res.redirect('/product-list-admin');
  //    }
  //  )



    
  const product = new Product({

                            ///VERSÃO _MONGOOSE__ do código acima... --> vamos instanciar nosso MODEL MONGOOSE, e aí vamos passar um OBJETO como seu parâmetro... (sintaxe distinta daquela usada com o NORMAL MONGODB DRIVER, em que INSTANCIÁVAMOS UM MODELO 'Product', e em que A ORDEM DE PASS DOS PARÂMETROS IMPORTAVA, PQ NÃO ESTÁVAMOS USANDO 1 JAVASCRIPT OBJECT PARA PASSAR OS PARÂMETROS, COMO ESTAMOS FAZENDO AQUI, nessa linha....)

      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: userId //////IMPORTANTE, vincula cada product que é criado AO USER QUE O CRIOU... (relation por meio de REFERENCING, field de 'userId' em cada PRODUCT...)
  }); 

   product ///esse agora é um MODEL INSTANCIADO __ MONGOOSE, E NÃO 'MONGODB NORMAL' (sem o mongoose).... --> isso significa que ELE VAI TER, NO SEU INTERIOR, TODOS OS MÉTODOS ESPECIAIS DE MODELS MONGOOSE, models definidos com o MONGOOSE, métodos que FACILITAM O WRITE DE QUERIES NOSQL....
   .save() ///// esse, agora, não é o método 'save()' que era escrito por nós, por nossas próprias mãos, e SIM __ O MÉTODO '.save()' PROVIDENCIADO PELO PRÓPRIO MONGOOSE, dentro dos MODELS mongoose...
   .then(
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


};

exports.getProductsAdminPage = (req, res, next) => {
  // Product.findAll().then((products) => {
  //   res.render('admin/product-list-admin', {
  //     path: '/admin/products-list',
  //     pageTitle: 'Admin Products Page',
  //     prods: products,
  //   });
  // });

  // Product.getProducts()  ///MÉTODO QUE USÁVAMOS COM O 'MONGODB DRIVER' comum, sem o mongoose.... --> substituímos PELO USO DO método fetchall __BUILTIN DO MONGOOSE, QUE É 'find()', nos MODELS MONGOOSE QUE CRIAMOS...

  Product.
  find()
  // .populate('userId') ///////// O 'POPULATE' (que deve ser chamado após '.find()', opcionalmente) TE DEIXA DIZER AO  'MONGOOSE' QUE  ELE  DEVE  ''''POPULATE A CERTAIN FIELD ___WITH ALL THE __  DETAILED INFORMATION ABOUT  THAT THING (no caso, o 'user'), NOT JUST ITS ID'''''... --> DE FATO, ISSO É ___MUITO, MAS MUITO ÚTIL... (OBS:: O PARâMETRO, no caso 'userId', é o FIELD QUE VOCÊ DESEJA QUE FIQUE PREENCHIDO POR TODA ESSA DETAILED INFORMATION acerca desse document envolvido na relation (no caso, 'user', o user RELACIONADO ao given product) ...
  .then(
    (products) => {
      // const isLoggedIn = req.get('Cookie').trim().split('=')[1];

        res.render('admin/product-list-admin', {
        path: '/admin/products-list',
        pageTitle: 'Admin Products Page',
        prods: products,
        // isLoggedIn: req.session.isLoggedIn
        // isLoggedIn: isLoggedIn
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
