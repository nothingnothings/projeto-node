const Post = require('../models/post');

const { validationResult } = require('express-validator');

const fs = require('fs');

const ObjectId = require('mongodb').ObjectId;

const User = require('../models/user');



const io = require('../socket'); ///objeto 'io' possui os métodos '.init()' (usado lá em 'app.js', starter do seu server) e 'getIo()' (usado aqui, PARA REALIZAR OPERAÇÕES COM A CONEXÃO WEBSOCKET do seu app)....
//ver código de 'createPost' para ver interação com websockets....
const ITEMS_PER_PAGE = 5;

// exports.getPosts = (req, res, next) => { código com promises (then e catch blocks)...
//   //código com pagination...
//   const pageNumber = req.query.page || 1;

//   const userId = ObjectId(req.userId); ///userId extraído de nossa token e armazenado no objeto request do user... tudo graças ao middleware de 'isAuth', lá no folder de 'middlewareHelpers'...

//   console.log(userId);
//   console.log(pageNumber);

//   let totalItems;

//   Post.countDocuments({ creator: { userId: userId } })
//     .then((numPosts) => {
//       totalItems = numPosts; ////isso vai nos dar o NÚMERO TOTAL DE POSTS, que será usado mais abaixo...

//       // return Post.find({}) ///vai nos dar TODOS OS POSTS de nossa database...
//       return Post.find({ creator: { userId: userId } }) ////vai nos dar APENAS os posts VINCULADOS A ESSE NOSSO USER...
//         .skip(
//           (pageNumber - 1) * ITEMS_PER_PAGE ///lógica para fazer nossos items aparecerem -->  /////vai ser o NÚMERO DA PÁGINA - 1, VEZES O NÚMERO DE ITEMS QUE DESEJAMOS POR PAGE.... --> essa será a QUANTIDADE DE ITEMS QUE VAMOS QUERER SKIPPAR, ignorar, ao renderizar os products em 1 given page... (10 products por page, é isso que configuramos em 'ITEMS_PER_PAGE')...
//         ) ///método que só pode ser chamado em cima de CURSORS (como esse aí, retrievado por 'find()') ---> O método 'skip()' VAI SEMPRE _ SKIPPAR __ O NÚMERO QUE VOCÊ PASSOU COMO PARÂMETRO (quantidade), DE ENTRIES NA SUA COLLECTION... (nesse caso, ele vai skippar TUDO MENOS os 2 items que desejamos, de forma dinâmica...)
//         .limit(ITEMS_PER_PAGE)
//         .then((posts) => {
//           if (!posts) {
//             res.status(404).json({
//               message:
//                 'No posts encountered on database, please try again later.',
//             });
//           }
//           // console.log(posts);
//           res.status(200).json({
//             posts: posts,
//             currentPage: +pageNumber,
//             totalItems: totalItems,
//           });
//         });
//     })
//     .catch((err) => {
//       if (!err.statusCode) {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//       }
//     });
// };










exports.getPosts = async (req, res, next) => { ////VERSÃO COM ASYNC AWAIT.... 
  //código com pagination...
  const pageNumber = req.query.page || 1;

  const userId = ObjectId(req.userId); ///userId extraído de nossa token e armazenado no objeto request do user... tudo graças ao middleware de 'isAuth', lá no folder de 'middlewareHelpers'...

  console.log(userId);
  console.log(pageNumber);

  // let totalItems;

    // Post.countDocuments({ creator: { userId: userId } })
    // .then((numPosts) => {
      
    try {
    // const countedDocuments = await Post.find().countDocuments({creator: {userId: userId}});


    const countedDocuments = await Post.find().countDocuments();
    // const countedDocuments = await Post.find().countDocuments().exec(); ///USE ESTA SINTAXE SE VOCÊ REALMENTE QUISER QUE O MÉTODO MONGOOSE USADO POR VOCÊ __ RETORNE__ UMA 'ACTUAL PROMISE', e não um 'PROMISE-LIKE OBJECT' (pq isso é o que os métodos mongoose fazem, por default, ELES __ RETORNAM UM 'PROMISE-LIKE OBJECT', em que você pode chamar 'async/await' e 'then-catch'...)






    console.log(countedDocuments);

      // totalItems = numPosts; ////isso vai nos dar o NÚMERO TOTAL DE POSTS, que será usado mais abaixo...
      // return Post.find({}) ///vai nos dar TODOS OS POSTS de nossa database...
    // const neededUserDocuments = await Post.find({creator: {userId: userId}}, null,
    //   {skip: (pageNumber - 1) * ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE}
    // )



    const neededUserDocuments = await Post.find({}, null,
      {skip: (pageNumber - 1) * ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE}
    ).populate(
      'creator.userId'
  ).sort({_id: -1})


    // const neededUserDocuments = await Post.find()  ///versão escrita pelo professor, ela faz a mesma coisa...
    // .skip((currentPage - 1) * ITEMS_PER_PAGE)
    // .limit(ITEMS_PER_PAGE);





    
    // The Model.find() function takes 3 arguments that help you initialize a query without chaining. The first argument is the query filter (also known as conditions). The 2nd argument is the query projection, which defines what fields to include or exclude from the query. For example, if you want to exclude the customer's email for privacy concerns, you can use either of the below syntaxes.
    // The 3rd argument to Model.find() is the general query options. Here's a full list of options (https://mongoosejs.com/docs/api.html#query_Query-setOptions). For example, you can set limit and skip in the 3rd argument.


    // console.log(neededUserDocuments[0].creator, 'LINE52');
  
    // const selectedUserDocuments = await allUserDocuments.skip((pageNumber - 1) * ITEMS_PER_PAGE);


    // const posts = await selectedUserDocuments.limit(ITEMS_PER_PAGE);

    if(!neededUserDocuments) {
      res.status(404).json(
        {
          message: 'No posts encountered on database, please try again later.'
        }
      )
    } else {





      res.status(200).json(
        {
          posts: neededUserDocuments,
          // posts: alteredNeededUserDocuments,
          currentPage: +pageNumber,
          totalItems: countedDocuments
        }
      )

    }



  } catch (err) {
    if (!err.statusCode) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  }

}

      // return Post.find({ creator: { userId: userId } }) ////vai nos dar APENAS os posts VINCULADOS A ESSE NOSSO USER...
      //   .skip(
      //     (pageNumber - 1) * ITEMS_PER_PAGE ///lógica para fazer nossos items aparecerem -->  /////vai ser o NÚMERO DA PÁGINA - 1, VEZES O NÚMERO DE ITEMS QUE DESEJAMOS POR PAGE.... --> essa será a QUANTIDADE DE ITEMS QUE VAMOS QUERER SKIPPAR, ignorar, ao renderizar os products em 1 given page... (10 products por page, é isso que configuramos em 'ITEMS_PER_PAGE')...
      //   ) ///método que só pode ser chamado em cima de CURSORS (como esse aí, retrievado por 'find()') ---> O método 'skip()' VAI SEMPRE _ SKIPPAR __ O NÚMERO QUE VOCÊ PASSOU COMO PARÂMETRO (quantidade), DE ENTRIES NA SUA COLLECTION... (nesse caso, ele vai skippar TUDO MENOS os 2 items que desejamos, de forma dinâmica...)
      //   .limit(ITEMS_PER_PAGE)
      //   .then((posts) => {
      //     if (!posts) {
      //       res.status(404).json({
      //         message:
      //           'No posts encountered on database, please try again later.',
      //       });
      //     }
      //     // console.log(posts);
      //     res.status(200).json({
      //       posts: posts,
      //       currentPage: +pageNumber,
      //       totalItems: totalItems,
      //     });
      //   });
    // })
    // .catch((err) => {

//     });
// };



























// exports.createPost = (req, res, next) => {  ///versão com PROMISES (then e catch)...


//   //CREATE POST IN DB...
//   const errors = validationResult(req); //EIS O CÓDIGO EM QUESTÃO.

//   if (!errors.isEmpty()) {
//     //é retornada esta response, se a validation do input FALHA... (na criação do post)...
//     console.log(errors);
//     const error = new Error('Validation failed, entered data is incorrect.');
//     error.statusCode = 422;
//     throw error; //vai fazer com que entremos NO MIDDLEWARE ESPECIAL DE ERROR HANDLING, LÁ EM 'app.js'...  (USE 'throw err' com códigos SYNC, e 'next(err)' com códigos ASYNC... )

//     // return res //throw manual de erro, pior do que o visto logo acima...
//     //   .status(422)
//     //   .json({ message: 'Validation failed, entered data is incorrect.', errors: errors.array()});
//   } else {
//     console.log(req.file);
//     console.log(req.files);

//     if (
//       !req.file ///se nossa image (image upload, extraído pelo multer) NÃO ESTIVER ANEXADA NO REQUEST...
//     ) {
//       const error = new Error('No image attached to request.');
//       error.statusCode = 422; ///se não for encontrada uma image no request, não deixa de ser um ERRO DE VALIDATION, por isso o '422' (invalid input)..
//       throw error;
//     }

//     const imageUrl = req.file.path; ////precisamos disso, vamos querer armazenar esses PATHS/imageUrls em cada 1 dos nossos documents, lá na database....

//     const title = req.body.title; ////obtido de nosso SEND DE JSON DATA, lá em 'fetch()'...
//     const content = req.body.content;

//     const userId = ObjectId(req.userId);

//     let creator;

//     console.log(title, content);

//     console.log(req.body);

//     console.log('REQUEST RECEIVED');

//     const post = new Post({
//       title: title,
//       content: content,
//       // imageUrl: 'DUMMY',
//       imageUrl: imageUrl.replace(/\\/g, '/'),
//       creator: {
//         userId: userId,
//       },
//       //não precisamos passar nem '_id' (settado automaticamente pelo mongoose, ao salvarmos doc no server), nem 'createdAt', nem 'updatedAt' (são criados automaticamente pelo parâmetro 'timestamps: true', lá no model de 'Post'...)
//     });

//     post
//       .save()
//       .then((result) => {
//         console.log(result);

//         const post = result;

//         return User.findOne({ _id: userId }) //use 'findOne', e não 'find()', pq você NÃO VAI QUERER RETORNAR 'an iterable cursor of results'...
//           .then((user) => {

//             creator = user;
//             return user.addPost(post);
//           });
//         // res.status(201).json({
//         //   message: 'Post created successfully',
//         //   post: result, ///vai conter info sobre o post que foi armazenado na nossa database...
//         // });
//       })
//       .then((result) => {
//         console.log(result, 'LINE');

//         res.status(201).json({
//           message: 'Post created successfully',
//           post: post, ///vai conter info sobre o post que foi armazenado na nossa database...
//           creator: {
//             _id: creator._id,
//             name: creator.name
//           }
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//         if (!err.statusCode) {
//           err.statusCode = 500;
//         }
//         next(err); ////DEVEMOS USAR 'next(err)' em códigos ASYNC, em vez de 'throw err'.... ---> com isso, conseguimos atnigir a 'special nodeexpress error handling middleware'..
//       });
//   }
// };






exports.createPost = async (req, res, next) => { ////VERSÃO ASYNC/AWAIT DO CÓDIGO LOGO ACIMA....



try {

  const errors = validationResult(req); 

  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error; //vai fazer com que entremos NO MIDDLEWARE ESPECIAL DE ERROR HANDLING, LÁ EM 'app.js'...  (USE 'throw err' com códigos SYNC, e 'next(err)' com códigos ASYNC... )

  } else {
    console.log(req.file);
    console.log(req.files);

    if (
      !req.file ///se nossa image (image upload, extraído pelo multer) NÃO ESTIVER ANEXADA NO REQUEST...
    ) {
      const error = new Error('No image attached to request.');
      error.statusCode = 422; ///se não for encontrada uma image no request, não deixa de ser um ERRO DE VALIDATION, por isso o '422' (invalid input)..
      throw error;
    }

    const imageUrl = req.file.path; ////precisamos disso, vamos querer armazenar esses PATHS/imageUrls em cada 1 dos nossos documents, lá na database....

    const title = req.body.title; ////obtido de nosso SEND DE JSON DATA, lá em 'fetch()'...
    const content = req.body.content;

    const userId = ObjectId(req.userId);

    let creator;

    console.log(title, content);

    console.log(req.body);

    console.log('REQUEST RECEIVED');

    const post = await new Post({ //versão do professor não usou 'async new Post' (async no começo), mas minha versão funcionou igual.... --> mas ela ainda ficou parecida, na verdade...

      //versão do prof:
      // const post = new Post({
      //   title: title,
      //   content: content,
      //   imageUrl: imageUrl,
      //   creator: req.userId
      // });
      // try {
      //   await post.save();



      title: title,
      content: content,
      imageUrl: imageUrl.replace(/\\/g, '/'),
      creator: {
        userId: userId,
      },
    }).save(); //importante.




     const user = await User.findOne({ _id: userId });



    user.addPost(post); //mesma coisa que 'user.posts.push(post)'...


    // post.userName = user.name;



        //  io.getIo() //nos dá nossa 'WEBSOCKETS connection', que definimos inicialmente lá em 'app.js'....
      ///.emit() --> COMUNICA 'ALL USERS CONNECTED TO YOUR APP' sobre essa info que você especifica (no caso, o create desse post, por esse user) ---> até mesmo o CRIADOR DO POST SERIA/SERÁ INFORMADO, se você usar 'emit()'....
      //.broadcast --> É O RIVAL DE 'emit' --> 'ALL USERS CONNECTED TO YOUR APP, EXCEPT THE ONE FOR WHICH THIS REQUEST WAS SENT' ( ou seja, TODOS OS USERS CONECTADOS AO SEU APP VAO RECEBER ESSA COMUNICAÇÃO, __ EXCETO__ AQUELE que emitiu/broadcasteou essa comunicação)....

      io.getIo().emit(  ///professor optou, aqui, por 'emit()' em vez de broadcast...
                        ////argumentos de 'emit()' --> 1) IDENTIFICADOR, nome do 'event' relativo a essa 'comunicação'... 2) A __ DATA__ que deverá ir nessa comuunicaçaõ...
    'posts', ///1o argumento... é o 'CHANNEL' que vamos querer usar... (no caso, 'posts')...
    { ///2o argumento

        action: 'create', //isso é apenas outro identificador, usado para identificar 'estamos realizando uma ACTION de CREATE no CHANNEL de posts'...
        post: post, ///essa é a data QUE INTERESSA, que vai ser usada para UPDATAR os posts na lista 'feed' de cada user que está conectado ao nosso app....
        postCreator: user.name
    }


      );
    res.status(201).json({
          message: 'Post created successfully',
          post: post, ///vai conter info sobre o post que foi armazenado na nossa database...
          creator: {
            _id: user._id,
            name: user.name
          }
        });

      }
    } catch(err) {
        console.log(err);
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err); 
      }
  
};






















// exports.editPost = (req, res, next) => { ////MINHA VERSÃO DO CÓDIGO.
//   // const postId = req.body.postId; //approach do postId NO BODY DO REQUEST...

//   const postId = req.params.postId; ///approach do segmento dinâmico na url...
//   console.log(postId, 'LINE61235');
//   const image = req.file;
//   const content = req.body.content;
//   const title = req.body.title;

//   Post.findById(postId)
//     .then((post) => {
//       console.log(post);
//       if (post.title !== title) {
//         post.title = title;
//       }

//       if (post.content !== content) {
//         post.content = content;
//       }

//       if (image) {
//         post.imageUrl = image.path;
//       }

//       if(post.title === title &&
//         post.content === content &&
//         !post.image) {

//           const error = new Error('As no changes to the post were written, no changes to the post were made.')
//           error.statusCode = 400;
//           throw error;
//         }

//       let postData = post;

//       return post.save().then((result) => {
//         console.log(result);

//         return res.status(200).json(
//           {
//             message: 'Post successfully edited.',
//             post: postData
//           }
//         )
//       });
//     })
//     .catch((err) => {
//       console.log(err);

//       if (err.statusCode === 400) {
//         res.status(400).json(
//           {
//             message: err.message,
//             error: err
//           }
//         )
//       }
//     });
// };

// exports.editPost = (req, res, next) => { ////VERSÃO 'PROMISE-BASED' (sem async-await)....
//   ///versão do professor do código de cima....
//   const postId = req.params.postId;


//   const userId = ObjectId(req.userId); /// USERID extraído de nossa TOKEN, lá no middleware de 'isAuth'...

//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     //é retornada esta response, se a validation do input FALHA... (na criação do post)...
//     console.log(errors);
//     const error = new Error('Validation failed, entered data is incorrect.');
//     error.statusCode = 422;
//     throw error; //vai fazer com que entremos NO MIDDLEWARE ESPECIAL DE ERROR HANDLING, LÁ EM 'app.js'...  (USE 'throw err' com códigos SYNC, e 'next(err)' com códigos ASYNC... )
//   }

//   const title = req.body.title;
//   const content = req.body.content;
//   let imageUrl = req.body.image;
//   if (req.file) {
//     imageUrl = req.file.path;
//   }

//   if (!imageUrl) {
//     //worst case scenario
//     const error = new Error('No file was picked.');
//     error.statusCode = 422; //invalid input;
//     throw error;
//   }

//   Post.findOne({ _id: ObjectId(postId) })
//     .then((post) => {
//       if (!post) {
//         const error = new Error('Post not found.');
//         error.statusCode = 404;
//         throw error;
//       }

//       if(post.creator.userId !== userId) {
//         const error = new Error('Your user was not responsible for that post');
//         error.statusCode = 403;
//         throw error;
//       }


//       if (imageUrl !== post.imageUrl) {
//         fs.unlink(post.imageUrl, (err) => {
//           console.log(err);
//         });
//       }

//       console.log('TEST42');
//       post.title = title;
//       post.imageUrl = imageUrl.replace(/\\/g, '/');
//       post.content = content;
//       return post.save();
//     })
//     .then((result) => {
//       console.log(result);
//       res.status(200).json({
//         message: 'Post updated!',
//         post: result,
//       });
//     })
//     .catch((err) => {
//       ///reutilização de error catching logic...
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };





exports.editPost = async (req, res, next) => { ////VERSÃO COM ASYNC AWAIT....



  try {


  
  const postId = req.params.postId;


  const userId = ObjectId(req.userId); /// USERID extraído de nossa TOKEN, lá no middleware de 'isAuth'...

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //é retornada esta response, se a validation do input FALHA... (na criação do post)...
    console.log(errors);
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error; //vai fazer com que entremos NO MIDDLEWARE ESPECIAL DE ERROR HANDLING, LÁ EM 'app.js'...  (USE 'throw err' com códigos SYNC, e 'next(err)' com códigos ASYNC... )
  }

  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    //worst case scenario
    const error = new Error('No file was picked.');
    error.statusCode = 422; //invalid input;
    throw error;
  }




 const post = await Post.findOne({ _id: ObjectId(postId) }); ///eis o código em questão.



 console.log(post, 'LINEASASas');

 console.log(post.creator.userId, userId)

      if (!post) {
        const error = new Error('Post not found.');
        error.statusCode = 404;
        throw error;
      }

      if(post.creator.userId.toString() !== userId.toString()) {
        const error = new Error('Your user was not responsible for that post');
        error.statusCode = 403;
        throw error;
      }


      if (imageUrl !== post.imageUrl) {
        fs.unlink(post.imageUrl, (err) => {
          console.log(err);
        });
      }

      console.log('TEST42');
      post.title = title;
      post.imageUrl = imageUrl.replace(/\\/g, '/');
      post.content = content;

      

    const newPost = await post.save();


    // .then((result) => {
    //   console.log(result);




    const yourPost = await Post.findOne({_id: ObjectId(postId)}).populate('creator.userId');
    // .populate(
    //   'creator.userId'
    // );


    // console.log(yourPost.creator, 'YOURPOST');

    console.log(yourPost, 'yourPost')


  

        io.getIo().emit('posts', 
          {
              action: 'edit',
              post: yourPost
              
              // postCreator: yourPost.creator.userId.name
          }
        
        )






      res.status(200).json({
        message: 'Post updated!',
        post: newPost,
      });
    // })

  } catch (err) {
          ///reutilização de error catching logic...
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
  }


};
























// exports.getSinglePost = (req, res, next) => { //versão sem async await....
//   const postId = req.params.postId;
//   console.log(postId, 'LINE');

//   // Post.findById({postId})
//   Post.findOne({ _id: ObjectId(postId) })
//     .then((post) => {
//       if (!post) {
//         const error = new Error('Could not find post.');
//         error.statusCode = 404; //pq o POST NÃO PODE SER ENCONTRADO ('NOT FOUND', é isso que significa esse código...)
//         throw error; //vai fazer com que entremos no CATCH BLOCK... --> podemos escrever um THROW de um error dentro de código assíncrono, sim, DESDE QUE TENHAMOS UM 'CATCH BLOCK' depois do then block em que escreveoms esse 'throw', para que seja CAUGHT esse throw desse error....
//       }

//       res.status(200).json({
//         message: 'Post fetched.',
//         post: post, ///// o actual post, a post data que interessa, sendo retornada ao nosso frontend....
//       });
//     })
//     .catch((err) => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };






exports.getSinglePost = async (req, res, next) => { //versão com async await...

  try {

  
  const postId = req.params.postId;
  console.log(postId, 'LINE');

  // Post.findById({postId})
  const post = await Post.findOne({ _id: ObjectId(postId) });
    // .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404; //pq o POST NÃO PODE SER ENCONTRADO ('NOT FOUND', é isso que significa esse código...)
        throw error; //vai fazer com que entremos no CATCH BLOCK... --> podemos escrever um THROW de um error dentro de código assíncrono, sim, DESDE QUE TENHAMOS UM 'CATCH BLOCK' depois do then block em que escreveoms esse 'throw', para que seja CAUGHT esse throw desse error....
      }

      res.status(200).json({
        message: 'Post fetched.',
        post: post, ///// o actual post, a post data que interessa, sendo retornada ao nosso frontend....
      });
    // })

  } catch (err) {
    // .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    // })
  }
};
















// exports.deletePost = (req, res, next) => { ///VERSÃO SEM ASYNC/AWAIT (promise-based, then e catch blocks....) --> versão async/await do nosso código RUIM e sem checks corretos...
//   // const postId = req.params.postId;

//   // const postId = req.body.postId; ///approach que usávamos COM __ O 'router.post('/delete-post/...')' -----> MAS NÃO VAMOS USAR com o approach do 'router.delete()', PQ o method 'DELETE' naõ PERMITE O SEND DE REQUEST BODIES... (e antes estávamos extraindo o id do request body....) ---> agora vamos extrair esse id LÁ DA URL, POR MEIO DE 'req.params.postId'...

//   const postId = req.params.postId;

//   // Post.findById(postId).then((post) => {
//   //   ////// isto vai apagar a image correspondente a esse post, lá de nossa database...
//   //   fs.unlink(post.imageUrl, (err) => {
//   //     console.log(err);
//   //   });
//   // });

//   // Post.findByIdAndDelete(postId) ///já isto vai deletar o ACTUAL POst  de nossa database.... --> mas vamos USAR O 'findById()' + deleteone(), PQ _ QUEREMOS __FAZER AS COISAS POR PARTES, ANTES IDENTIFICAR SE O USER REALMENTE TEM AQUELE POST (post é realmente desse user), etc tetc....
//   //   .then((result) => {
//   //     console.log(result);

//   //     res.status(200).json({
//   //       message: 'Product successfully deleted',
//   //     });
//   //   })
//   //   .catch((err) => {
//   //     res.status(500).json({
//   //       message: 'Failed to delete product.',
//   //       err: err,
//   //     });
//   //   });

//   const userId = ObjectId(req.userId); //extraído de nossa token, por meio do middleware de 'isAuth'...

//   User.findOne({ _id: userId })
//     .then((user) => {

//       console.log('USER', user);
//       if (!user) {
//         const error = new Error('User not found in database.');
//         error.statusCode = 401; //unauthenticated
//         throw error;
//       }

//       // const oldPosts = [...user.posts]; ///ESSE CÓDIGO FAZ A MESMA COISA QUE aquele 'user.posts.pull()' -------> ESSE '.pull()' é um MÉTODO DO MONGOOSE, FORNECIDO POR ELE, QUE NOS DEIXA CHAMAR ISSO SOBRE UM ARRAY NOS NOSSOS DOCUMENTS, PARA ENTÃO __ EXTRAIR 1 OBJECT, por meio do seu id (no caso, o 'postId')...

//       // const postIndex = oldPosts.findIndex((post) => {
//       //   return post.postId === postId;
//       // });

//       // if (!postIndex) {
//       //   const error = new Error(
//       //     'That post has not been encountered for your user.'
//       //   );
//       //   error.statusCode = 403;
//       //   throw error;
//       // }

//       // oldPosts.splice(postIndex, 1);

//       // user.posts = oldPosts;

//       console.log('USER2', user);
//       user.posts.pull({postId: ObjectId(postId)}); ///////VAI __ TIRAR__ ESSE POST específico (desse id aí) DO NOSSO ARRAY DE 'posts'... (método fornecido pelo mongoose)... ------> ISSO VAI SUBSTITUIR AQUELE NOSSO CÓDIGO MANUAL, QUE ESCREVEMOS LOGO ACIMA....

//       return user.save(); ///deleta o post de dentro de nosso 'user', naquela propriedade de 'posts' (que é um array)...
//     })
//     .then((result) => {
//       Post.findById(postId).then((post) => {
//         if (!post) {
//           const error = new Error('Post not found.');
//           error.statusCode = 404;
//           throw error;
//         }
//         fs.unlink(post.imageUrl, (err) => {
//           console.log(err);
//         });

//         return Post.findByIdAndRemove(postId).then((result) => {
//           console.log(result);
//           res.status(200).json({
//             message: 'The post was deleted.',
//           });
//         });
//       });
//     })
//     // Post.findById(postId)
//     //   .then((post) => {
//     //     //check logged in user (LATER IN THE COURSE, when we have 'logged in users'...)...

//     //     if (!post) {
//     //       const error = new Error('Post not found.');
//     //       error.statusCode = 404;
//     //       throw error;
//     //     }
//     //     fs.unlink(post.imageUrl, (err) => {
//     //       console.log(err);
//     //     });

//     //     return Post.findByIdAndRemove(postId).then((result) => {
//     //       console.log(result);
//     //       res.status(200).json({
//     //         message: 'The post was deleted.',
//     //       });
//     //     });
//     //   })
//     .catch((err) => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }

//       next(err);
//     });
// };









// exports.deletePost = async (req, res, next) => { ///VERSÃO COM ASYNC/AWAIT ( do código errado, haha)...



//   try {

  
//   const postId = req.params.postId;


//   const userId = ObjectId(req.userId); //extraído de nossa token, por meio do middleware de 'isAuth'...

//   const user = await User.findOne({ _id: userId });
//     // .then((user) => {

//       // console.log('USER', user);


//       if (!user) {
//         const error = new Error('User not found in database.');
//         error.statusCode = 401; //unauthenticated
//         throw error;
//       }

//       console.log('USER2', user);


//    const pulledPosts = await user.posts.pull({postId: ObjectId(postId)}); ///////VAI __ TIRAR__ ESSE POST específico (desse id aí) DO NOSSO ARRAY DE 'posts'... (método fornecido pelo mongoose)... ------> ISSO VAI SUBSTITUIR AQUELE NOSSO CÓDIGO MANUAL, QUE ESCREVEMOS LOGO ACIMA....

//       // return user.save(); ///deleta o post de dentro de nosso 'user', naquela propriedade de 'posts' (que é um array)...



//     const savedUser = await user.save();


//     // })
//     // .then((result) => {
//       Post.findById(postId).then((post) => {
//         if (!post) {
//           const error = new Error('Post not found.');
//           error.statusCode = 404;
//           throw error;
//         }
//         fs.unlink(post.imageUrl, (err) => {
//           console.log(err);
//         });

//         return Post.findByIdAndRemove(postId).then((result) => {
//           console.log(result);
//           res.status(200).json({
//             message: 'The post was deleted.',
//           });
//         });
//       });
//     // })
//   } catch (err) {

  
//     // .catch((err) => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }

//       next(err);
//     // });

//   }
// };









// exports.deletePost = (req, res, next) => { ///versão sem async/await..
//   const postId = req.params.postId;
// Post.findById(postId)
//     .then(post => {
//       if (!post) {
//         const error = new Error('Could not find post.');
//         error.statusCode = 404;
//         throw error;
//       }
//       if (post.creator.toString() !== req.userId) {
//         const error = new Error('Not authorized!');
//         error.statusCode = 403;
//         throw error;
//       }
//       // Check logged in user
//       clearImage(post.imageUrl);



//       return Post.findByIdAndRemove(postId);
//     })
//     .then(result => {
//       return User.findById(req.userId);
//     })
//     .then(user => {
//       user.posts.pull(postId);
//       return user.save();
//     })
//     .then(result => {
//       res.status(200).json({ message: 'Deleted post.' });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };




exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }

    console.log(post.creator.userId.toString(), req.userId.toString(), 'LINE')
    if (post.creator.userId.toString() !== req.userId.toString()) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    // Check logged in user
    // clearImage(post.imageUrl);

    fs.unlink(post.imageUrl, (err) => {
      console.log(err);
    });

    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();



 
    // const posts = await Post.find({});  //não precisamos disto...





    io.getIo().emit('posts', 

    {
      action: 'delete',
      postId: postId,
      // posts: posts //não precisamos disto.
    }
    
    
    )

    res.status(200).json({ message: 'Deleted post.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};




exports.buttonDisplay = async (req, res, next) => {



  const postId = req.params.postId;

  const userId = req.body.userId

  try {

  

  const foundPost = await Post.findOne(
    {
      _id: ObjectId(postId)
    }
  );

  console.log(foundPost);

  if (!foundPost) {
        const error = new Error('Post could not be found');
        error.statusCode = 404;
        throw error;

  }


  const foundUser = await User.findOne(
    {
      _id: ObjectId(userId)
    }
  );

    console.log(foundUser);

  if (foundUser._id.toString() === foundPost.creator.userId.toString()) {
    console.log('ENTERED', foundUser._id.toString(), foundPost.creator.userId.toString());
    return res.status(200).json(
      {
        created: true
      }
    )
    }


  
    res.status(401).json(
      {
        created: false
      }
    )


} catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;

    }

    next(err);


}



}







// exports.deletePost = (req, res, next) => {
//   ////VERSÃO DO PROFESSOR

//   const postId = req.params.postId;

//   const userId = ObjectId(req.userId); //extraído de nossa token, por meio do middleware de 'isAuth'...

//   Post.findById(postId)
//     .then((post) => {
//       if (!post) {
//         const error = new Error('Post not found.');
//         error.statusCode = 404;
//         throw error;
//       }

//       if (post.creator.userId !== req.userId) {
//         ////VAI CHECAR SE ESSE POST AÍ TEM O NOSSO USER ASSIGNADO A ELE...

//         const error = new Error('Not authorized!');
//         error.statusCode = 403;
//         throw error;
//       }

      // fs.unlink(post.imageUrl, (err) => {
      //   console.log(err);
      // });

//       return Post.findByIdAndRemove(postId);
//     })
//     .then((result) => {
//       User.findOne({ _id: userId }).then((user) => {
//         const oldPosts = [...user.posts];

//         const postIndex = oldPosts.findIndex((post) => {
//           return post.postId === postId;
//         });

//         if (!postIndex) {
//           const error = new Error(
//             'That post has not been encountered for your user.'
//           );
//           error.statusCode = 403;
//           throw error;
//         }

//         oldPosts.splice(postIndex, 1);

//         user.posts = oldPosts;

//         return user.save();
//       });
//     })
//     .then((result) => {
//       res.status(200).json({
//         message: 'The post was deleted.',
//       });
//     })
//     .catch((err) => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//     });
// };










