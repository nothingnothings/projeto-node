const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  }
});

module.exports = Cart;

// // module.exports = class Cart { //////////VERSÃO DO CÓDIGO QUE NÃO USAVA SEQUELIZE, NÃO USAVA DATABASE SQL, E QUE RECORRIA AO FILESYSTEM DO NOSSO SERVIDOR/MÁQUINA PARA FAZER HANDLE DO CART...
// //   constructor() {} //PROFESSOR DESISTE/MUDA DE IDEIA, E DIZ QUE __ NÃO VAMOS QUERER INSTANCIAR NOSSO CART NO NOSSO APLICATIVO... --> pq não o instanciar? --> É PQ __ NOSSO 'CART' DEVE __ SEMPRE EXISTIR NO NOSSO APP, não pode ser 'CRIADO DE SOPETÃO' ao longo do runtime... ----> O CART __ DEVE SER 1 MODEL ÚNICO, que não será 'OVERWRITTEN' ao logo do nosso runtime, e sim APENAS TERÁ ITEMS ADICIONADOS AO SEU ARRAY DE PRODUCTS/REMOVIDO DE SEU ARRAY DE PRODUCTS.... (mas o objeto/model 'cart', esse CONTINUA O MESMO durante todo o runtime..)
// // };

// const fs = require('fs');

// const path = require('path');

// const filePath = path.join(
//   path.dirname(process.mainModule.filename),
//   'data',
//   'cart.json'
// );

// module.exports = class Cart {

// static deleteProductFromCart(productId, productPrice) {

//     fs.readFile(filePath, (err, fileContent) => {
//         if(err) {
//           return;
//         }
//         const cart = JSON.parse(fileContent);
//         const updatedCart = {...cart};
//         const product = updatedCart.products.find(prod => prod.id === productId);

//         if(!product) {
//           return; //corrige o bug de '''
//           // --------> PROFESSOR DIZ QUE __SE NÃO TIVERMOS NENHUM PRODUCT
//           // NO CART, OU __ SE NÃO TIVERMOS O PRODUCT QUE QUEREMOS
//           // DELETAR LÁ  NO CART... --> VAMOS RECEBER __ UM ERRO QUANDO TENTARMOS DELETAR ESSE PRODUCT, COMO ADMIN...-->

//         }

//         const productQuantity = product.quantity;
//         updatedCart.products = updatedCart.products.filter(
//           prod => {
//             console.log(prod.id, productId);
//                 return prod.id !== productId;
//           }
//         )
//         console.log(updatedCart);
//         updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQuantity;
//             fs.writeFile(
//               filePath, JSON.stringify(updatedCart),
//               (err) => {
//                   console.log(err);
//               }
//             )
//     })
// }

// static getCart(callback) {
//  return fs.readFile(filePath,

//     (err, fileContent ) => {

//       if(err) {
//         console.log('ENTERED');
//         callback(null);
//       } else {
//         callback(JSON.parse(fileContent));
//       }

//     }
//   )
// }

//   static addProduct(productId, productPrice) {
//     //fetch the previous cart
//     fs.readFile(filePath, (err, fileContent) => {
//       //////// CÓDIGO BEM PARECIDO COM AQUELE VISTO LÁ em 'getProductsFromFile', lá no MODEL de 'product.js'...

//       let cart = { products: [], totalPrice: 0 }; //é usado no 'error case', pq aí __vamos CONSIDERAR QUE O ARQUIVO 'cart' NÃO EXISTIA ANTERIORMENTE, por isso essa variável com propriedades com valores zerados....

//       if (!err) {
//         /////// CÓDIGO BEM PARECIDO COM AQUELE VISTO LÁ em 'getProductsFromFile', lá no MODEL de 'product.js'...
//         console.log('TEST');
//         cart = JSON.parse(fileContent);
//       }
//       //analyze the cart => find existing product

//     //   const existingProduct = cart.products.find((item, index) => {  ///substituído pelo conjunto 'existingProductIndex' e 'existingProduct'...
//     //     return item.id === productId;
//     //   });

//         const existingProductIndex = cart.products.findIndex(prod => prod.id === productId);
//         const existingProduct = cart.products[existingProductIndex]; ////vai nos dar exatamente esse object aí...

//       //add new product/increase the already existing product's quantity....

//       let updatedProduct;

//       if (existingProduct) {
//         updatedProduct = {
//           ...existingProduct
//         };

//         updatedProduct.quantity = updatedProduct.quantity + 1; //vai aumentar a quantidade do product em 1, SEM ALTERAR O RESTO DE SUAS PROPRIEDADES (como 'id', que continua intacto...)
//         // if (existingProduct) { //// minha versão do MESMO CÓDIGO QUE TEMOS ACIMA... (não sei se funciona, tenho que testar... talvez o mecanismo de MERGE das propriedades seja DIFERENTE, por eu não estar usando redux/react...)

//         //     updatedProduct = {
//         //         ...existingProduct,
//         //         quantity: existingProduct.quantity++
//         //     }
//         // }
//         cart.products = [...cart.products]; ////copia nosso VELHO ARRAY de products do cart, com o 'existingProduct' ENFIADO NO MEIO (e que vamos querer SUBSTITUIR, pelo 'updatedProducts' visto na linha logo abaixo...)
//         cart.products[existingProductIndex] = updatedProduct; ///isto vai _SUBSTITUIR aquele 'existingProduct' DENTRO do array de 'products' POR ESSE 'updatedProduct'....

//       } else {
//         updatedProduct = { id: productId, quantity: 1 }; ///vamos criar 1 product no cart, aqui, se ele NAO JÁ EXISTIA ANTERIORMENTE...

//         cart.products = [...cart.products,
//         updatedProduct];
//       }

//       cart.totalPrice = parseInt(cart.totalPrice) + parseInt(productPrice);

//     //   return cart; /// haha, isso não existe... o que queremos fazer nessa function, o end result, É O __wRITE__ DE NOSSO CART__ NO ARQUIVO 'cart.json'...

//     fs.writeFile(filePath, JSON.stringify(cart),
//     (err) => {
//                 console.log(err);

//     })

//     });
//   }
// };
