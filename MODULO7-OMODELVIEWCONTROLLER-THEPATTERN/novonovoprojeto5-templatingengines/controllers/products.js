// const products = [];

const Product = require('../models/product');

exports.getAddProductPage = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product', //RENDER. USADO COM TEMPLATING ENGINES COMO 'pug'...
    path: '/admin/add-product',
    activeAddProduct: true,
    productCSS: true,
    formsCSS: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  // products.push({ title: req.body.title });


  const newProduct = new Product(req.body.title); 
  newProduct.save();  //é código assíncrono, no final das contas...
  res.status(302).redirect('/');
};

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


exports.getProducts = (req, res, next) => {

  Product.fetchAll((products) => { //é código assíncrono, no final das contas...

      res.render('shop', {
  prods: products,
  pageTitle: 'Shop',
  path: '/',
  productCSS: true,
  activeShop: true,
  hasProducts: products.length > 0,
});


  });

};
