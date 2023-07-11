// const mysql = require('mysql2');

// const pool = mysql.createPool( 
//     {
//         host: 'localhost',
//         database: 'node-complete-course', 
//         user: 'root', 
//         password: 'K4tsuhir00ht0m0' 
//     }
// );


// module.exports = pool.promise(); 



const Sequelize = require('sequelize'); ///ESTAS 2 LINHAS (o sequelize em si) VAI RODAR __ IMPLICITAMENTE (por trás das cenas) AQUELAS LINHAS DE CÓDIGO QUE VEMOS LOGO ACIMA... (vai settar AUTOMATICAMENTE UMA CONNECTION POOL à NOSSA DATABASE SQL....)


const sequelize = new Sequelize('node-complete-course', 'root', 'K4tsuhir00ht0m0', {

    dialect: 'mysql',
    host: 'localhost'

});


module.exports = sequelize; ///lembre-se de sempre exportar o seu objeto 'sequelize'...