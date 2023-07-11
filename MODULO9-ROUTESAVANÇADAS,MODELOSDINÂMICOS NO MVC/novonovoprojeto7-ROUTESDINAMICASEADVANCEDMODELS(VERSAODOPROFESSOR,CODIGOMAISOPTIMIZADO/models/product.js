const fs = require('fs');

const path = require('path');







const Cart = require('./cart');

const pathHelper = require('../util/path');






// const products = [];

// const filePath = path.join(pathHelper, 'data', 'ProductList.json');  ////FOI TRANSPLANTADO PARA DENTRO DA HELPER FUNCTION 'getProductsFromFile()'....

const filePath = path.join(pathHelper, 'data', 'ProductList.json');


///isto é uma __UTILITY FUNCTION__...
const getProductsFromFile = (callback) => { ////agrupa a lógica de 'READFILE', E __ PODE SER USADO __ TANTO PARA 'READ A FILE' COMO __ NA OPERAÇÃO DE 'WRITE', TBM... (pq a operação de WRITE também DEPENDE da operação de read, por isso as 2 sao frequentemente combinadas...)
  // const filePath = path.join(pathHelper, 'data', 'ProductList.json');

  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      callback([]);
    }
    else {
    callback(JSON.parse(fileContent));
    }
  });
};








module.exports = class Product {
  constructor(id, title, imageUrl, description, price) { //todos os objetos 'product' que críarmos/handlarmos/fetchearmos/enviarmos TERÃO ESSA ESTRUTURA AÍ, ESSE CONJUNTO DE PROPRIEDADES...
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  // save(editedProduct) {


    save() {
          ///decidimos criar o ID __ NESSE PROCESSO/MÉTODO DE 'save', de store de 1 product no nosso ARQUIVO/database, EM VEZ DE COLOCÁ-LO/definí-lo lá no CONSTRUCTOR DE 'product' ( o que é uma alternativa, na visão do professor...)
    //  if (!editedProduct) {
       
      getProductsFromFile(
        (products) => {
          if (this.id) { ///caso de EDIT A PRODUCT (pq vamos ter 1 product já existente, pq esse product já vai ter 1 id)
    
                const existingProductIndex = products.findIndex(item => item.id === this.id);
                const updatedProducts = [...products];

                updatedProducts[existingProductIndex] = this;
                fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
                  console.log(err);
                })
            console.log('test');
          } else {
            this.id = Math.random().toString(); ////VAI CRIAR UMA PROPRIEDADE 'id', unique identifier, DENTRO DE CADA OBJETO 'product'...
            ///vai criar essa propriedade NO CASE DE _ ADD DE UM PRODUTO TOTALMENTE NOVO (e não vai criá-la quando se tratar do EDIT DE UM PRODUCT JÁ EXISTENTE...)
                  products.push(this);
                  fs.writeFile(
                    filePath, JSON.stringify(products), 
                        (err) => {
                            console.log(err);
                        }
                      
                      )
                      console.log('test2');
                  
          }
        }
      )


    //   getProductsFromFile((products) => {

    //     products.push(this);

    //     fs.writeFile(filePath, JSON.stringify(products), (err) => {
    //       console.log(err);
    //     });
    //   })
    // } else {
        
    //   getProductsFromFile((products) => { ///meu código... talvez esteja errado....
    //       console.log(editedProduct.id.toString());

    //    const productToBeEditedIndex = products.findIndex(
    //       (item, index) => {
    //         // console.log(item.id, 'LINE');
    //             return parseInt(editedProduct.id) !== item.id;
    //       }
    //     )
          
    //     console.log(productToBeEditedIndex);
      
    //     products[productToBeEditedIndex] = editedProduct;
          

    //         console.log(products);

    //     fs.writeFile(filePath, JSON.stringify(products), (err) => {
    //       console.log(err);
    //     });
    //   })


    // }

  }


  // static findProduct(productId) { ///// MINHA VERSÃO DO MÉTODO 'findProductById'; NÃO FUNCIONA, POIS ESQUECI O CALLBACK...
  //    const product = getProductsFromFile(
  //         (products) => {
  //           // console.log(products);
  //             products.find(
  //               (item, index) => {
  //                  return item.id === productId
  //               }
  //             )
  //         }

  //       )

  //       return product;
  
  // }



  static findProduct(productId, callback) {
   getProductsFromFile(
         (products) => {
           // console.log(products);
          //  console.log(productId, '00');

          const product = products.find(
               (item, index) => {
                //  console.log(item.id === productId);
                  return item.id === productId;
               }
             )
            // console.log(product, 'CXXAS');
             callback(product);
             
         }
        
       )
 }



static deleteProduct(productId) {

  // getProductsFromFile( ///TAMBÉM FUNCIONA, MAS É UM POUCO MENOS ÓPTIMO (minha versão do código).
  //     (products) => {
  //       const existingProductIndex = products.findIndex(item => item.id === productId);
  //       const updatedProducts = [...products];
  //       updatedProducts.splice(existingProductIndex, 1);
  //       fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
  //         console.log(err);
  //       })
  //   console.log('test');
  //     }
  // )
  getProductsFromFile( //versão do professor (mais optimizada).
    (products) => {
      const productPrice = products.find((product) => {return product.id === productId}).price;
      const updatedProducts = products.filter(prod => prod.id !== productId);

      fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
        console.log(err);

        if (!err) {
          Cart.deleteProductFromCart(productId, productPrice); ////vai DELETAR ESSE PRODUCT ESPECÍFICO DO NOSSO CART/CART DO USUÁRIO, caso o admin DELETE ESSE PRODUCT DA LISTA DE PRODUCTS DISPONÍVEIS...
        }
      })
  console.log('test');
    }
)
} 





  // static fetchAll() {
  //   //return this.products;
  //   return products;
  // }

  //  static fetchAll() {
  //  fs.readFile(filePath, (err, fileContent) => {

  //         if(err) {
  //           alert('Whoops, something went wrong. No products are displayed...');
  //           return [];
  //         }
  //         console.log(JSON.parse(fileContent));

  //         return JSON.parse(fileContent);
  //       })

  //   }


      static fetchAll(cb) {
            getProductsFromFile(cb);

      }
  
  // static fetchAll(callback) { ///solução do professor, código assíncrono, callback functions que solucionam nosso problema de FALTA DE ORDEM...

        ////FOI AGRUPADO (esse 'readFile') DENTRO DA HELPER FUNCTION DE 'getProductsFromFile', que JUNTA TANTO A LÓGICA DE 'fetchAll' como a lógica de PATH BUILDING de 'filePath'...
  //////   VVVVVV
  //   fs.readFile(filePath, (err, fileContent) => {

  //          if(err) {
  //            alert('Whoops, something went wrong. No products are displayed...');
  //           //  return [];
  //           callback([]); ////vai executar esse callback 'WHEN ITS DONE'...
  //          }
  //         //  console.log(JSON.parse(fileContent));

  //         //  return JSON.parse(fileContent);

  //         callback(JSON.parse(fileContent)); //vai executar esse 'callback' ONCE ITS DONE (como um callback comum)...
  //        })

  //    }
};
