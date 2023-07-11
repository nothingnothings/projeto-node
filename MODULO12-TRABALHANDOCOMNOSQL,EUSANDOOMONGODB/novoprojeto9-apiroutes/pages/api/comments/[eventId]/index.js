// import { MongoClient } from 'mongodb';

// const handler = (req, res) => { ///ESTA É A MINHA VERSÃO DO CÓDIGO. A VERSÃO DE BAIXO É A VERSÃO DO PROFESSOR, QUE INCORPOROU ERROR HANDLING... (mais fácil, com async/await...)
//   const eventId = req.query.eventId;
//   console.log(eventId);

//   if (req.method === 'POST') {
//     const commentData = req.body;
//     // console.log(commentData);

//     const comment = {
//       ...commentData,
//       eventId: eventId,
//     };

//     if (
//       !commentData.email ||
//       !commentData.name ||
//       !commentData.text ||
//       commentData.name.trim() === '' ||
//       commentData.text.trim() === '' ||
//       commentData.email.trim() === ''
//     ) {
//       res
//         .status(422)
//         .json({ message: 'Invalid comment, please input valid information' });
//       return;
//     }

//     // console.log(commentData.email, commentData.name, commentData.text);

//     MongoClient.connect(
//       'mongodb+srv://madblorga:papanacuas@cluster0.nhtjo.mongodb.net/comments?retryWrites=true&w=majority'
//     ).then((client, err) => {
//       const db = client.db();

//       return db
//         .collection('comments')
//         .insertOne(comment)
//         .then(() => {
//           client.close();
//         });
//     });
//     res.status(201).json({
//       message: 'Success, added comment!',
//       comment: commentData,
//     });
//   }

//   if (req.method === 'GET') {
//     console.log(eventId);

//     // const dummyList = [
//     //   { id: 'c1', name: 'Max', text: 'A first comment' },
//     //   { id: 'c2', name: 'Manuel', text: 'A second comment' },
//     // ];

//     const actualList = [];

//     MongoClient.connect(
//       'mongodb+srv://madblorga:papanacuas@cluster0.nhtjo.mongodb.net/comments?retryWrites=true&w=majority'
//     ).then((client, err) => {
//       const db = client.db();

//       return db
//         .collection('comments')
//         .find({ eventId: eventId })
//         .sort({_id: -1}) ///isso vai 'SORT' os objetos 'comment' RETRIEVADOS DE NOSSO SERVERSIDE, de forma 'DESCENDING ORDER' (ou seja, os posts mais RECENTES EM CIMA...)
//         .forEach((item) => {
//           console.log(item);

//           return actualList.push(item);
//         })
//         .then((data) => {
//           res.status(200).json({
//             message: 'Success!',

//             // list: dummyList
//             list: actualList,
//           });
//           console.log(actualList);
//           client.close();
//         });
//     });
//   }
// };

// export default handler;

// import { MongoClient } from 'mongodb';

import { connectDatabase } from '../../../../helpers/db-util';

import { insertDocument } from '../../../../helpers/db-util';

// const connectDatabase = async () => { ///////////função outsourceada a 'db-util.js', no folder de 'helpers'....
//  client = await MongoClient.connect(
//     'mongodb+srv://madblorga:papanacuas@cluster0.nhtjo.mongodb.net/comments?retryWrites=true&w=majority'
//   );

//   return client;
// }

const handler = async (req, res) => {
  const eventId = req.query.eventId;
  console.log(eventId);

  let client;

  try {
    client = await connectDatabase(
      'mongodb+srv://madblorga:papanacuas@cluster0.nhtjo.mongodb.net/comments?retryWrites=true&w=majority'
    );
  } catch (error) {
    console.log('error - Connection to the database failed');
    res.status(500).json({ message: 'Connection to the database failed' });
    return;
  }

  if (req.method === 'POST') {
    const commentData = req.body;
    // console.log(commentData);

    const comment = {
      ...commentData,
      eventId: eventId,
    };

    if (
      !commentData.email ||
      !commentData.name ||
      !commentData.text ||
      commentData.name.trim() === '' ||
      commentData.text.trim() === '' ||
      commentData.email.trim() === ''
    ) {
      res
        .status(422)
        .json({ message: 'Invalid comment, please input valid information' });
      return;
    }

    try {
      await insertDocument(client, commentData, 'comments');
      client.close();
    } catch (error) {
      res.status(500).json({ message: 'Failed to insert comment' });
      return;
    }
    res.status(201).json({
      message: 'Success, added comment!',
      comment: comment,
    });
  }

  if (req.method === 'GET') {
    console.log(eventId);

    // const dummyList = [
    //   { id: 'c1', name: 'Max', text: 'A first comment' },
    //   { id: 'c2', name: 'Manuel', text: 'A second comment' },
    // ];

    const actualList = [];

    try {
      const db = client.db();
      await db
        .collection('comments')
        .find({ eventId: eventId })
        .sort({ _id: -1 }) ///isso vai 'SORT' os objetos 'comment' RETRIEVADOS DE NOSSO SERVERSIDE, de forma 'DESCENDING ORDER' (ou seja, os posts mais RECENTES EM CIMA...)
        .forEach((item) => {
          console.log(item, 'LINE');
          return actualList.push(item);
        });
    } catch (error) {
      console.log('Error - could not retrieve comments');
      res.status(500).json({ message: 'Could not retrieve comments' });
      return;
    }
    res.status(200).json({
      message: 'Success, comments retrieved!',
      list: actualList,
    });
    console.log(actualList);
  }

  client.close(); ///vai FECHAR NOSSA CONEXÃO COM O CLIENT DO MONGODB, independentemente se
  /////prosseguimos para o 'get' ou 'post' blocks...
};

export default handler;
