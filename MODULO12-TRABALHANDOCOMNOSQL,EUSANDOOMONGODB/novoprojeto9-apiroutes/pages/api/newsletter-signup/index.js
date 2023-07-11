// import { MongoClient } from 'mongodb'; ///REFRESHER DE COMO USAR 'mongodb' EM UM __ APLICATIVO COM JAVASCRIPT... nesse caso, em um app COM ___NEXTJS___, que executa client e serverside code ao mesmo tempo...

// const handler = (req, res) => { /////essa versão do meu código funciona certinho, a única coisa que não funciona é o error handling (essa é a razão de eu ter usado a versão 'async/await' do professor no write do código de comunicaação com o mongodb...)
//   if (req.method === 'POST') {
//     const email = req.body;
//     console.log(email);

//     if (!email || !email.includes('@')) {
//       res.status(422).json({ message: 'Invalid email address.' });
//       return;
//     }

//     /////eis aqui como usar o MONGODB/SE COMUNICAR COM O MONGODB PARA REALIZAR FETCH/POST de dados, na sua database... (lembre-se de sempre instalar a package de 'npm install mongodb'...)
//     ////obs: o primeiro parâmetro sempre será a 'url'/'endpoint' do CLUSTER MONGODB que você vai querer objetivar (com o username e password enfiados nos campos, é claro)....
//     ///formato sem edits: mongodb+srv://<username>:<password>@cluster0.nhtjo.mongodb.net/<dbname>?retryWrites=true&w=majority
//     ///'''<dbname>''' --> coloque aqui o NOME dessa DATABASE ESPECÍFIICA (dentro do cluster) que você vai querer criar (o mongodb cria automaticamente databases com os nomes que você coloca nesse campo...)

//     MongoClient.connect(
//       'mongodb+srv://madblorga:papanacuas@cluster0.nhtjo.mongodb.net/newsletter?retryWrites=true&w=majority'
//     )
//     .then((client, err) => {  ///'''1a operação''' --> connecta nosso app AO MONGODB...

//       const db = client.db();

//       return db.collection('emails').insertOne({ email: email }) ///''''2a operação '''' --> INSERE 1 ITEM na collection dentro do cluster do mongodb...
//       .catch(
//         (err) => {
//           console.log(err);
//           res.status(500).json({message: 'Inserting data failed.'})
//           return;
//         }
//       )

//       .then((res) => {
//         client.close();
//         return res.status(201).json({
//           message: 'Success!',
//         });

//         })

//     });

//   } else {
//     return;
//   }
// };

// export default handler;





///////VERSÃO DO PROFESSOR DE 'COMUNICAÇÃO COM O MONGODB' (tbm de ERROR HANDLING do mongodb...)


import { connectDatabase } from '../../../helpers/db-util'; //funções outsourceadas a esse arquivo de 'db-util' (mesma lógica em ambas as api routes, lógica de 'connect' e 'insert'... reutilizada...)


import { insertDocument } from '../../../helpers/db-util';


// const connectDatabase = async () => {  
//   const client = await MongoClient.connect(
//     'mongodb+srv://madblorga:papanacuas@cluster0.nhtjo.mongodb.net/newsletter?retryWrites=true&w=majority'
//   );

//   return client;
// };

// const insertDocument = async (client, document) => {
//   const db = client.db();

//   await db.collection('newsletter').insertOne(document);
// };

const handler = async (req, res) => {
  /////essa versão do meu código funciona certinho, a única coisa que não funciona é o error handling (essa é a razão de eu ter usado a versão 'async/await' do professor no write do código de comunicaação com o mongodb...)
  if (req.method === 'POST') {
    const email = req.body;



    // let client;


    const url = 'mongodb+srv://madblorga:papanacuas@cluster0.nhtjo.mongodb.net/newsletter?retryWrites=true&w=majority'

    if (!email || !email.includes('@')) {
      res.status(422).json({ message: 'Invalid email address.' });
      return;
    }

    let client;


    try {
    client = await connectDatabase(url);
    } catch (error) {
      // console.log(client);
      // console.log(error);
      console.log('error - Connection to the database failed');
      res.status(500).json({ message: 'Connection to the database failed' });
      return;
    }

    try {
      await insertDocument(client, { email: email }, 'newsletter');
      client.close();
    } catch (error) {
      res.status(500).json({ message: 'Failed to insert item' });
      return;
    }

    return res.status(201).json({
      message: 'Success, signed up!',
    });
  } else {
    return;
  }
};

export default handler;
