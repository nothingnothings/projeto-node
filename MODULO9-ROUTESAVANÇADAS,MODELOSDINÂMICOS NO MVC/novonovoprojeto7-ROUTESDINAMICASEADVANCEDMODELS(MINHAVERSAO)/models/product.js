const fs = require('fs');

const path = require('path');


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
  constructor(title, imageUrl, description, price) { //todos os objetos 'product' que críarmos/handlarmos/fetchearmos/enviarmos TERÃO ESSA ESTRUTURA AÍ, ESSE CONJUNTO DE PROPRIEDADES...
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  // save() {
  //   // products.push(this);

  //   // console.log(filePath);

  //   // console.log(JSON.stringify(this));

  //   // fs.writeFile(filePath + '/' + 'ProductList', JSON.stringify(this), (err) => {
  //   //   console.log(err);
  //   // })

  //   // const result = await fs.appendFile(filePath + '/' + 'ProductList', JSON.stringify(this), (err) => {
  //   //   console.log(err);
  //   // })

  //   // const result = await fs.appendFile(filePath, JSON.stringify(this), (err) => { ////MINHA VERSÃO DE 'ARMAZENAR' os arquivos de forma __CUMULATIVA... (sem dar overwrite..) ---> é uma versão RUIM do código de baixo, pois não CONSIDERA CENÁRIOS EM QUE __ TEMOS NENHUM ARQUIVO 'ProductList.txt' (o que pode acontecer, mas é algo QUE É REMEDIADO PELO CÓDIGO/VERSÃO DO CÓDIGO DO PROFESSOR, USADA MAIS ABAIXO...)
  //   //   console.log(err);
  //   // })

  //   fs.readFile(filePath, (err, fileContent) => {
  //     let products = [];

  //     if (!err) {
  //       ///caso de AUSÊNCIA DE ERROR/caso de __ JÁ EXISTIR UM ARQUIVO de 'ProductList.txt',  (ou seja, não há a 'INEXISTÊNCIA DE UM ARQUIVO ProductList.json', que é algo que CAUSARIA/CAUSA ERROS....)
  //       // products = [JSON.parse(fileContent)];

  //       products = JSON.parse(fileContent);
  //     }

  //     products.push(this);

  //     fs.writeFile(filePath, JSON.stringify(products), (err) => {
  //       console.log(err);
  //     });
  //   });
  // }

  save(editedProduct) {
          ///decidimos criar o ID __ NESSE PROCESSO/MÉTODO DE 'save', de store de 1 product no nosso ARQUIVO/database, EM VEZ DE COLOCÁ-LO/definí-lo lá no CONSTRUCTOR DE 'product' ( o que é uma alternativa, na visão do professor...)
     if (!editedProduct) {
       
      this.id = Math.random().toString(); ////VAI CRIAR UMA PROPRIEDADE 'id', unique identifier, DENTRO DE CADA OBJETO 'product'...

      getProductsFromFile((products) => {

        products.push(this);

        fs.writeFile(filePath, JSON.stringify(products), (err) => {
          console.log(err);
        });
      })
    } else {
        
      getProductsFromFile((products) => { ///meu código... talvez esteja errado....
          console.log(editedProduct.id.toString());

       const productToBeEditedIndex = products.findIndex(
          (item, index) => {
            // console.log(item.id, 'LINE');
                return parseInt(editedProduct.id) !== item.id;
          }
        )
          
        console.log(productToBeEditedIndex);
      
        products[productToBeEditedIndex] = editedProduct;
          

            console.log(products);


        // const editedProducts = [
        //   ...products, 
        //   editedProduct
        // ]

        fs.writeFile(filePath, JSON.stringify(products), (err) => {
          console.log(err);
        });
      })


    }

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
          const product = products.find(
               (item, index) => {
                  return item.id === productId
               }
             )
             callback(product);
         }

       )
 
 }













deleteProduct() {

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
