const Post = require('../models/post');

const { validationResult } = require('express-validator');

const fs = require('fs');

const ObjectId = require('mongodb').ObjectId;

const User = require('../models/user');



// const io = require('../socket'); ///objeto 'io' possui os métodos '.init()' (usado lá em 'app.js', starter do seu server) e 'getIo()' (usado aqui, PARA REALIZAR OPERAÇÕES COM A CONEXÃO WEBSOCKET do seu app)....
//ver código de 'createPost' para ver interação com websockets....
const ITEMS_PER_PAGE = 5;







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


    const neededUserDocuments = await Post.find({}, null,
      {skip: (pageNumber - 1) * ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE}
    ).populate(
      'creator.userId'
  ).sort({_id: -1})


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




      title: title,
      content: content,
      imageUrl: imageUrl.replace(/\\/g, '/'),
      creator: {
        userId: userId,
      },
    }).save(); //importante.




     const user = await User.findOne({ _id: userId });



    user.addPost(post); //mesma coisa que 'user.posts.push(post)'...

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


