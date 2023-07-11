// const products = [];

const Product = require('../models/product');

const Cart = require('../models/cart');

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
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
          const cartProducts = [];
          for (const product of products) {
         const cartProductData = cart.products.find(prod => prod.id === product.id);
            if(cartProductData) {
              cartProducts.push({productData: product, quantity: cartProductData.quantity});
            }
          }
          console.log(cartProducts);
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            cartProducts: cartProducts
          });
      });


    });

};



exports.deleteCartItem = (req, res, next) => {


  const productId = req.body.id;
  // const productPrice = req.body.price; ////esta versão do código __ NÃO FUNCIONA___ (pq é o price _ GERAL__ que vai ser considerado, nesse negócio, e não o PRICE DE CADA PRODUCT INDIVIDUAL..)
  console.log(productId);

  Product.findProduct(productId,
    (product) => {
      console.log(product, 'LINE');
      Cart.deleteProductFromCart(
          productId, product.price
      )
      res.redirect('/cart');
    }
    
    )
}


exports.getOrdersPage = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};

exports.postToCart = (req, res, next) => {
  const productId = req.body.productId;
  // const productPrice = req.body.price; //não consigo adquirir essa informação dessa forma...

  console.log(productId);

  Product.findProduct(
    productId,

    (product) => {
      Cart.addProduct(product.id, product.price);
      res.redirect('/cart');
    }
  );
};

exports.getProductDetailPage = (req, res, next) => {
  const productId = req.params.productId;
  console.log(productId);


    Product.findProduct(productId)
    .then(
      ([rows, fieldData]) => {
            // console.log(rows[0]);
        const productData = {
          ...rows[0]
        }
        console.log(productData);
            // const productDetail = {...rows[0][0]}
            // console.log(productDetail);
            // console.log(rows[0].title);
                res.render('shop/product-detail', {
      pageTitle: productData.title,
      path: '/products',
      product: productData
    });
      }
    )
    .catch(
      (err) => {
        console.log(err);
      }
    )




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

exports.getProductsPage = (req, res, next) => {


   //é código assíncrono, no final das contas...


   Product.fetchAll(
   )
   .then(
    ([rows, fieldData]) => { ///'fieldData' --> é a METADATA acerca de nossa data (que é 'rows') retrievada da database SQL...
      res.render('shop/product-list', {
prods: rows, ////EIS O CÓDIGO EM QUESTÃO.
pageTitle: 'Shop',
path: '/products',
productCSS: true,
activeShop: true,
hasProducts: rows[0].length > 0,
});
})





  // Product.fetchAll((products) => { //minha versão. errada.
  //  

  //   res.render('shop/product-list', {
  //     prods: products,
  //     pageTitle: 'Shop',
  //     path: '/products',
  //     productCSS: true,
  //     activeShop: true,
  //     hasProducts: products.length > 0,
  //   });
  // });
};
