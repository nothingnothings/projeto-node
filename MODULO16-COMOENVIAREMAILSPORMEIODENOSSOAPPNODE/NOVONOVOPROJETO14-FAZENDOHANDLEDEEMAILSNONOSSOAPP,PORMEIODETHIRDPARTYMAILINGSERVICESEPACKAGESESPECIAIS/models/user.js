// const Sequelize = require('sequelize');

// const { Sequelize } = require('sequelize');

// const sequelize = require('../util/database');

// const User = sequelize.define(
//     'user', {
//         id: {
//             type: Sequelize.INTEGER,
//             allowNull: false,
//             primaryKey: true,
//             autoIncrement: true
//         },
//         name: {
//             allowNull: false,
//             type: Sequelize.STRING,
//         },
//         email: {
//             allowNull: false,
//             type: Sequelize.STRING ////É O EQUIVALENTE A 'VARCHAR(255)', lá no WORKBENCH/DATABASE SQL COMUM...
//         },
//         // password: {
//         //     allowNull: false,
//         //     type: Sequelize.NUMBER
//         // }
//     }
// )

// module.exports = User;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const Order = require('../models/order');




const userSchema = new Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true
  },

  cart: { products: [
    {
      productId: { type: Schema.Types.ObjectId, 
        ref: 'Product', /////AQUI DEFINIMOS UMA RELATION/reference AO MODEL/COLLECTION de 'products'...
        required: true },
      quantity: { type: Number, required: true },
    },
  ],
}
}
);



userSchema.methods.clearCart = function() {



  this.cart = {
    products: []
  }

  return this.save();

}




userSchema.methods.deleteCartItem = function(productId) {



  const updatedProducts = this.cart.products.filter(
    (product) => {
              console.log(productId.toString() !== product.productId.toString())
              return  productId.toString() !== product.productId.toString();
    }
  )
  
  this.cart.products = updatedProducts;
  
  
 return this.save().then(
    (result) => {
  
  
      console.log(result);
    }
  )
  .catch(
    (err) => {
      console.log(err);
    }
  )


}




// userSchema.methods.getOrders = function() {



//   Order.find({_id: this._id}).
//   populate('cart.products.productId').
//   then(
//     (orders) => {

//         console.log(orders);
//       return orders;
//     }
//   )
//   .catch(
//     (err) => {
//       console.log(err);
//     }
//   )

// }





userSchema.methods.addToCart = function(product) {  ////////PROFESSOR EXPLICA QUE É __ DESSA FORMA QUE ADICIONAMOS 'CUSTOM METHODS' AOS NOSSOS MODELS CRIADOS POR MEIO DO MONGOOSE (mongoose models).... --> é um approach REALMENTE BEM DIFERENTE, pq dependemos de um object/key/method chamado de '.methods' nos SCHEMAS DEFINIDOS POR nós (como 'userSchema') para DEFINIR METHODS CUSTOM...
                ///usamos a sintaxe CLÁSSICA de functions, aqui, porque QUEREMOS QUE a keyword 'this' TENHA UM COMPORTAMENTO ESPECÍFICO, QUEREMOS QUE O 'this' se refira, nessa função, AO 'schema' em si, e NÃO A QUALQUER OUTRA COISA...



                // this   //vai se referir ao SCHEMA, que é o que queremos...

    const cartProductIndex = this.cart.products.findIndex((prod) => {
      return product._id.toString() === prod.productId.toString();
    });

    let newQuantity = 1;

    const updatedCartItems = [...this.cart.products];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.products[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        // productId: ObjectId(product._id),
        productId: product._id, ////colocamos 'product._id' em vez de 'ObjectId(product._id)', aqui, PQ O MONGOOSE VAI AUTOMATICAMENTE WRAPPAR ESSE VALOR DE 'product._id' em 1 'ObjectId()'....
        quantity: newQuantity,
      }); 
    }

    const updatedCart = {
      products: updatedCartItems,
    };

    // const db = getDb();   ///deprecado, pois agora estamos usando o MONGOOSE, que faz esse 'connect à database' PARA NÓS, por meio de poucos códigos lá em 'app.js' (mongo.connect()) e nos nossos models, por meio desses schemas...

    // return db  ///////PROFESSOR DEIXA DE UPDATAR NOSSA COLLECTION/DOCUMENT MANUALMENTE assim... --> passamos a usar o mongoose, o approach do mongoose, que é diferente, e está escrito logo aabaixo... 
    //   .collection('users')
    //   .updateOne(
    //     { _id: ObjectId(this._id) },

    //     {


    //       $set: {
    //         cart: updatedCart,
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log('ADDED PRODUCT TO CART!');
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });





    this.cart = updatedCart; /////EXTREMAMENTE NECESSÁRIO, pois 'SETTA' a data/mudanças na data de nosso document/objeto  QUE DEVERÃO SER _ APLICADAS A ESSE OBJECT NA COLLECTION, por meio do 'this.save()' escrito logo abaixo...
    this.save(); ////VAI ___SALVAR___ AS MUDANÇAS efetuadas sobre nosso objeto 'user', mudanças realizadas no mesmo 'block' em que esse call de 'this.save()' se encncontra....
        ////^^^^ método BUILTIN do mongoose, é builtin em TODOS OS MODELS MONGOOSe..










}


module.exports = mongoose.model('User', userSchema);











////  CÓDIGO QUE NÃO USA O MONGOOSE, deprecado... (usa o mongodb driver NORMAL, sem o mongoose.... usa o 'getDb()', lá de 'database.js'...)
// const getDb = require('../util/database').getDb;

// const ObjectId = require('mongodb').ObjectId;

// class User {
//   constructor(username, email, cart, id) {
//     ///com isso, nosso 'Cart' collection PASSA A VIVER DENTRO Da collection/documents 'user'/'users', o que é exemplo PERFEITO DE UM USO DE DATABASE NOSQL PARA ESTABELECER RELATIONS POR MEIO DE 'DATA EMBEDDING' em vez de 'REFERENCING'....
//     //////cart é o nosso exemplo de DATA EMBEDDING como a OUTRA FORMA DE ESTABELECER RELATIONS entre diferentes collections/tables, alternativa ao uso de REFERENCES (como 'cartId', 'productId', etc etc...) -------> O USO DE 'EMBEDDED DOCUMENTS' como esse 'cart' em 'user' É __ IDEAL___ EM CASOS __ EM QUE VOCÊ TEM RELATIONS 'ONE-TO-ONE', COMO ESSA RELATION ENTRE 'cart' e 'user' (pq o fato de isso ser uma relation 'one-to-one' ___ TORNA DESNECESSÁRIO O USO DE REFERENCES, e ainda mais o uso de uma database SQL...)
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();

//     return db
//       .collection('users')
//       .insertOne(this)
//       .then((result) => {
//         console.log('User Created in Database');
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   // addToCart(product) { ///CÓDIGO DE MINHA AUTORIA. NÃO SEI SE ESTÁ CERTO. REALMENTE NÃO ESTAVA CERTO....
//   //   const db = getDb();

//   //   db.collection('users')
//   //     .findOne({
//   //       _id: this._id,
//   //     })
//   //     .then((user) => {
//   //       const foundProduct = user.cart.find((product) => {
//   //         return product === product;
//   //       });
//   //       if (!foundProduct) {
//   //         const newProduct = product;
//   //         user.cart
//   //           .insertOne(newProduct)
//   //           .then((result) => {
//   //             console.log('Added Product to Cart');
//   //           })
//   //           .catch((err) => {
//   //             console.log(err);
//   //           });
//   //       } else {
//   //         const updatedProduct = {
//   //           $set: {
//   //             quantity: foundProduct.quantity + 1,
//   //           },
//   //         };
//   //         user.cart.updateOne({ _id: product.id }, updatedProduct).then(
//   //           (result) => {
//   //               console.log('UPDATED PRODUCT');
//   //           }
//   //         ).catch(
//   //           (err) => {
//   //             console.log(err);
//   //           }
//   //         )
//   //       }
//   //     });
//   // }

//   // getCart() { //usado com o MEU código antigo de 'getCart', lá no CONTROLLER DE 'shop.js'....

//   //   console.log(this.cart);
//   //   return this.cart;
//   // }

//   getCart() {
//     /////usado com o código DO PROFESSOR de 'getCart', é mais optimizado e bonito; tbm melhor pq EXECUTA ESSA LÓGICA DE _TRANSFORMAÇÃO DE NOSSA 'PRODUCT DATA' aqui nesse model, e NÃO NO NOSSO CONTROLLER DE 'shop.js', como fazia meu código...
//     const db = getDb();

//     const productIds = this.cart.products.map((product) => {
//       return product.productId;
//     });

//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.products.find((prod) => {
//               return prod.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   deleteProductFromCart(productId) {
//     const db = getDb();

//     console.log(this.cart);

//     const updatedCartItems = this.cart.products.filter((prod) => {
//       return prod.productId.toString() !== productId.toString();
//     });

//     return db
//       .collection('users')
//       .updateOne(
//         { _id: ObjectId(this._id) },

//         { $set: { cart: { products: updatedCartItems } } }
//       )
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(result);
//       });

//     // const updatedCartItems = [
//     //   ...this.cart.products
//     // ]

//     // const neededProductIndex = updatedCartItems.findIndex((prod) => {
//     //   return prod.productId.toString() === productId.toString();
//     // });

//     // updatedCartItems[neededProductIndex] = '';

//     // return db.collection('users').updateOne(
//     //   { _id: ObjectId(this.id) },

//     //   { $set: { products: updatedCartItems } }
//     // )
//     // .then(
//     //   (result) => {
//     //     console.log(result);
//     //   }
//     // )
//     // .catch(
//     //   (err) => {
//     //     console.log(result);
//     //   }
//     // )

//     // console.log(productId, 'LINEEE'); ///////CÓDIGO QUE NÃO FUNCIONA.
//     // const neededProductIndex = user.cart.products.findIndex((prod) => {
//     //   return prod.productId.toString() === productId.toString();
//     // });

//     // console.log(neededProductIndex);

//     // return db
//     //   .collection('users')
//     //   .updateOne({ _id: user._id }, { $pull: { 'cart.products': productId } })
//     //   .then((result) => {
//     //     console.log('Removed product from cart');
//     //   })
//     //   .catch((err) => {
//     //     console.log(err);
//     //   });
//   }

//   getOrders() {
//     const db = getDb();

//     return db
//       .collection('orders')
//       // .find({})
//       .find({'user._id': ObjectId(this._id)})
//       .toArray()
//       .then((orders) => {
//         console.log(orders, 'TITLE');
//         return orders;
//         // return orders.map((order) => {
//         //   return order.products.map((p) => {
//         //     return {
//         //       ...p,
//         //       quantity: this.cart.products.find((prod) => {
//         //         return prod.productId.toString() === p._id.toString();
//         //       }).quantity,
//         //       title: this.cart.products.find((prod) => {
//         //         return prod.productId.toString() === p._id.toString();
//         //       }).title,
//         //     };
//         //   });
//         // });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   addToCart(product) {
//     //código do professor. Bem superior ao nosso. (o nosso era o de cima).

//     // let updatedCart; ///depois, esse código se tornou MINHA VERSÃO DE 'add a product to the cart/products array in cart', que diferenciava entre os cases de 'ADD AN ENTIRELY NEW PRODUCT' e 'ADD ANOTHER unit of an already existing product' (aumento do field 'quantity' em 1 product que já existe dentro de 'products', no 'cart', em 'user'....)
//     // console.log(this.cart, 'LINE');
//     // console.log(product);

//     // if (!this.cart) { ///alteração para evitar erro de 'cannot read property products of undefined', mais abaixo...
//     //     console.log('CASE1')  ////é o case em que NÃO TÍNHAMOS NENHUM PRODUCT AINDA NO NOSSO CART...
//     //   updatedCart = {
//     //     products: [
//     //       {
//     //         // ...product,

//     //         quantity: 1,
//     //         productId: product._id
//     //       },
//     //     ],
//     //   };

//     // } else {
//     //   console.log('CASE2'); ///case em que JÁ TÍNHAMOS PRODUCTS NO NOSSO CART...

//     // const existingProductIndex = this.cart.products.findIndex(
//     //   (prod) => {  console.log(prod, 'LINE561');
//     //               console.log(product._id.toString(), prod.productId.toString())
//     //     return product._id.toString() === prod.productId.toString();
//     //   }
//     // )

//     //   console.log(existingProductIndex, 'EXAMPLE');

//     //   if (existingProductIndex === -1) {

//     //       console.log(this.cart.products[existingProductIndex], 'EXAMPLE2');

//     //       const oldProducts = this.cart.products.map(
//     //           (p) => {
//     //                 return  {
//     //                   productId: p.productId,
//     //                    quantity: p.quantity

//     //                   }
//     //           }
//     //         )

//     //         console.log(oldProducts, 'OLDPRODUCTS');

//     //     updatedCart = {
//     //       products: [
//     //         // ...this.cart.products,
//     //         ...oldProducts,
//     //         {
//     //           // ...product,
//     //           productId: product._id,
//     //           quantity:  1,
//     //         },
//     //       ],
//     //     };
//     //   } else {

//     //     const oldProducts = this.cart.products.map(

//     //       (product) => {
//     //         console.log(product.productId, 'TESTTT');
//     //             return  {
//     //                quantity: product.quantity,
//     //               productId: product.productId
//     //               }
//     //       }
//     //     )

//     //     updatedCart = {
//     //       products: [
//     //         ...oldProducts
//     //         // {
//     //         //   ...product,
//     //         //   quantity: this.cart.products[existingProductIndex].quantity + 1
//     //         // },
//     //       ]
//     //     };
//     //     updatedCart.products[existingProductIndex].quantity = this.cart.products[existingProductIndex].quantity + 1;
//     //   }
//     // }

    // //VERSÃO DO PROFESSOR... BEM MAIS SUCINTA DO QUE A NOSSA... (ver aula 'Armazenando múltiplos products no nosso cart'..)
    // //é mais optimizada do que a nossa..... menos código.
    // console.log(product, 'THIS');

    // const cartProductIndex = this.cart.products.findIndex((prod) => {
    //   return product._id.toString() === prod.productId.toString();
    // });

    // let newQuantity = 1;

    // const updatedCartItems = [...this.cart.products];

    // if (cartProductIndex >= 0) {
    //   newQuantity = this.cart.products[cartProductIndex].quantity + 1;
    //   updatedCartItems[cartProductIndex].quantity = newQuantity;
    // } else {
    //   updatedCartItems.push({
    //     productId: ObjectId(product._id),
    //     quantity: newQuantity,
    //   }); //////EIS O CÓDIGO EM QUESTÃO.
    // }

    // const updatedCart = {
    //   products: updatedCartItems,
    // };

    // const db = getDb();

    // return db
    //   .collection('users')
    //   .updateOne(
    //     { _id: ObjectId(this._id) },

    //     {
    //       ///é o 'update object', que vai updatar esse objeto 'user' específico, especificamente seu field/objeto 'cart'....

    //       $set: {
    //         cart: updatedCart,
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log('ADDED PRODUCT TO CART!');
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
//   }

//   addOrder() {
//     const db = getDb();

//     // const productIds = this.cart.products.map((product) => {
//     //   return product.productId;
//     // });

//     // return db
//     //   .collection('products')
//     //   .find({ _id: { $in: productIds } })
//     //   .toArray()
//     //   .then((products) => {
//     //     return products.map((p) => {
//     //       return {
//     //         ...p,
//     //         quantity: this.cart.products.find((prod) => {
//     //           return prod.productId.toString() === p._id.toString();
//     //         }).quantity,
//     //       };
//     //     });
//     //   })

//    return this.getCart() ///é o mesmo código usado logo acima, mas BEM MAIS ENXUTO, POIS REUTILIZA A LÓGICA DE 'getCart()'...
//       .then((products) => {
//         const prices = products.map((product) => {
//           return product.price * product.quantity;
//         });

//         const totalPrice = prices.reduce(
//           (total, currentValue) => {
//             return total + currentValue;
//           },

//           0
//         );

//         const formattedOrder = {
//           products: products,
//           totalPrice: totalPrice,
//           user: {
//             _id: ObjectId(this._id),
//             name: this.name,
//             email: this.email
//           }
//         };

//         // formattedOrder.products = products;

//         return db
//           .collection('orders')
//           .insertOne(formattedOrder) ///criará 1 order na nossa collection de 'orders' na database NOSQL...
//           .then((result) => {
//             console.log(result);

//             this.cart = { products: [] }; ///limpa o cart LOCALMENTE (no objeto 'req.user')

//             return db
//               .collection('users')
//               .updateOne(
//                 { _id: ObjectId(this._id) },
//                 { $set: { cart: { products: [] } } }  ///limpa o cart NA NOSSA DATABASE, na propriedade/array de 'products', na database de 'carts'....
//               )
//               .then((result) => {
//                 console.log(result);
//               })
//               .catch((err) => {
//                 console.log(err);
//               });
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     //   const order = {
//     //     ...this.cart
//     //   }

//     //   console.log(order, 'ORDERLINE');

//     //   console.log(this.cart.products, 'CARTPRODUCTS')

//     //   const completeCartProducts = this.cart.products.map(
//     //     (p) => {
//     //       return {
//     //         ...p,
//     //         quantity: this.cart.products.find((prod) => {
//     //           return prod.productId.toString() === p._id.toString();
//     //         }).quantity,
//     //         title: this.cart.products.find((prod) => {
//     //           return prod.productId.toString() === p._id.toString();
//     //         }).title
//     //       };
//     //     }
//     //   );

//     // order.products = completeCartProducts;
//   }

//   static findUserById(userId) {
//     const db = getDb();

//     // console.log(ObjectId(userId));
//     return db
//       .collection('users')
//       .findOne({
//         _id: ObjectId(userId),
//       })
//       .then((user) => {
//         console.log(user.cart);
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
