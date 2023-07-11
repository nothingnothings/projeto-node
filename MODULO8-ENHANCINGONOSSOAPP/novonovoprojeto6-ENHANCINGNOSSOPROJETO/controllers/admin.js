const Product = require('../models/product');

exports.getAddProductPage = (req, res, next) => {
    res.render('admin/add-product', {
      pageTitle: 'Add Product', //RENDER. USADO COM TEMPLATING ENGINES COMO 'pug'...
      path: '/admin/add-product',
      activeAddProduct: true,
      productCSS: true,
      formsCSS: true,
    });
  };


exports.postAddProduct = (req, res, next) => {
    // products.push({ title: req.body.title });
  
  
    const newProduct = new Product(req.body.title, req.body.image, req.body.description, req.body.price ); 
    newProduct.save();  //é código assíncrono, no final das contas...
    res.status(302).redirect('/');
  };



  exports.deleteProduct = (req, res, next) => {



  }

exports.getProductsAdminPage = (req, res, next) => {
    Product.fetchAll(
      (products) => {res.render('admin/product-list-admin', {
        path: '/admin/products-list',
        pageTitle: 'Admin Products Page',
        prods: products
      })}
    )

}


