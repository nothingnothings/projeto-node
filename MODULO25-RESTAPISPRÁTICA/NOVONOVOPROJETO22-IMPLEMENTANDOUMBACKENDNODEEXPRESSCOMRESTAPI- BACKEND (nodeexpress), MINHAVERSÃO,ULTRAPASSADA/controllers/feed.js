const Post = require('../models/post');

const { validationResult } = require('express-validator');

const fs = require('fs');

const ObjectId = require('mongodb').ObjectId;

const User = require('../models/user');

const ITEMS_PER_PAGE = 5;

exports.getPosts = (req, res, next) => {
  // res.status(200).json({ ///código que fazia return de DUMMY POSTS...
  //   posts: [
  //     {
  //       _id: Math.random() + new Date().toISOString(),
  //       title: 'First Post',
  //       content: 'This is the first post.',
  //       imageUrl: 'images/o-fantastico-jaspion.jpg',

  //       creator: {
  //         name: 'Max',
  //       },
  //       createdAt: new Date(),
  //     },
  //     {
  //       _id: Math.random() + new Date().toISOString(),
  //       title: 'Second Post',
  //       content: 'This is the second post.',
  //       imageUrl: 'images/o-fantastico-jaspion.jpg',

  //       creator: {
  //         name: 'Max',
  //       },
  //       createdAt: new Date(),
  //     },
  //   ],
  // });

  //código com pagination...
  const pageNumber = req.query.page || 1;

  const userId = ObjectId(req.userId); ///userId extraído de nossa token e armazenado no objeto request do user... tudo graças ao middleware de 'isAuth', lá no folder de 'middlewareHelpers'...

  console.log(userId);
  console.log(pageNumber);

  let totalItems;

  Post.countDocuments({ creator: { userId: userId } })
    .then((numPosts) => {
      totalItems = numPosts; ////isso vai nos dar o NÚMERO TOTAL DE POSTS, que será usado mais abaixo...

      // return Post.find({}) ///vai nos dar TODOS OS POSTS de nossa database...
      return Post.find({ creator: { userId: userId } }) ////vai nos dar APENAS os posts VINCULADOS A ESSE NOSSO USER...
        .skip(
          (pageNumber - 1) * ITEMS_PER_PAGE ///lógica para fazer nossos items aparecerem -->  /////vai ser o NÚMERO DA PÁGINA - 1, VEZES O NÚMERO DE ITEMS QUE DESEJAMOS POR PAGE.... --> essa será a QUANTIDADE DE ITEMS QUE VAMOS QUERER SKIPPAR, ignorar, ao renderizar os products em 1 given page... (10 products por page, é isso que configuramos em 'ITEMS_PER_PAGE')...
        ) ///método que só pode ser chamado em cima de CURSORS (como esse aí, retrievado por 'find()') ---> O método 'skip()' VAI SEMPRE _ SKIPPAR __ O NÚMERO QUE VOCÊ PASSOU COMO PARÂMETRO (quantidade), DE ENTRIES NA SUA COLLECTION... (nesse caso, ele vai skippar TUDO MENOS os 2 items que desejamos, de forma dinâmica...)
        .limit(ITEMS_PER_PAGE)
        .then((posts) => {
          if (!posts) {
            res.status(404).json({
              message:
                'No posts encountered on database, please try again later.',
            });
          }
          // console.log(posts);
          res.status(200).json({
            posts: posts,
            currentPage: +pageNumber,
            // hasNextPage: ITEMS_PER_PAGE * pageNumber < totalItems,
            // hasPreviousPage: +pageNumber > 1,
            // nextPageNumber: +pageNumber + 1,
            // previousPageNumber: pageNumber - 1,
            // lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            totalItems: totalItems,
          });
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      }
    });

  // Post.find({}) ///lógica SEM PAGINATION (páginas)...
  //   .then((posts) => {
  //     if (!posts) {
  //       const error = new Error(
  //         'There was a problem, and no posts could be fetched.'
  //       );
  //       error.statusCode(404);
  //       throw error;
  //     }
  //     res.status(200).json({
  //       ///código que fazia return de DUMMY POSTS...
  //       message: 'Posts fetched successfully',
  //       posts: posts,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);

  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }

  //     next(err);
  //   });
};

exports.createPost = (req, res, next) => {
  //CREATE POST IN DB...
  const errors = validationResult(req); //EIS O CÓDIGO EM QUESTÃO.

  if (!errors.isEmpty()) {
    //é retornada esta response, se a validation do input FALHA... (na criação do post)...
    console.log(errors);
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error; //vai fazer com que entremos NO MIDDLEWARE ESPECIAL DE ERROR HANDLING, LÁ EM 'app.js'...  (USE 'throw err' com códigos SYNC, e 'next(err)' com códigos ASYNC... )

    // return res //throw manual de erro, pior do que o visto logo acima...
    //   .status(422)
    //   .json({ message: 'Validation failed, entered data is incorrect.', errors: errors.array()});
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

    console.log('REQUEST RECEIVED');

    const post = new Post({
      title: title,
      content: content,
      // imageUrl: 'DUMMY',
      imageUrl: imageUrl.replace(/\\/g, '/'),
      creator: {
        userId: userId,
      },
      //não precisamos passar nem '_id' (settado automaticamente pelo mongoose, ao salvarmos doc no server), nem 'createdAt', nem 'updatedAt' (são criados automaticamente pelo parâmetro 'timestamps: true', lá no model de 'Post'...)
    });

    post
      .save()
      .then((result) => {
        console.log(result);

        const post = result;

        return User.findOne({ _id: userId }) //use 'findOne', e não 'find()', pq você NÃO VAI QUERER RETORNAR 'an iterable cursor of results'...
          .then((user) => {
            creator = user; ///vamos usar isso no return da response, para retornar 'INFORMAÇÕES SOBRE O CREATOR' desse post...

            return user.addPost(post);
          });
        // res.status(201).json({
        //   message: 'Post created successfully',
        //   post: result, ///vai conter info sobre o post que foi armazenado na nossa database...
        // });
      })
      .then((result) => {
        console.log(result, 'LINE');

        res.status(201).json({
          message: 'Post created successfully',
          post: post, ///vai conter info sobre o post que foi armazenado na nossa database...
          creator: {
            _id: creator._id,
            name: creator.name,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err); ////DEVEMOS USAR 'next(err)' em códigos ASYNC, em vez de 'throw err'.... ---> com isso, conseguimos atnigir a 'special nodeexpress error handling middleware'..
      });
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

exports.editPost = (req, res, next) => {
  ///versão do professor do código de cima....
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

  Post.findOne({ _id: ObjectId(postId) })
    .then((post) => {
      if (!post) {
        const error = new Error('Post not found.');
        error.statusCode = 404;
        throw error;
      }

      if (post.creator.userId !== userId) {
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
      return post.save();
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Post updated!',
        post: result,
      });
    })
    .catch((err) => {
      ///reutilização de error catching logic...
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getSinglePost = (req, res, next) => {
  const postId = req.params.postId;
  console.log(postId, 'LINE');

  // Post.findById({postId})
  Post.findOne({ _id: ObjectId(postId) })
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404; //pq o POST NÃO PODE SER ENCONTRADO ('NOT FOUND', é isso que significa esse código...)
        throw error; //vai fazer com que entremos no CATCH BLOCK... --> podemos escrever um THROW de um error dentro de código assíncrono, sim, DESDE QUE TENHAMOS UM 'CATCH BLOCK' depois do then block em que escreveoms esse 'throw', para que seja CAUGHT esse throw desse error....
      }

      res.status(200).json({
        message: 'Post fetched.',
        post: post, ///// o actual post, a post data que interessa, sendo retornada ao nosso frontend....
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  // const postId = req.params.postId;

  // const postId = req.body.postId; ///approach que usávamos COM __ O 'router.post('/delete-post/...')' -----> MAS NÃO VAMOS USAR com o approach do 'router.delete()', PQ o method 'DELETE' naõ PERMITE O SEND DE REQUEST BODIES... (e antes estávamos extraindo o id do request body....) ---> agora vamos extrair esse id LÁ DA URL, POR MEIO DE 'req.params.postId'...

  const postId = req.params.postId;

  // Post.findById(postId).then((post) => {
  //   ////// isto vai apagar a image correspondente a esse post, lá de nossa database...
  //   fs.unlink(post.imageUrl, (err) => {
  //     console.log(err);
  //   });
  // });

  // Post.findByIdAndDelete(postId) ///já isto vai deletar o ACTUAL POst  de nossa database.... --> mas vamos USAR O 'findById()' + deleteone(), PQ _ QUEREMOS __FAZER AS COISAS POR PARTES, ANTES IDENTIFICAR SE O USER REALMENTE TEM AQUELE POST (post é realmente desse user), etc tetc....
  //   .then((result) => {
  //     console.log(result);

  //     res.status(200).json({
  //       message: 'Product successfully deleted',
  //     });
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       message: 'Failed to delete product.',
  //       err: err,
  //     });
  //   });

  const userId = ObjectId(req.userId); //extraído de nossa token, por meio do middleware de 'isAuth'...

  User.findOne({ _id: userId })
    .then((user) => {

      console.log(user, 'LINE51251')
      if (!user) {
        const error = new Error('User not found in database.');
        error.statusCode = 401; //unauthenticated
        throw error;
      }

      // const oldPosts = [...user.posts]; ///ESSE CÓDIGO FAZ A MESMA COISA QUE aquele 'user.posts.pull()' -------> ESSE '.pull()' é um MÉTODO DO MONGOOSE, FORNECIDO POR ELE, QUE NOS DEIXA CHAMAR ISSO SOBRE UM ARRAY NOS NOSSOS DOCUMENTS, PARA ENTÃO __ EXTRAIR 1 OBJECT, por meio do seu id (no caso, o 'postId')...

      // const postIndex = oldPosts.findIndex((post) => {
      //   return post.postId === postId;
      // });

      // if (!postIndex) {
      //   const error = new Error(
      //     'That post has not been encountered for your user.'
      //   );
      //   error.statusCode = 403;
      //   throw error;
      // }

      // oldPosts.splice(postIndex, 1);

      // user.posts = oldPosts;


      user.posts.pull(postId); ///////VAI __ TIRAR__ ESSE POST específico (desse id aí) DO NOSSO ARRAY DE 'posts'... (método fornecido pelo mongoose)... ------> ISSO VAI SUBSTITUIR AQUELE NOSSO CÓDIGO MANUAL, QUE ESCREVEMOS LOGO ACIMA....


        console.log(user.posts, 'LINE');
      return user.save(); ///deleta o post de dentro de nosso 'user', naquela propriedade de 'posts' (que é um array)...
    })
    .then((result) => {
      Post.findById(postId).then((post) => {
        if (!post) {
          const error = new Error('Post not found.');
          error.statusCode = 404;
          throw error;
        }
        fs.unlink(post.imageUrl, (err) => {
          console.log(err);
        });

        return Post.findByIdAndRemove(postId).then((result) => {
          console.log(result);
          res.status(200).json({
            message: 'The post was deleted.',
          });
        });
      });
    })
    // Post.findById(postId)
    //   .then((post) => {
    //     //check logged in user (LATER IN THE COURSE, when we have 'logged in users'...)...

    //     if (!post) {
    //       const error = new Error('Post not found.');
    //       error.statusCode = 404;
    //       throw error;
    //     }
    //     fs.unlink(post.imageUrl, (err) => {
    //       console.log(err);
    //     });

    //     return Post.findByIdAndRemove(postId).then((result) => {
    //       console.log(result);
    //       res.status(200).json({
    //         message: 'The post was deleted.',
    //       });
    //     });
    //   })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

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

//       fs.unlink(post.imageUrl, (err) => {
//         console.log(err);
//       });

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
