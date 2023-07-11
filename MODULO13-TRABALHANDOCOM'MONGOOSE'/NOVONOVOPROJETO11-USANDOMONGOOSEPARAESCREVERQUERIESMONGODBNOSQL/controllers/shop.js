// const products = [];

const Product = require('../models/product');

// const Cart = require('../models/cart'); //NÃO PRECISAMOS DO CART MODEL DIRETAMENTE, POR MEIO DESSE IMPORT AÍ, PQ NÓS O OBTIVEMOS POR MEIO DE 'req.user.getCart()' (magic method criado em 'user', quando executamos 'Cart.belongsTo(User)'...)
// const OrderItem = require('../models/order-item');
// const Order = require('../models/order'); ///assim como um CART É RELACIONADO A UM 'USER', uma 'ORDER' também o é.... --> é por isso que podemos executar o método mágico 'req.user.createOrder'...
// const CartItem = require('../models/cart-item-deprecado-sql');

const ObjectId = require('mongodb').ObjectId;

const Order = require('../models/order');
const User = require('../models/user');

// exports.getAddProductPage = (req, res, next) => {
//   res.render('admin/add-product', {
//     pageTitle: 'Add Product', //RENDER. USADO COM TEMPLATING ENGINES COMO 'pug'...
//     path: '/admin/add-product',
//     activeAddProduct: true,
//     productCSS: true,
//     formsCSS: true,
//   });
// };

// exports.getProductDetailPage = (req, res, next) => {
//     res.render('product-detail', {

//     })

// }

exports.getStartingPage = (req, res, next) => {
  res.render('shop/index', {
    path: '/',
    pageTitle: 'The Shop',
  });
};

exports.getCheckoutPage = (req, res, next) => {
  res.render(
    'shop/checkout'
    // {
    //   pageTitle: 'checkout',
    //   path: '/shop/checkout'
    // }
  );
};

// exports.postAddProduct = (req, res, next) => {
//   // products.push({ title: req.body.title });

//   const newProduct = new Product(req.body.title);
//   newProduct.save();  //é código assíncrono, no final das contas...
//   res.status(302).redirect('/');
// };

// exports.getProducts = (req, res, next) => {
//   // const products = adminData.products; ////código obsoleto, só fazia sentido em 'shop.js', arquivo route...

//   const products =  Product.fetchAll();

//   // console.log(products, 'LINE');

//   // console.log(products, 'LINE');
//    res.render('shop', {
//     prods: products,
//     pageTitle: 'Shop',
//     path: '/',
//     productCSS: true,
//     activeShop: true,
//     hasProducts: products.length > 0,
//   });
// };

// exports.getCartPage = (req, res, next) => { ////MINHA VERSÃO DO CÓDIGO. NÃO FUNCIONAVA.

//  Cart.getCartFromFile(

//     (cart) => { //callback....
//           console.log('A');
//           const cartProducts = [];
//         for (const product of cart.products) {
//             Product.findProduct(product.id,

//               (product) => { ///callback
//                   cartProducts.push(product);
//                   console.log('B');
//                   console.log(cartProducts);
//               }
//               )
//         }

//         console.log('C');
//         res.render('shop/cart', {
//           path: '/cart',
//           pageTitle: 'Cart',
//           cartProducts: cartProducts
//         });
//     }
//   )

// };

exports.getCart = (req, res, next) => {
  //  req.user.getCart() MÉTODO MONGODB DRIVER COMUM...

  req.user ///CÓDIGOS/métodos BUILTIN do mongoose....
    .populate('cart.products.productId') //////EIS O CÓDIGO EM QUESTÃO
    ///.execPopulate() ///OPCIONAL. antes era obrigatório, vocÊ tinha que chamar isso para poder EXECUTAR then/catch em cima do 'populate' (pq antigamente o POPULATE NÃO RETORNAVA SEMPRE UMA PROMISE, como hoje em dia...)
    .then((user) => {
      ///////RESTO DO CÓDIGO CONTINUA O MESMO....

      console.log(user.cart.products);

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.products,
      });
    });

  ///É MEU CÓDIGO DE FETCH CART.... não é tão bonito, mas funciona, e faz a vinculação de 2 'collections' diferentes, pq pega os products 'simples' la dentro do 'cart', dentro de cada 'user', e aí VINCULA ISSO (products que possuem as QUANTITIES, pq são cart items)  COM __ AS INFORMAÇÕES DETALHADAS DE CADA PRODUCT, armazenadas nos objetos/documentos 'product' lá na collection de 'products' mesmo....

  //   const productIds = [];

  //   const simpleProducts = [];

  //   const cart = req.user.getCart(); ///poderíamos conseguir o MESMO EFEITO por meio do call de 'req.user.cart', se quiséssemos... (é a mesma coisa...)

  // const cartProducts = [
  //   ...cart.products
  // ]

  // cartProducts.forEach(
  //   (product) => {
  //       productIds.push(product.productId);
  //       simpleProducts.push(product);
  //   }
  // )

  //   Product.getMultipleProducts(productIds)
  //   .then(
  //     (products) => {

  //         const editedProducts = [];

  //         products.forEach(
  //           (product) => {

  //          const neededProductIndex = simpleProducts.findIndex(
  //               (prod) => {
  //                     console.log(ObjectId(prod.productId) === ObjectId(product._id))
  //                     return prod.productId.toString() === product._id.toString();
  //               }
  //             )

  //               if(neededProductIndex === -1) {

  //                 return;
  //               } else {

  //                 const editedProduct = {
  //                   ...product,
  //                   quantity: simpleProducts[neededProductIndex].quantity
  //                 }

  //                     editedProducts.push(
  //                             editedProduct
  //                     )
  //               }
  //           }
  //         )

  //       res.render('shop/cart', {
  //         path: '/cart',
  //         pageTitle: 'Your Cart',
  //         products: editedProducts

  //     })
  //     }
  //   )

  // .then(
  //   (cart) => {

  //     (cart) => {

  //       console.log(cart);

  //       res.render('shop/cart', {
  //         path: '/cart',
  //         pageTitle: 'Your Cart',
  //         products: products,
  //         cart: cart
  //         // cartItems: cartItems
  //     })
  //     }
  //   }
  // )
  //   .catch(
  //     (err) => {
  //       console.log(err);
  //     }
  //   )

  ///CÓDIGO QUE USA/USAVA SEQUELIZE...
  // console.log(req.user.cart, 'LINE'); ////isso (o cart) não existe dentro do objeto 'req.user', justamente pq DEVEMOS O CONSEGUIR ATRAVÉS DE 'req.user.getCart()', para conseguir o cart específico Àquele user (userId field dentro do cart e 'id' field no user DEVEM DAR MATCH...)

  //   // let productList;
  //  req.user
  //     .getCart()
  //     .then((cart) => {

  //       const fetchedCart = cart;
  //       return cart.getProducts()

  //       .then(products => {
  //           console.log(products);
  //  res.render('shop/cart', {
  //         path: '/cart',
  //         pageTitle: 'Your Cart',
  //         products: products,
  //         cart: fetchedCart
  //         // cartItems: cartItems
  //     })
  //   })
  //     .catch((err) => {
  //       console.log(err);
  //     })

  //   }
  //     )
  //       .catch(
  //         (err) => {console.log(err)}
  //       )

  ///////ESTA ERA A MINHA VERSÃO DO CÓDIGO, VERSÃO QUE NÃO SABIA QUE PODÍAMOS, LÁ NO VIEW, simplesmente acessar a quantity de um 'given ASSOCIATED cart item' por meio de 'product.cartItem.quantity'...
  // let productList;

  // const cartId = req.user
  //   .getCart()
  //   .then((cart) => {
  //     console.log(cart, 'LINE');
  //     return cart.getProducts();
  //   })
  //   .then((products) => {
  //     console.log(products);

  //     productList = products;

  //     CartItem.findAll({ where: { cartId: req.user.id } }).then((cartItems) => {
  //       productList.forEach((product) => {
  //         product.quantity = cartItems.find((cartItem) => {
  //           return cartItem.productId === product.id;
  //         }).quantity;
  //       });
  // return res.render('shop/cart', {
  //   path: '/cart',
  //   pageTitle: 'Your Cart',
  //   cartProducts: productList,
  //   // cartItems: cartItems
  // });
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.deleteCartItem = (req, res, next) => {
  const productId = req.body.id;

  // console.log('TEST', 'TEST', productId, 'TEST');

  req.user.deleteCartItem(productId).then((result) => {
    res.status(302).redirect('/cart');
  });

  // const updatedProducts = req.user.cart.products.filter( ///////OUTSOURCEADO LÁ PARA O METHOD de 'deleteCartItem', no model de 'user.js'....
  //   (product) => {
  //             console.log(productId.toString() !== product.productId.toString())
  //             return  productId.toString() !== product.productId.toString();
  //   }
  // )

  // req.user.cart.products = updatedProducts;

  // req.user.save().then(
  //   (result) => {

  //     res.redirect('/cart');
  //   }
  // )

  // req.user.deleteProductFromCart(productId) // código sem o mongoose...
  // .then(
  //   (result) => {

  //     res.redirect('/cart');
  //   }
  // )
  // .catch(
  //   (err) => {
  //     console.log(err);
  //   }
  // )

  // const user = req.user;

  /////////CÓDIGO __SEM O MONGOOSE__... (só com o mongodb driver default... e seus models default, com  methods inventados por nós...)
  // req.user.deleteProductFromCart(productId)
  // .then(
  //   (result) => {
  //     res.redirect('/cart');
  //   }
  // )
  // .catch(
  //   (err) => {
  //     console.log(err);
  //   }
  // )

  // req.user.deleteProductFromCart(productId)
  // .then(
  //   (result) => {

  //     res.redirect('/cart');
  //   }
  // )
  // .catch(
  //   (err) => {
  //     console.log(err);
  //   }
  // )

  ///CÓDIGO QUE USA/USAVA SEQUELIZE...
  // const productId = req.body.id;
  // // const productPrice = req.body.price; ////esta versão do código __ NÃO FUNCIONA___ (pq é o price _ GERAL__ que vai ser considerado, nesse negócio, e não o PRICE DE CADA PRODUCT INDIVIDUAL..)
  // // console.log(productId);

  // // Product.findProduct(productId, (product) => {
  // //   console.log(product, 'LINE');
  // //   Cart.deleteProductFromCart(productId, product.price);
  // //   res.redirect('/cart');
  // // });

  // req.user.getCart().then(
  //   (cart) => {

  //       return cart.getProducts({where: {id: productId}});
  //   }
  // )
  // .then(
  //     (products) => {

  //       const product = products[0];

  //       if (product.cartItem.quantity === 1) {

  //        return product.cartItem.destroy();

  //       } else {

  //         newCartItem = {
  //           ...product.cartItem
  //         }

  //         newCartItem.quantity = product.cartItem.quantity - 1;

  //        return product.cartItem.update(newCartItem);
  //       }
  //     }

  // )
  // .then(
  //   (result) => {
  //         res.redirect('/cart');
  //   }
  // )
};

// exports.getOrdersPage = (req, res, next) => {
//   res.render('shop/orders', {
//     pageTitle: 'Your Orders',
//     path: '/orders',
//   });
// };

exports.getOrdersPage = (req, res, next) => {
  Order.find({ userId: req.user._id })
    // .populate('cart.products.productId')
    .populate('products.product')
    .then((orders) => {
      console.log(orders);

      orders.forEach((order) => {
        console.log(order, 'LINE');

            order.products.forEach(
              (product) => {
                console.log(product, 'LINE2');
              }
            )

        // order.totalPrice = order.cart.products
        order.totalPrice = order.products
          .map(
            ////define o TOTAL PRICE de cada order...
            (product) => {
                console.log(product, 'LINE3');
              // return product.productId.price * product.quantity;
              return product.product.price * product.quantity;
            }
          )
          .reduce((prevValue, curValue) => {
            return prevValue + curValue;
          }, 0);
      });
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        orders: orders,
        path: '/orders',
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // req.user.getOrders() //////CÓDIGO SEM O USO DO MONGOOSE/ MONGOOSE METHODS EM MONGOOSE MODELS....
  // .then(
  //   (orders) => {

  //     console.log(orders, 'YOUR ORDERS');

  //     res.render(
  //       'shop/orders',
  //       {
  //         pageTitle: 'Your Orders',
  //         orders: orders,
  //         path: '/orders'
  //       }
  //     )
  //   }
  // )
  // .catch(
  //   (err) => {
  //     console.log(err);
  //   }
  // )

  ///CÓDIGO QUE USA/USAVA SEQUELIZE....

  // req.user.getOrders(

  //     {include: ['products']} //EXEMPLO DE EAGER LOADING... --> vai colocar um field mágico de 'products', com um ARRAY DE PRODUCTS PERTENCENTE 'FOR A GIVEN ORDER' __EM CADA 1 DE NOSSAS ORDERS QUE FOREM RETRIEVADAS por meio desse 'getOrders'...
  // )
  // .then(

  //   (orders) => {

  //     res.render('shop/orders', {
  //       pageTitle: 'Your Orders',
  //       orders: orders,
  //       path: '/orders',
  //     });

  //   }
  // )
  // .catch(
  //   (err) => {
  //     console.log(err);
  //   }
  // )
};

exports.postToCart = (req, res, next) => {
  const productId = req.body.productId;
  // console.log(productId);

  //  return Product.getSingleProduct(ObjectId(productId)) //////CÓDIGO QUE USAVA METHOD definido em model COMUM, model de 'mongodb driver' default, comum, SEM O MONGOOSE....
  //   .then(
  //     (product) => {
  //       console.log(product, 'postToCart')
  //             req.user.addToCart(product)
  //             .then(
  //               (result) => {
  //                       console.log(result);
  //                       res.redirect('/cart');
  //               }
  //             )
  //             .catch(
  //               (err) => {
  //                 console.log(err);
  //               }
  //             )
  //     }
  //   )
  //   .catch(
  //     (err) => {
  //       console.log(err);
  //     }
  //   )

  ////APPROACH QUE UTILIZA O MONGOOSE, BEM MAIS LEGAL E AVANÇADO DO QUE O DE CIMA...

  Product.findById(productId) ///método MONGOOSE... builtin em TODOS NOSSOS MODELS... --> vai automaticamente 'wrappar' o 'productId' em um 'objectId(xxxx)'....
    .then((product) => {
      return req.user.addToCart(product); ////esse método, MÉTODO CUSTOM, criado por NÓS, já contém a lógica que determina se NÓS VAMOS 'CREATE A NEW PRODUCT' (nenhum product com esse '_id' encontrado no 'cart' do 'user'....)  __ OU SE VAMOS SÓ ADICIONAR 1 unidade 'quantity'  no field de 'quantity' de um object QUE JÁ EXISTE (ou seja, já temos 1 product com esse '_id' no array de 'products', dentro do 'cart', dentro de 'user'.....)
    })
    .then((result) => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });

  // //CÓDIGO QUE USA/USAVA SEQUELIZE...
  // const productId = req.body.productId;
  // let fetchedCart;
  // let newQuantity = 1;
  // // const productPrice = req.body.price; //não consigo adquirir essa informação dessa forma...

  // // console.log(productId);

  // // Product.findProduct(
  // //   productId,

  // //   (product) => {
  // //     Cart.addProduct(product.id, product.price);
  // //     res.redirect('/cart');
  // //   }
  // // );

  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;

  //     return cart.getProducts({ where: { id: productId } }); ////retornamos o valor dessa promise para PODERMOS RODAR CHECKS NELA, NO PRÓXIMO THEN BLOCK...
  //   })
  //   .then((products) => {
  //     //array que precisa ser MANIPULADO, como visto no código de 'product = products[0]'...

  //     let product;

  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {

  //       const oldQuantity = product.cartItem.quantity;

  //       newQuantity = oldQuantity + 1;

  //       return fetchedCart.addProduct(product, {  ////código parecido com o de baixo, mas com um valor de QUANTITY diferente, valor que considera a EXISTÊNCIA PRÉVIA DE 1 objeto 'product' no nosso cart (reproduzido por 'cart-items'..)
  //         through: {quantity: newQuantity}
  //       })

  //       //////MINHA VERSÃO DESTE CODIGO. É MENOS ELEGANTE, e não usava o field 'quantity' dentro do 'cartItem' vinculado ao 'product'...
  //       // CartItem.findAll({ where: { productId: productId } }) ////como um PRODUCT com aqueles critérios JÁ FOI ENCONTRADO NO NOSSO CART, NÃO VAMOS QUERER CRIAR 1 NOVO 'PRODUCT', E SIM vamos querer adicionar 1 unidade À 'quantity' 'old' de nossos products...
  //       //   .then((cartItems) => {
  //       //     const cartItem = cartItems[0];

  //       //     CartItem.update(
  //       //       { quantity: cartItem.quantity + 1 },
  //       //       { where: { productId: productId } }
  //       //     ) ////CÓDIGO ABSURDAMENTE CLUNKY, MAS QUE FUNCIONOU..
  //       //       .then((result) => {
  //       //         console.log(result);
  //       //       });
  //       //   });
  //     } else {
  //       return Product.findByPk(productId) ///executamos isto pq queremos ADICIONAR ESSE PRODUCT ESPECÍFICO, sua data, ao nosso cart....
  //         .then((product) => {

  //           console.log(fetchedCart, 'O cart em questão'); ///este 'addProduct' aqui de baixo é bem bugado, professor passou 'product' como seu parâmetro, e ele não dá erro, realmente aceita esse parâmetro....
  //           return fetchedCart.addProduct(product, {
  //             through: { quantity: newQuantity },
  //           }); ///ver anotações em 'adicionando novos products ao nosso cart', ou a aula '163' do professor....
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }

  //     // return Product.findByPk(productId) ///executamos isto pq queremos ADICIONAR ESSE PRODUCT ESPECÍFICO, sua data, ao nosso cart....
  //     // .then(
  //     //   product => {
  //     //     console.log(product, 'O product encontrado no database...');

  //     //     console.log(fetchedCart, 'O cart em questão'); ///este 'addProduct' aqui de baixo é bem bugado, professor passou 'product' como seu parâmetro, e ele não dá erro, realmente aceita esse parâmetro....
  //     //         return fetchedCart.addProduct(product, {through: {quantity: newQuantity}}) ///ver anotações em 'adicionando novos produts ao nosso cart', ou a aula '163' do professor....
  //     //   }
  //     // )
  //   })
  //   .then(() => {
  //     res.redirect('/cart');
  //   })
  //   .catch();
};

exports.getProductDetailPage = (req, res, next) => {
  // const productId = req.params.productId; ////////CÓDIGO QUE __NÃO UTILIZAVA 'sequelize'... --> devemos usar SEQUELIZE, POIS É BEM MAIS PRÁTICO...
  // console.log(productId);

  //   Product.findProduct(productId)
  //   .then(
  //     ([rows, fieldData]) => {
  //           // console.log(rows[0]);
  //       const productData = {
  //         ...rows[0]
  //       }
  //       console.log(productData);
  //           // const productDetail = {...rows[0][0]}
  //           // console.log(productDetail);
  //           // console.log(rows[0].title);
  //               res.render('shop/product-detail', {
  //     pageTitle: productData.title,
  //     path: '/products',
  //     product: productData
  //   });
  //     }
  //   )
  //   .catch(
  //     (err) => {
  //       console.log(err);
  //     }
  //   )

  const productId = req.params.productId.trim();
  // console.log(productId);
  console.log(productId);
  console.log(productId.length);

  if (productId.length < 24) {
    return;
  }

  // Product.getSingleProduct(ObjectId(productId)) ////método ESTÁTICO criado por nós, PARA SER USADO COM O 'MONGO DB DRIVER' comum (sem o mongoose... por isso, pior).... ------> o  método builtin do mongoose, 'findOne()', é melhor do que esse método wonky que escreveoms...
  // Product.findOne({_id: ObjectId(productId)}) ////MÉTODO BUILTIN DO MONGOOSE, EXISTENTE EM TODOS OS MODELS MONGOOSE CRIADOS POR NÓS... ---->  O 'findOne()' É A MESMA COISA QUE 'findById()', com a diferença que ele NÃO VAI AUTOMATICAMENTE CONVERTER o argumento passado por você em 'ObjectId(argumento)'....
  Product.findById(productId) ///Finds a single document by its _id field. findById(id) is almost* equivalent to findOne({ _id: id }). If you want to query by a document's _id, use findById() instead of findOne().

    .then((product) => {
      if (!product) {
        return;
      }

      // console.log(product, 'LINEE');
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });

  ////CÓDIGO QUE USA/USAVA SEQUELIZE...
  // const productId = req.params.productId;

  // // Product.findById(productId) //SINTAXE DEPRECADA ('findById' substituído por 'findByPk', find by primary key...)
  // Product.findByPk(productId)
  //   .then((product) => {
  //     if (!product) {
  //       return;
  //     }

  //     res.render('shop/product-detail', {
  //       pageTitle: product.title,
  //       path: '/products',
  //       product: product,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // Product.findAll(  ///É UM CÓDIGO QUE UTILIZA SEQUELIZE, MAS QUE É MEIO CLUNKY E RECOMENDADO __ PARA QUANDO VOCÊ QUERER __ ACHAR __ MAIS DE 1 PRODUCT POR MEIO DE UM 'ID'.... --> como aqui só queremos encontrar 1 ÚNICO PRODUCT, VOCÊ DEVE USAR O CÓDIGO LOGO ACIMA, de 'findById'....
  //   {where: {id: productId}} ////use esse código para __ QUERIES__ MAIS AVANÇADOS/ESPECÍFICOS, SELECIONANDO MÚLTIPLOS PRODUTOS COM AQUELE CRITÉRIO QUE VOCÊ PASSA NO SLOT  'CONFIG'...
  // )
  // .then(
  //   (productData) => {
  //       const product = productData[0].dataValues;
  //                     res.render('shop/product-detail', {
  //       pageTitle: product.title,
  //       path: '/products',
  //       product: product
  //     })
  // Product.findProduct(productId, (product) => { /////CÓDIGO QUE USAVA O FILESYSTEM....
  //   // console.log(product, 'LINE2122');
  //   // return product;

  //   if (!product) {
  //     ////conserta o problema de 'product.title' is undefined...
  //     return;
  //   }
  //   res.render('shop/product-detail', {
  //     pageTitle: product.title,
  //     path: '/products',
  //     product: product,
  //   });
  // });
};

// exports.getProductsPage = (req, res, next) => { ///VERSÃO QUE NÃO USAVA O SEQUELIZE. FUNCIONA, MAS É PIOR DE ESCREVER....

//    //é código assíncrono, no final das contas...

//    Product.fetchAll(
//    )
//    .then(
//     ([rows, fieldData]) => { ///'fieldData' --> é a METADATA acerca de nossa data (que é 'rows') retrievada da database SQL...
//       res.render('shop/product-list', {
// prods: rows, ////EIS O CÓDIGO EM QUESTÃO.
// pageTitle: 'Shop',
// path: '/products',
// productCSS: true,
// activeShop: true,
// hasProducts: rows[0].length > 0,
// });
// })
//   // Product.fetchAll((products) => { //minha versão. errada.
//   //

//   //   res.render('shop/product-list', {
//   //     prods: products,
//   //     pageTitle: 'Shop',
//   //     path: '/products',
//   //     productCSS: true,
//   //     activeShop: true,
//   //     hasProducts: products.length > 0,
//   //   });
//   // });
// };

exports.orderPost = (req, res, next) => {
  // console.log(req.user, 'LINE');
  // const user = req.user;

  // const order = new Order( ///MEU CÓDIGO DE 'add a order'.... até funcionou, mas é menos elegante que o código do professor....
  //   {
  //     userId: req.user._id,
  //     cart: req.user.cart,
  //     totalPrice: 0
  //   }
  // )

  // order.save().then(
  //   (result) => {

  //     console.log(result);

  //       return req.user.clearCart()
  //       .then(
  //         (result) => {
  //           res.status(302).redirect('/orders');
  //         }
  //       )
  //   }
  // )

  req.user.populate('cart.products.productId').then((user) => {
    const products = user.cart.products.map((product) => {
      return {
        quantity: product.quantity,
        // product: product.productId,
        product: { ...product.productId._doc } /////// professor explica que VAI USAR  o SPREAD OPERATOR nesse  'product.productId', MAS QUE  NÃO VAI USAR  ISSO  NESSE 'id' aí, e SIM __ EM  __UM __ FIELD ESPECIAL__  QUE O  MONGOOSE NOS DÁ, QUE É  O   FIELD DE  '._doc'..         PROFESSOR NOS EXPLICA QUE PODEMOS CHAMAR '... xxxx._doc' NESSE 'productId' aÍ  _JUSTAMENTE__/APENAS  PQ   O 'productId' _SERÁ ACTUALLY___ UM  OBJETO  COM __ UM MONTE___ DE METADATA  ANEXADA A ELE... ( ainda que  essa metadata seja COMPLETAMENTE INVISÍVEL.... mesmo com console.logs.. ) --> MAS COM '._doc', O QUE  CONSEGUIMOS É O __ ACESSO__  A ___rEALMENTE__  'just the data thats in there'...           ____ OU SEJA___, VAMOS ___ CONSEGUIR __ SÓ A DATA DO 'PRODUCT' VINCULADO a esse  'productId', E NÃO _O 'productId' em si... o que é conveniente... --------> E É CLARO QUE  USAMOS  o  'spread operator' chainado ali  PARA _ 'PULL OUT ALL THE DATA'  desse document que retrievamos, para completar a manipulação de dados e conseguir os encaixar naquela key de 'product'...

      };
    });

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },

      products: products,

      totalPrice: 0,
    });

    order.save().then((result) => {
      return req.user.clearCart().then((result) => {
        res.status(302).redirect('/orders');
      });
    });
  });

  // Order.addOrder(user)
  // .then(
  //   (result) => {

  //     res.status(302).redirect('/orders');
  //   }
  // )
  // .catch(
  //   (err) => {
  //     console.log(err);
  //   }
  // )

  // req.user.addOrder() /////////CÓDIGO SEM O MONGOOSE.... sem mongoose models e seus methods....
  // .then(
  //   (result) => {

  //     console.log(result);
  //     res.redirect('/orders');
  //   }
  // )
  // .catch(
  //   (err) => {

  //     console.log(err);
  //   }
  // )

  //CÓDIGO QUE USAVA/USA SEQUELIZE....
  // let fetchedCart; //padrão bem recorrente.
  // // let productsArray; ////use este approach, junto com 'productsArray = products' e 'fetchedCart.removeProducts(productsArray)', se você NÃO QUISER USAR/NÃO PUDER USAR O 'fetchedCart.setProduct(null)', que é mais elegante e GASTA MENOS LINHAS DE CÓDIGO.

  //   req.user.getCart(
  //   ).then(

  //     (cart) => {
  //       fetchedCart = cart; //padrão bem recorrente.
  //       console.log(cart);
  //      return cart.getProducts(
  //      );
  //     }

  //   )
  //   .then(
  //     (products) => {

  //       console.log(products, 'LINEE');
  //       productsArray = products

  //        req.user.createOrder(  //////método mágico criado com  ''''User.hasMany(Order);''' e   '''Order.belongsTo(User);'''
  //        )
  //         .then(
  //           (order) => {
  //                               ///aqui vemos um uso de MAP para __ EDITAR/ACRESCENTAR_  UM FIELD EXTRA (quantity) aos PRODUCTS que serão convertidos/adicionados como 'orderItem' na table de 'orderItems'...
  //            return order.addProducts(products.map(  ///////// ///EIS O CÓDIGO EM QUESTÃO. quando falamos de 'Products', aqui, falamos que esses 'records' vão ser adicionados LÁ NA TABLE DE 'orderItems', exatamente como visto neste código aqui: '''' Order.belongsToMany(Product, {through: OrderItem});  e  '''' Product.belongsToMany(Order, {through: OrderItem});  '''''''' ------> PQ SÃO ESSAS 2 LINHAS DE CÓDIGO QUE SETTARAM ESSE COMPORTAMENTO E ESSE MAGIC METHOD DE 'addProducts' nesse OBJETO/instance de 'order'... --> como consequência disso, teremos records/linhas 'orderItem' ADICIONADAS À table de 'orderItems', e cada um desses records terá um field 'orderId', VINCULADO ESPECIFICAMENTE A ESSA 'order' que escrevemos em 'order.addProducts()', aqui...
  //              product => {

  //               product.orderItem = { quantity: product.cartItem.quantity} //professor escreve esse 'product.orderItem' PARA __EDITAR__  O VALOR DE CADA propriedade 'mágica' 'orderItem' dentro de cada 1 de nossos product.... --> e ele vai editar isso para COLOCAR O VALOR CORRETO DO FIELD 'quantity' de cada um desses records 'orderItem', justamente por meio do acesso ao valor 'product.cartItem.quantity', específico a esse product...
  //                return product;
  //              }
  //            ));
  //           }
  //         )
  //         .catch(err => {console.log(err)})
  //       }
  //   )
  //   .then(
  //     (result) => {

  //           return fetchedCart.setProducts(null);
  //           // return fetchedCart.removeProducts(productsArray); ///// ESTE APPROACH TBM FUNCIONA, MAS É MENOS ELEGANTE DO QUE O APPROACH DO PROFESSOR... e precisa das linhas lá em cima de 'let productArray;' e 'productArray = products'...
  //     }
  //   )
  //   .then(
  //     (result) => {

  //       res.redirect('/orders');
  //     }
  //   )
  //   .catch(
  //     (err) => {
  //       console.log(err);
  //     }
  //   )
};

exports.getProductsPage = (req, res, next) => {
  // Product.findAll({where:}).then().catch(); /////ali no PRIMEIRO SLOT DE PARÂMETROS, de 'findAll', VOCÊ PODE COLOCAR __OPÇÕEs__ PARA O FETCH.... (definir restrições, como ''''só retrievar os records que tenham/WHERE 'id' igual a xxxx, etc etc...)

  // Product.getProducts()  ////método criado POR NÓS, lá em 'product', método ESTÁTICO....

  Product.find() ////MÉTODO DO MONGOOSE.... --> sintaxes alternativas (que te dão o CURSOR em vez de um array) ---> 'Product.find().cursosr().eachAsync()'       __ E ____ 'Product.find().cursor().next()' -------> ESSAS 2 VERSÕES VAO TE DAR O _CURSOr__ EM VEZ DE UM ARRAY COM TODOS OS DOCUMENTS... (comportamento contrário àquele do 'mongodb driver' comum, portanto...)
    // .select('title price -_id') ////É A MESMA COISA QUE O SEGUNDO PARÂMETRO DE '.populate()', mas atua sobre OS PRODUCTS RETRIEVADOS por meio de '.find()', e não a DATA RETRIEVADA LÁ DO 'RELATED OBJECT' (que é 'user', no caso desse call inferior de '.populate()')....
    .populate('userId', 'name') ///////// O 'POPULATE' (que deve ser chamado após '.find()', opcionalmente) TE DEIXA DIZER AO  'MONGOOSE' QUE  ELE  DEVE  ''''POPULATE A CERTAIN FIELD ___WITH ALL THE __  DETAILED INFORMATION ABOUT  THAT THING (no caso, o 'user'), NOT JUST ITS ID'''''... --> DE FATO, ISSO É ___MUITO, MAS MUITO ÚTIL... (OBS:: O PARâMETRO, no caso 'userId', é o FIELD QUE VOCÊ DESEJA QUE FIQUE PREENCHIDO POR TODA ESSA DETAILED INFORMATION acerca desse document envolvido na relation (no caso, 'user', o user RELACIONADO ao given product) ... ---> JÁ O SEGUNDO PARÂMETRO CUMPRE A MESMA TAREFA DE '.select('fields a serem retrievados de sua database...')'; OU SEJA, NELE VOCÊ PASSA, COMO PARÂMETRO, UMA STRING DIZENDO __QUAIS __ PRODUCTS __ DEVEM SER __RETRIEVADOS DA DATABASE... (é um parâmetro opcional, exatamente como '.select()' o é...)
    .then((products) => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/products',
        productCSS: true,
        activeShop: true,
        hasProducts: products.length > 0,
      });
    });

  //  res.render('shop/product-list', {
  //     prods: products,
  //     pageTitle: 'Shop',
  //     path: '/products',
  //     productCSS: true,
  //     activeShop: true,
  //     hasProducts: products.length > 0,
  //   });

  //CÓDIGO QUE USAVA SEQUELIZE....
  // Product.findAll()
  //   .then(
  //     //////DENTRO DO 'THEN BLOCK' vamos ter os nossos products, essencialmente...
  //     (products) => {
  //       res.render('shop/product-list', {
  //         prods: products,
  //         pageTitle: 'Shop',
  //         path: '/products',
  //         productCSS: true,
  //         activeShop: true,
  //         hasProducts: products.length > 0,
  //       });
  //     }
  //   )
  //   .catch();
};
