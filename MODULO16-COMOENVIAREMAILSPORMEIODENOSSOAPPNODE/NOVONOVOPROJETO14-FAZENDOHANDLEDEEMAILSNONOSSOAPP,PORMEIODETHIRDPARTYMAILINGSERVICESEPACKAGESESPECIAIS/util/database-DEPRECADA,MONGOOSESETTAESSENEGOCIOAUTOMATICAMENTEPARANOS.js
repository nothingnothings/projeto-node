// // const mysql = require('mysql2'); ///códigos usados com o SEQUELIZE../////////////////////

// // const pool = mysql.createPool(
// //     {
// //         host: 'localhost',
// //         database: 'node-complete-course',
// //         user: 'root',
// //         password: 'K4tsuhir00ht0m0'
// //     }
// // );

// // module.exports = pool.promise();

// const { Sequelize } = require('sequelize'); ///ESTAS 2 LINHAS (o sequelize em si) VAI RODAR __ IMPLICITAMENTE (por trás das cenas) AQUELAS LINHAS DE CÓDIGO QUE VEMOS LOGO ACIMA... (vai settar AUTOMATICAMENTE UMA CONNECTION POOL à NOSSA DATABASE SQL....)

// // const Sequelize = require('sequelize'); ///ESTAS 2 LINHAS (o sequelize em si) VAI RODAR __ IMPLICITAMENTE (por trás das cenas) AQUELAS LINHAS DE CÓDIGO QUE VEMOS LOGO ACIMA... (vai settar AUTOMATICAMENTE UMA CONNECTION POOL à NOSSA DATABASE SQL....)

// const sequelize = new Sequelize('node-complete-course', 'root', 'K4tsuhir00ht0m0', {

//     dialect: 'mysql',
//     host: 'localhost'

// });

// module.exports = sequelize; ///lembre-se de sempre exportar o seu objeto 'sequelize'...

////////////////////////////////////////////////////////////////

// import { MongoClient } from "mongodb";   ///SINTAXE ES6 (não sei se funciona 100% com o node/express)...

// export const connectDatabase = async (url) => {
//   const client = await MongoClient.connect(url);
//   return client;
// };

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// export const connectDatabase = async (url) => {
//   const client = await MongoClient.connect(url);
//   return client;
// };

let _db; //// o '_' significa que essa variável SÓ VAI SER USADA NESSE MESMO ARQUIVO 'database.js', INTERNAMENTE, e em nenhum outro lugar....

const mongoConnect = callback => {
  url =
    'mongodb+srv://madblorga:T5lws5TGxtclEbKI@cluster0.nhtjo.mongodb.net/shop?retryWrites=true&w=majority';

  MongoClient.connect(url)
    .then(
      //   (result) => {

      (client) => {
        // callback(client); não faça assim...
        _db = client.db(); //faça assim. --> se você escrever 'client.db()' com o parâmetro em BRANCO, você vai se conectar à database de 'shop' no SEU CLUSTER, pq é ISSO QUE ESPECIFICAMOS NA NOSSA URL....
       callback(); ///isto também é necessário.
      }
      // console.log('Connected');
    )
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  } else {
    throw 'No database found!';
  }
};

// module.exports = mongoConnect;

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
