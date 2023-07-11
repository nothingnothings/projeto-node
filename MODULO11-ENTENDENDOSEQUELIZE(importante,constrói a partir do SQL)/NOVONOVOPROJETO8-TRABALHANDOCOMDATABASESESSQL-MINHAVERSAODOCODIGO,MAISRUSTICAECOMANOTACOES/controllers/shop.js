// const products = [];

const Product = require('../models/product');

const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');

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
  console.log(req.user.cart, 'LINE'); ////isso (o cart) não existe dentro do objeto 'req.user', justamente pq DEVEMOS O CONSEGUIR ATRAVÉS DE 'req.user.getCart()', para conseguir o cart específico Àquele user (userId field dentro do cart e 'id' field no user DEVEM DAR MATCH...)

  let productList;

  const cartId = req.user
    .getCart()
    .then((cart) => {
      console.log(cart, 'LINE');
      return cart.getProducts();
    })
    .then((products) => {
      console.log(products);

      productList = products;

      CartItem.findAll({ where: { cartId: req.user.id } }).then((cartItems) => {
        productList.forEach((product) => {
          product.quantity = cartItems.find((cartItem) => {
            return cartItem.productId === product.id;
          }).quantity;
        });
        return res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          cartProducts: productList,
          // cartItems: cartItems
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });

  // Cart.getCart((cart) => { //////CÓDIGO QUE USAVA/USA __ O FILESYSTEM EM VEZ DE NOSSA DATABASE SQL/código do sequelize...
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (const product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({
  //           productData: product,
  //           quantity: cartProductData.quantity,
  //         });
  //       }
  //     }
  //     console.log(cartProducts);
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       cartProducts: cartProducts,
  //     });
  //   });
  // });
};

exports.deleteCartItem = (req, res, next) => {
  const productId = req.body.id;
  // const productPrice = req.body.price; ////esta versão do código __ NÃO FUNCIONA___ (pq é o price _ GERAL__ que vai ser considerado, nesse negócio, e não o PRICE DE CADA PRODUCT INDIVIDUAL..)
  console.log(productId);

  Product.findProduct(productId, (product) => {
    console.log(product, 'LINE');
    Cart.deleteProductFromCart(productId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrdersPage = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};

exports.postToCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  // const productPrice = req.body.price; //não consigo adquirir essa informação dessa forma...

  // console.log(productId);

  // Product.findProduct(
  //   productId,

  //   (product) => {
  //     Cart.addProduct(product.id, product.price);
  //     res.redirect('/cart');
  //   }
  // );

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } }); ////retornamos o valor dessa promise para PODERMOS RODAR CHECKS NELA, NO PRÓXIMO THEN BLOCK...
    })
    .then((products) => {
      //array que precisa ser MANIPULADO, como visto no código de 'product = products[0]'...

      let product;

      if (products.length > 0) {
        product = products[0];
      }

      let newQuantity = 1;

      if (product) {
        console.log('ENTERED BLOCK');
        console.log('TESTE', product, 'TESTE');
        CartItem.findAll({ where: { productId: productId } }) ////como um PRODUCT com aqueles critérios JÁ FOI ENCONTRADO NO NOSSO CART, NÃO VAMOS QUERER CRIAR 1 NOVO 'PRODUCT', E SIM vamos querer adicionar 1 unidade À 'quantity' 'old' de nossos products...
          .then((cartItems) => {
            const cartItem = cartItems[0];

            CartItem.update(
              { quantity: cartItem.quantity + 1 },
              { where: { productId: productId } }
            ) ////CÓDIGO ABSURDAMENTE CLUNKY, MAS QUE FUNCIONOU..
              .then((result) => {
                console.log(result);
              });
          });
      } else {
        return Product.findByPk(productId) ///executamos isto pq queremos ADICIONAR ESSE PRODUCT ESPECÍFICO, sua data, ao nosso cart....
          .then((product) => {
            console.log(product, 'O product encontrado no database...');

            console.log(fetchedCart, 'O cart em questão'); ///este 'addProduct' aqui de baixo é bem bugado, professor passou 'product' como seu parâmetro, e ele não dá erro, realmente aceita esse parâmetro....
            return fetchedCart.addProduct(product, {
              through: { quantity: newQuantity },
            }); ///ver anotações em 'adicionando novos produts ao nosso cart', ou a aula '163' do professor....
          })
          .catch((err) => {
            console.log(err);
          });
      }

      // return Product.findByPk(productId) ///executamos isto pq queremos ADICIONAR ESSE PRODUCT ESPECÍFICO, sua data, ao nosso cart....
      // .then(
      //   product => {
      //     console.log(product, 'O product encontrado no database...');

      //     console.log(fetchedCart, 'O cart em questão'); ///este 'addProduct' aqui de baixo é bem bugado, professor passou 'product' como seu parâmetro, e ele não dá erro, realmente aceita esse parâmetro....
      //         return fetchedCart.addProduct(product, {through: {quantity: newQuantity}}) ///ver anotações em 'adicionando novos produts ao nosso cart', ou a aula '163' do professor....
      //   }
      // )
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch();
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
  const productId = req.params.productId;

  // Product.findById(productId) //SINTAXE DEPRECADA ('findById' substituído por 'findByPk', find by primary key...)
  Product.findByPk(productId)
    .then((product) => {
      if (!product) {
        return;
      }

      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
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

exports.getProductsPage = (req, res, next) => {
  // Product.findAll({where:}).then().catch(); /////ali no PRIMEIRO SLOT DE PARÂMETROS, de 'findAll', VOCÊ PODE COLOCAR __OPÇÕEs__ PARA O FETCH.... (definir restrições, como ''''só retrievar os records que tenham/WHERE 'id' igual a xxxx, etc etc...)
  Product.findAll()
    .then(
      //////DENTRO DO 'THEN BLOCK' vamos ter os nossos products, essencialmente...
      (products) => {
        res.render('shop/product-list', {
          prods: products,
          pageTitle: 'Shop',
          path: '/products',
          productCSS: true,
          activeShop: true,
          hasProducts: products.length > 0,
        });
      }
    )
    .catch();
};
