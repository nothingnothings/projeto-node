// // const Sequelize = require('sequelize'); ////OBTIDO POR MEIO DE 'npm install --save sequelize', pacote que TAM´BEM REQUER UM INSTALL PRÉVIO DE 'npm install --save mysql2'...

// const { Sequelize } = require('sequelize');

// const sequelize = require('../util/database'); ///definimos isso lá no folder 'util', no arquivo 'database.js', em que EXPORTAMOS esse 'sequelize' configurado...

// const Product = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },

//   title: Sequelize.STRING, ////shorthand do DEFINE visto logo acima... (com esse shorthand, definimos apenas o TYPE daquele field, sem definir mais nada acerca das características que esse field deve ter....)

//   price: {
//     type: Sequelize.DOUBLE, ///CASAS DECIMAIS... considera '0.99', etc...
//     allowNull: false, ////_IMPOSSIBILITA O WRITE DE VALORES NULOS.... produto sempre deverá custar alguma coias....
//   },

//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// module.exports = Product;

////código que usa uma database NOSQL....

// const mongoConnect = require('../util/database'); //NÃO IMPORTE 'mongoConnect()', pq essa função deve ser usada __ NO 'app.js', COMO __ STARTER__ DE SEU APLICATIVO NODE... não é para ser usado no meio dos seus módulos/models/controllers, como fazemos com 'getDb()'...





const mongoose = require('mongoose');


const Schema = mongoose.Schema;



const productSchema = new Schema(
  {         ////é isso aqui que vai definir a ESTRUTURA/SCHEMA DE CADA DOCUMENTO 'product', no caso...


    // title: String ///STRING É UM OBJETO DEFAULT JAVASCRIPT, que pode ser usado aqui para definir o TIPO DE DATA QUE PODERÁ SER ENFIADO NESSE FIELD DE 'title'...
  /// ^^^^^essa é a versão SIMPLES de definir fields/propriedades no seu objeto/model/document.... já esse código aqui de baixo é como DEFINIR COISAS MAIS ESPECIFICAS DESSE FIELD, como se ele é 'required' ou não, além de seu TYPE e outras configs...


    title: {

      required: true,
      type: String
    },

    price: {
      required: true,
      type: Number
    },


    description: {
      required: true,
      type: String
    },

    imageUrl: {
      required: true,
      type: String
    },

    userId: { ////// USADO PARA DEFINIR RELATION ENTRE os models/collection de 'User' e 'Product', por meio desse ID aí (relations por meio de REFERENCING...).
      required: true, 
      type: Schema.Types.ObjectId, /////// use isto, esse DATA TYPE, se você pretende fazer REFERENCING entre duas collections/models....
      ref: 'User'  /////// AQUI VOCê DEVE ESPECIFICAR O __ NOME __ DA DATABASE/COLLECTION que você vai querer __CONECTAR/RELATE a essa database/model de 'product'... (você deve colocar a inicial maiúscula, EXATAMENTE COMO VOCÊ definiu o nome dessa collection/model, lá em 'user.js', nesse caso...)
    } ////'ref' é o LOCAL/propriedade em 1 field QUE DIZEMOS QUE VAMOS QUERER 'relate' ESTE NOSSO MODEL (producT) A ESSE MODEL AÍ (no caso, 'user'...)
  }
)





module.exports = mongoose.model('Product', productSchema); ////ESSE É O CÓDIGO QUE EXPORTA/DEFINE NOSSO 'model' A PARTIR __ DO SCHEMA __ que definimos logo acima... --> É ESTE CÓDIGO QUE VAI __CONECTAR__ NOSSO 'SCHEMA' A UM 'NAME'..... (que, nesse caso, será 'Product'...)




























////CÓDIGO QUE USAVA/USA O 'NORMAL MONGODB DRIVER'... (e não o MONGOOSE, QUE VAMOS APRENDER DURANTE ESSE MÓDULO)....
// const getDb = require('../util/database').getDb; ///SINTAXE DE IMPORTS UM POUCO MAIS REBUSCADA....

// const ObjectId = require('mongodb').ObjectId;



// class Product {
//   constructor(title, price, imageUrl, description, userId, id) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.userId = ObjectId(userId);
//     this._id = id;
 
//   }

//   save() { ///vai EDITAR ou ADICIONAR UM PRODUCT, a depender do 'truthy'/'falsy' de 'this._id' ( ou seja, a presença ou inexistência dessa propriedade dentro do objeto 'Product' que é instanciado por meio de 'new Product'...)
//    const db = getDb();

//    let dbOp;




//   //  const identifiedProduct = { ///CÓDIGO QUE CRIA FORÇADAMENTE UM 'id' dentro de um objeto 'product'... --> é desnecessário, pois o MONGODB já cria um ID PARA NÓS, o field de '_id' em cada document...

//   //   ...this, 
//   //   id: Math.random() * Math.random()
//   //  }




// if (this._id) {
//         ///runs the code that UPDATES a product that ALREADY EXISTS on the database...

          
//    const updateDocument = {

//     $set: {
//       title: this.title,
//       price: this.price,
//       imageUrl: this.imageUrl, 
//       description: this.description
//      } }

//         dbOp = db.collection('products').updateOne({_id: ObjectId(this._id)}, updateDocument);

// } else { 
// //  .insertOne(this)
//   // .insertOne(identifiedProduct)
//   //RUNS THE CODE THAT ADDS A PRODUCT THAT DIDNT EXIST IN THE DATABASE YET...
//   dbOp =  db.collection('products').insertOne(this) //vai se referir a PRODUCT... este mesmo product do constructor 'Product'....



// }


// return dbOp  ///será executado DE QUALQUER JEITO, basicamente...
//       .then(
//       (result) => {
//         console.log(result);
//       }
//    )
//    .catch(
//      (err) => {
//        console.log(err);
//      }
//    );
//   }










// static getMultipleProducts(productIds) {

//   const db = getDb();




//   // const formattedProductIds = [
//   //   ...productIds
//   // ]

//   // console.log(formattedProductIds, 'xx');

//  return db.collection('products').find({_id: {$in: productIds } }).toArray() //código para encontrar MÚLTIPLS PRODUCTS, por meio de MÚLTIPLOS IDS....
//  .then(
//    (products) => {
//      console.log(products);

 


//      return products;
//    }
//  )
//  .catch(
//    (err) => {
//      console.log(err);
//    }
//  )
// }



//   static getSingleProduct(productId) {


//     const db = getDb();


//     // const parsedId = +id;



//     // return db.collection('products').findOne({_id: id}).next()   ///VERSÃO __DO PROFESSOR__ DO CÓDIGO (utiliza '.find()' com um critério, em vez de 'findOne', e utiliza '.next()' sobre o call de 'find()' para CONSEGUIR __ EVITAR A PRODUÇÃO DE UM CURSOR E FORÇAR O GET DE APENAS 1 PRODUCT, O 'LAST PRODUCT THAT WAS FETCHED', que nesse caso é justamente O PRIMEIRO E ÚNICO 'product' cujo id satisfez o critério '_id' no parâmetro de 'find({})'...)
//     // .then(
//     //   (product) => {
 
//     //    console.log(product, 'LINE2');
//     //    return product;
//     //   }
//     // )
//     // .catch(
//     //   (err) => {
 
//     //    console.log(err);
//     //   }
//     // )
    
//     // console.log(productId, 'LINE5');
//     // const test = ObjectId(productId);

    
//    return db.collection('products').findOne({_id: productId})  ///minha versão do código.
//    .then(
//      (product) => {

//       console.log(product, 'LINE2');
//       return product;
//      }
//    )
//    .catch(
//      (err) => {

//       console.log(err);
//      }
//    )

//   }




// // static editProduct(productId, title, price, imageUrl, description) { ////É MEU CÓDIGO DE 'EDIT A PRODUCT'.... É MEIO SUBÓPTIMO, DEVO USAR A VERSÃO DO PROFESSOR, que é um CASE ESPECIAL DENTRO DE 'save()' --> método save(), nesse caso, serve tanto para EDITAR quanto para ADICIONAR products, a depender do status truthy/falsy de 'this._id'...



// //   const db = getDb();



// //   const updateDocument = {

// //     $set: {
// //       title: title,
// //       price: price,
// //       imageUrl: imageUrl, 
// //       description: description
// //     }

// //   }



// //  return db.collection('products').updateOne({_id: ObjectId(productId)}, updateDocument)
// //  .then(
// //    (result) => {

// //     console.log(result);
// //    }
// //  )
// //  .catch(
// //    (err) => {
// //         console.log(err);
// //    }
// //  )
// // }



  
//   static deleteProduct(productId) {


//     const db = getDb();




//    return db.collection('products').deleteOne({"_id": ObjectId(productId) })
//     .then(
//       (result) => {
//         console.log(result, 'LINE');
//       }
//     )
//     .catch(
//       (err) => {
//         console.log(err);
//       }
//     )


//   }


//   static getProducts() {


//     const db = getDb();


//      return db.collection('products').find().toArray()
//      .then(   
//       (products) => {

//                   console.log(products);
//                   return products;
            
   

          
//                   ///LEIA ESTA EXPLICAÇÃO SOBRE 'find()' e 'toArray()':

//                   //////// OK.... AÍ É CLARO QUE QUEREMOS ENCONTRAR TODOS OS PRODUCTS....

//           //   -> por isso não vamos passar nenhum 

//           //   parâmetro...


//           // -->A COISA CURIOSA SOBRE O 'find',

//           // E A FONTE 

//           // DE MEUS ERROS, É QUE ___ O   'FIND ' __NÃO RETORNA IMEDIATAMENTE UMA PROMISE....---> 

//           // EM VEZ DISSO, a COISA QUE  'find()"  RETORNA 
         
//           // É 

//           // AQUILO QUE 

//           // CHAMAMOS 

//           // DE 

//           // 'cursor',

//           // UM
//           // ___CURSOR___... ----> UM CURSOR É UM OBJECT__ 

//           // _______ PROVIDENCIADO __ PELO 'MONGODB'


//           // QUE NOS  __ PERMITE 

//           // 'GO THROUGH OUR ELEMENTS/documents'

//           // _______sTEP BY __ STEP__...  ---->  

//           // vamos 
//           // por entre nossos 

//           // documents 

//           // 'etapa por etapa'... ---------> ISSO 


//           // PQ, TEORICAMENTE,


//           // _'find()'


//           // PODERIA ___ RETORNAR 



//           // MILHÕES DE DOCUMENTS,


//           // E VOCÊ 

//           // __NÃO VAI QUERER __ 


//           // FAZER TRANSFER DE __TODOS ELES_ _ 


//           // AO LONGO DO 'FIO' 


//           // _ TUDO DE UMA VEZ.... -----> É POR ISSO QUE 

//           // O 'FIND' NOS DÁ UM 'HANDLE', handle COM O QUAL PODEMOS   DIZER AO   MONGODB 'OK,

//           // ME DÊ O PRÓXIMO DOCUMENT... OK, ME DÊ O PRÓXIMO DOCUMENT,

//           // OK ME DÊ O PRÓXIMO DOCUMENT''',

//           // várias e várias vezes... --------> 

//           // ISSO INÚMERAS VEZES... --->  AINDA ASSIM,

//           // PROFESSOR DIZ QUE 

//           // __ HÁ UM MÉTODO QUE FAZ 'OVERRIDE' DESSA NECESSIDADE DO HANDLE,


//           // e 

//           // que 

//           // __ TE DEIXA__ PEGAR TODOS ___OS 

//           // 'documents' 

//           // em 

//           // 1 collection MESMO ASSIM.... --> 

//           // O 

//           // MÉTODO 

//           // QUE ELE ESTÁ MENCIONANDO É 

//           // '.toArray()'... -->  _____ESSE MÉTODO FAZ COM QUE TODOS OS DOCUMENTS NAQUELA 

//           // COLLECTION __ SEJAM__ TRANSFORMADOS__ EM UM 

//           // JAVASCRIPT ARRAY....


//           // É POR ISSO QUE NOSSO CÓDIGO FICA ASSIM:

//           // static fetchAll() {

//           //     return db.collection('products').find().toArray();
//           // }


//           // --> MAS É CLARO QUE VOCê __ SÓ DEVE USAR__ ESSE METHOD AÍ,

//           // o  'toArray()',  ______ SE VOCê __ SABE, TEM CERTEZA,


//           // QUE ___ VOCÊ  ESTARÁ TRABALHANDO COM 

//           // APENAS  UMAS DÚZIAS, TALVEZ 100 DOCUMENTS... 

//           //E SE UTILIZAMOS ESSE APPROACH DO '.toArray()' com o 'find()', REALMENTE VAMOS CONSEGUIR UMA PROMISE COMUM, e é por isso que podmeos executar 'then' e 'catch' sobre ele ,aqui...
//       }
//      )
//      .catch(
//        (err) => {
//          console.log(err);
//        }
//      )


//   }





// }

// module.exports = Product;
