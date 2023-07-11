const Product = require('../models/product');

const ObjectId = require('mongodb').ObjectId;

const { validationResult } = require('express-validator');

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

  const errors = validationResult(req);

  validationErrors = errors.array();

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
    errorMessage: null,
    validationErrors,

    // isLoggedIn: req.session.isLoggedIn,  ///FUNCIONAL, MAS CUMBERSOME (vamos ter que adicionar essa property EM TODO E CADA CONTROLLER DE NOSSO APP, 1 por 1.... mt chato).
    // csrfToken: req.csrfToken() /// FUNCIONAL, MAS CUMBERSOME (como o código de cima)....
    // isLoggedIn: req.isLoggedIn
    // isLoggedIn: isLoggedIn
  });
};

exports.getEditProductPage = (req, res, next) => {
  const editMode = req.query.edit;
  console.log(editMode, 'LINE');


  const errors = validationResult(req);

  validationErrors = errors.array();

  // console.log(req.params.productId);

  if (!editMode) {
    return res.redirect('/'); ////redireciona admin que NÃO TIVER O QUERY PARAM de 'edit=true' na url que é enviada a route de '/admin/edit-product/:productId?'....
  }

  const productId = req.params.productId;


  // Product.getSingleProduct(productId) ///método custom/criado por nós... --> foi usado com o MONGODB DRIVER COMUM, e não com o mongoose (que é claramente melhor, pois possui o builtin method de 'findById'....)
  Product.findById(productId)
    .then((product) => {
 
      if (!product) {
        // return res.redirect('/'); //RUIM.... não faz muito sentido...
        req.flash( 
          'error',
          'Product not found'
        );
       return res.redirect('/admin/product-list-admin');  ////BEM MELHOR DO QUE AQUELE redirect para '/', pois vamos REDIRECIONAR PARA A PAGE DE 'product list admin' E AÍ VAMOS DISPLAYAR UMA MENSAGEM DE ERRO DIZENDO QUE O PRODUCT NÃO PODE SER ENCONTRADO... melhor user experience...
          


      } else {


        // res.send('HELLO')

      return res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        errorMessage: null,
        validationErrors,
        prod: {

          title: product.title,
          price: product.price,
          description: product.description,
          _id: product._id
        }
        // isLoggedIn: req.session.isLoggedIn
        // isLoggedIn: isLoggedIn
      });
      }



    })
    .catch(err => {
      console.log(err, 'LINE');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);

}) 

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
  console.log(req.body);
  const productId = req.body.id;
  const userId = req.user._id;

  const title = req.body.title;
  // const imageUrl = req.body.imageUrl;

  const image = req.file;  //usado nos nossos CHECKS, para saber se O 'PATH' de nosso arquivo (e, consequentemente, o arquivo atribuído 'for a given product') realmente precisa ser alterado... (ver aquele if check lá embaixo..)
  const description = req.body.description;
  const price = req.body.price;


  // const imageUrl = image.path; ///não use isto; apenas use o 'req.file' ali de cima...

  const errors = validationResult(req);

  const validationErrors = errors.array();

  // console.log(validationErrors);

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

  if (validationErrors.length > 0) {
    // console.log(validationErrors);
    // console.log(errors.array(), 'saasas');

    Product.find({ userId: userId }).then((products) => {
      // let errorMessage = null;

      return res.status(422).render('admin/product-list-admin', {
        pageTitle: 'Admin Products Page',
        path: 'admin/product-list-admin',
        errorMessage: errors.array()[0].msg,
        validationErrors: validationErrors,
        prods: products,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);

}) 
  } else {
    console.log(productId,'LINE5123');
    Product.findById(productId) //método MONGOOSE, builtin...


      .then((product) => {

        ////throw new Error('Dummy'); //////ESSE É O EXEMPLO USADO PELO PROFESSOR... é necessário esse THROW MANUAL DE UM ERROR (isso é só um exemplo, pq você não vai escrever assim...)
        if (product.userId.toString() !== req.user._id.toString()) {
          return res.redirect('/');
        } else {
          product.title = title;
          product.price = price;
          product.description = description;
          if(image) {


              const oldImagePath = product.imageUrl;
            fs.unlink(product.imageUrl, (err) => {
                  if(err) {
                    console.log(err);
                  }
            })
            product.imageUrl = req.file.path; /////CÓDIGO MAIS RECENTE, USADO COM O 'MULTER'... ---> vai EDITAR/OVERWRITTAR O PATH A IMAGE ANTIGA (atribuída a esse product) SE CONSTATAR QUE ALGUMA FILE VÁLIDA (não undefined/inválida) TIVER SIDO ENVIADA AO NOSSO APP...
          }
          return product.save();
        }
      })
      .then((result) => {
        console.log('UPDATED PRODUCT');
        res.redirect('/admin/product-list-admin');
      })
      .catch((err) => {   //////// O __ ERRO__ DO 'throw new Error('Dummy')' (_ E QUALQUER OUTRO ERROR DESSE TIPO, do tipo que 'THROWS AN ERROR') É __ CAPTURADO AQUI....  e armazenado nessa variável 'err', que então PASSAMOS AO CALL DE 'next()" LOGO ABAIXO, PARA __CONSEGUIR __ TRIGGAR O 'SPECIAL ERROR HANDLING MIDDLEWARE', lá no app.js...
        // console.log(err);

        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error); ///É ISSO QUE VAI FAZER O REPASSE DO ERRO A NOSSA 'SPECIAL ERROR HANDLING MIDDLEWARE', lá no app.js.... (é o middleware que  tem 4 argumentos, 'error, req, res, next'...)
      });
  }
};






exports.postDeleteProduct = (req, res, next) => {
  // Product.deleteProduct(req.body.id); ///////CÓDIGO QUE NÃO USAVA O SEQUELIZE...
  // console.log('TEST');
  // res.redirect('/');

  const productId = req.body.id;



  Product.findById(productId)
  .then(
    (product) => {

        fs.unlink(product.imageUrl, (err) => {

          console.log(err);
        })
    }
  )

  Product.findByIdAndDelete(productId) ///////MÉTODO __ DO MONGOOSE__, USADO COM FREQUÊNCIA... (use sempre 'findByIdAndDelete()', que é a versão que DEPRECOU o 'findByIdAndRemove()'....)
    .then((result) => {
      console.log(result);


      res.redirect('/admin/product-list-admin');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);

}) 

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
  const errors = validationResult(req);

  const validationErrors = errors.array();

  console.log(validationErrors);

  const title = req.body.title;
  // const imageUrl = req.body.imageUrl; ///versão que ainda usava urls..
  // const image = req.body.image; ////versão que usa o FILE UPLOAD de uma IMAGE...
  const image = req.file;

  console.log(image, 'POSTADDPRODUCT');

  const price = req.body.price;
  const description = req.body.description;



    if(!image) { ///se image estiver como UNDEFINED, isso significa que o multer RECUSOU o arquivo... --> se ele RECUSOU O ARQUIVO, vamos querer RE-RENDERIZAR A PAGE DE ADD/EDIT PRODUCT e aí __ INFORMAR O USER (por meio de 'errorMessage') QUE __ ELE INPUTTOU/SUBMITTOU UMA IMAGE INVÁLIDA (ao mesmo tempo que enviamos um RESPONSE STATUS DE 422, invalid input...)


      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: 'admin/add-product',
        editing: false,
        errorMessage: 'Attached file is not an image.',
        validationErrors: validationErrors,
          prod: {
            price: price, 
            description: description,
            title: title
          }
      });


    }

  console.log(req.user);
  const userId = req.user._id; ////importante


  const imageUrl = image.path; //só vamos querer ARMAZENAR O PATH NA NOSSA DATABASE (em cada 'product'), E NÃO O ARQUIVO EM SI...

  if (validationErrors.length > 0) {
    console.log(validationErrors);
    console.log(errors.array(), 'saasas');

    // req.file === null; não funciona.
    // console.log(req.file, 'EXEMPLO'); /

    Product.find({ userId: userId }).then((products) => {
      // let errorMessage = null;
      console.log(req.session, 'EXAMPLE');
      return res.status(422).render('admin/product-list-admin', {
        pageTitle: 'Admin Products Page',
        path: 'admin/product-list-admin',
        errorMessage: errors.array()[0].msg,
        validationErrors: validationErrors,
        prods: products,
      });
    });
  } else {
    const product = new Product({
      ///VERSÃO _MONGOOSE__ do código acima... --> vamos instanciar nosso MODEL MONGOOSE, e aí vamos passar um OBJETO como seu parâmetro... (sintaxe distinta daquela usada com o NORMAL MONGODB DRIVER, em que INSTANCIÁVAMOS UM MODELO 'Product', e em que A ORDEM DE PASS DOS PARÂMETROS IMPORTAVA, PQ NÃO ESTÁVAMOS USANDO 1 JAVASCRIPT OBJECT PARA PASSAR OS PARÂMETROS, COMO ESTAMOS FAZENDO AQUI, nessa linha....)

      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,                        ////por meio desse código/referência a essa const, armazenamos o PATH A ESSE ARQUIVO (que é o que interessa) lá na nossa database... (é o path AO ARQUIVO ARMAZENADO LÁ NO NOSSO SERVER/APP NODEEXPRESS...., no filesystem dele...)
      // image: image, ////NUNCA ARMAZENE 'A IMAGE EM SI' nas suas databases... (o store de arquivos em databases É INEFICIENTE E RUIM... SEMPRE PREFIRA __ ARMAZENZA O 'PATH' A ESSA IMAGE, IMAGE QUE DEVE SER ARMAZENADA NO SEU APP NODEEXPRESS/backend servidor...) -------> no caso, vamos __ ARMAZENAR A 'FILE' da image NO BACKEND, no folder de 'images', e APENAS __ ARMAZENAREMOS __ O PATH__ ('req.file.path') NA NOSSA DATABASE, dentro dos documents 'product'...
      userId: userId, //////IMPORTANTE, vincula cada product que é criado AO USER QUE O CRIOU... (relation por meio de REFERENCING, field de 'userId' em cada PRODUCT...)
    });

    product ///esse agora é um MODEL INSTANCIADO __ MONGOOSE, E NÃO 'MONGODB NORMAL' (sem o mongoose).... --> isso significa que ELE VAI TER, NO SEU INTERIOR, TODOS OS MÉTODOS ESPECIAIS DE MODELS MONGOOSE, models definidos com o MONGOOSE, métodos que FACILITAM O WRITE DE QUERIES NOSQL....
      .save() ///// esse, agora, não é o método 'save()' que era escrito por nós, por nossas próprias mãos, e SIM __ O MÉTODO '.save()' PROVIDENCIADO PELO PRÓPRIO MONGOOSE, dentro dos MODELS mongoose...
      .then((result) => {
        // console.log(result);
        console.log(req.session, 'EXAMPLE');
        res.redirect('/admin/product-list-admin');
      })
      .catch((err) => {
        const error = new Error(err); //poderíamos definir nossa própria error message aqui, e não usar esse objeto 'err' --> ex: new Error('Database connection error. Please sit tight!');
        console.log('TEST52');
        error.httpStatusCode = 500;
        console.log(req.session, 'EXAMPLE');
        return next(error); ////o pass de um ERROR a um call de 'next()' faz com que ocorra um JUMP diretamente para os 'ERROR HANDLING MIDDLEWARES'... todos os MIDDLEWARES COMUNS de nosso app são PULADOS.... -------> FAZ COM QUE O MIDDLEWAER DE 'app.use((error, req, res, next) => { res.redirect(/'500')}' LÁ EM 'app.js' SEJA __ EXECUTADO, POIS É ESSE TAL DE 'MIDDLEWARE ESPECIAL DE ERROR HANDLING'... )
      });
  }
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

  console.log(req.session.user);

  const userId = req.session.user._id;
  const userId2 = req.user._id;

  const errors = validationResult(req);

  validationErrors = errors.array();

  console.log(userId2);

  Product.find({ userId: userId }) /////forma de fazer 'AUTHORIZATE', essencialmente.... (só vamos poder VER o PRODUCT QUE FOI EFETIVMAENTE CRIADO PELO PRÓPRIO USER/ADMIN que o CRIOU)...
    // .populate('userId') ///////// O 'POPULATE' (que deve ser chamado após '.find()', opcionalmente) TE DEIXA DIZER AO  'MONGOOSE' QUE  ELE  DEVE  ''''POPULATE A CERTAIN FIELD ___WITH ALL THE __  DETAILED INFORMATION ABOUT  THAT THING (no caso, o 'user'), NOT JUST ITS ID'''''... --> DE FATO, ISSO É ___MUITO, MAS MUITO ÚTIL... (OBS:: O PARâMETRO, no caso 'userId', é o FIELD QUE VOCÊ DESEJA QUE FIQUE PREENCHIDO POR TODA ESSA DETAILED INFORMATION acerca desse document envolvido na relation (no caso, 'user', o user RELACIONADO ao given product) ...
    .then((products) => {
      // const isLoggedIn = req.get('Cookie').trim().split('=')[1];

      if (!products) {
        res.render('admin/product-list-admin', {
          path: '/admin/products-list',
          pageTitle: 'Admin Products Page',

          prods: [],
        });
      }

      res.render('admin/product-list-admin', {
        path: '/admin/products-list',
        pageTitle: 'Admin Products Page',
        prods: products,
        // errorMessage: errors.array()[0].msg,
        errorMessage: null,
        validationErrors: validationErrors,
        // isLoggedIn: req.session.isLoggedIn
        // isLoggedIn: isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);

}) 

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
