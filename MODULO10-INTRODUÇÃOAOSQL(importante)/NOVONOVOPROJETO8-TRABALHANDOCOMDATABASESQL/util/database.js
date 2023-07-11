const mysql = require('mysql2');





const pool = mysql.createPool( ////sempre use 'createPool', e nunca 'createConnection()' (pq createConnection VAI CRIAR APENAS 1 CONNECTION PARA 1 QUERY, INDIVIDUAL, ENQUANTO 'createPool' VAI CRIAR UMA POOL QUE MANAGEARÁ MÚLTIPLAS QUERIES, em múltiplas connections...)
    { ////nesse objeto config parâmetro, colocamos INFORMAÇÕES ACERCA DA DATABASE ENGINE (o host) QUE ESTAMOS USANDO...
        host: 'localhost',
        database: 'node-complete-course', ///necessário. (especifica QUAL 'DATABASE SERVER' ('schema', em outras palavras) dentro de nossa DATABASE GERAL __QUEREMOS __ TARGETTAR COM OS REQUESTS FEITOS A PARTIR DESSE OBJETO 'pool'...)
        user: 'root', ///necessário
        password: 'K4tsuhir00ht0m0' //necessário
    }
);




module.exports = pool.promise(); //sempre exporte sua 'POOL/DATABASE' assim... --> vocÊ precisa exportar assim para QUE VOCÊ CONSIGA __ TRABALHAR COM DATABASES __ USANDO __ promises (.then() e .catch() blocks..)