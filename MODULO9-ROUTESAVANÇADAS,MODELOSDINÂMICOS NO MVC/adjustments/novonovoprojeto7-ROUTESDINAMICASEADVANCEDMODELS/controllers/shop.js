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
        pageTitle: 'The Shop'
  })
}

exports.getCheckoutPage = (req, res, next) => {


  res.render(
    'shop/checkout',
    // {
    //   pageTitle: 'checkout',
    //   path: '/shop/checkout'
    // }
  )
}



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


exports.getCartPage = (req, res, next) => {

      res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Cart'

      } )
}




// exports.getProductsAdminPage = (req, res, next) => {

//       res.render('admin/product-list-admin', {
//           path: '/admin/products-list',
//           pageTitle: 'Admin Products Page'
//       })
// }



exports.getOrdersPage = (req, res, next) => {

    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders'

    })

}



exports.getProductDetailPage = (req, res, next) => {

  const productId = req.params.productId;

 Product.findProduct(productId, 

  (product) => {
      console.log(product, 'LINE2122');
      // return product;

      res.render('shop/product-detail',   //////EIS O CÓDIGO EM QUESTÃO.
      {
        pageTitle: 'Product Detail',
        path: '/products',
       product: product
      }
      )
  }
  );


    // res.render('shop/product-detail', 
    // {
    //   pageTitle: 'Product Detail',
    //   path: '',
    //   prod: product
    // }
    // )

}


exports.postToCart = (req, res, next) => {

  const productId = req.body.productId;
  // const productPrice = req.body.price; //não consigo adquirir essa informação dessa forma...

  console.log(productId);


    Product.findProduct(productId, 
    
    (product) => {

      Cart.addProduct(product.id, product.price);
      res.redirect('/cart');
    });

}
    





exports.getProductsPage = (req, res, next) => {

  Product.fetchAll((products) => { //é código assíncrono, no final das contas...

      res.render('shop/product-list', {
  prods: products,
  pageTitle: 'Shop',
  path: '/products',
  productCSS: true,
  activeShop: true,
  hasProducts: products.length > 0,
});


  });

};
