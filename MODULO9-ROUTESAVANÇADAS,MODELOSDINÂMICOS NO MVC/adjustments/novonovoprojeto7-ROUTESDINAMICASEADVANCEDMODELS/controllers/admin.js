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
    editing:  editMode
  });
};


exports.getEditProductPage = (req, res, next) => {


  const editMode = req.query.edit;

  // console.log(req.params.productId);

  if(!editMode) {
    return res.redirect('/'); ////redireciona admin que NÃO TIVER O QUERY PARAM de 'edit=true' na url que é enviada a route de '/admin/edit-product/:productId?'....
  }
  
  const productId = req.params.productId;

  Product.findProduct(productId,
      (product) => {
        // console.log(product);
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product', 
          path: '/admin/edit-product',
          editing: editMode, ////TRABALHO COM QUERY PARAMS.... --> usado para comunicar/diferenciar entre requests que querem ADICIONAR UM NOVO PRODUTO E ___ REQUESTS__ QUE QUEREM __ ALTERAR UM PRODUTO QUE JÁ EXISTE ('editMode = true'....)
          prod: product
        });
      }
    
    )


};



exports.editProduct = (req, res, next) => {
      const productId = req.params.productId;
      const editedProduct = new Product();

      Product.findProduct(
        productId, (product) => {
              // console.log(product);
              // console.log(req.body);
              // res.redirect('/');

              const newProduct = {
                  ...req.body,
                  id: productId
              }
              // console.log(newProduct, 'LINE2');

             if (product === newProduct) {
              alert('No changes to product were detected, redirecting to home page...');
               res.redirect('/');
             } else {
             editedProduct.save(newProduct);
            //  console.log('TEST');
              res.redirect('/');
             }
             
            


        }
      )
}



    



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


