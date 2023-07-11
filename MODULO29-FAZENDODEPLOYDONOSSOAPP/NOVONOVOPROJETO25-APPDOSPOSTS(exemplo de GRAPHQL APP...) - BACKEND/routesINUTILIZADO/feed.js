const express = require('express');

const Post = require('../models/post');

const router = express.Router();

const { body, check } = require('express-validator');

const isAuth = require('../middlewareHelpers/is-auth'); ///nossa validation é feita a partir DE TOKENS... --> e esse middleware é responsável pelo store da propriedade 'userId' no NOSSO REQUEST, a partir dessas tokens __ ENVIADAS__ por nosso client (mas tokens são PRODUZIDAS NO BACKEND, quando é realizado o login... esse é o flow)...
//vamos colocar esse 'guard de auth' EM TODAS NOSSAS ROUTES, EXCETO AS DE 'auth', pq o user não precisará estar authenticated para as acessar... (ao contrário das outras, que precisam disso)...



const feedController = require('../controllers/feed');

//GET /feed/posts
router.get(
  '/posts',

  isAuth,  ////vamos usar isso para fazer   'GUARD' dessa route... --> user só poderá ver POSTS se estiver AUTHENTICATED ( ou seja, se estiver com uma TOKEN no seu browser...) ------> essa token é então verificada nesse middleware de 'isAuth', tudo coisa padrão...
          ///esse middleware de 'isAuth' então faz o STORE do valor de 'userId' contido nessa token em uma PROPRIEDADE DE NOME 'userId' no request object do usuário... (se tudo der certo, validation for bem sucedida).... 
  feedController.getPosts
);

//POST /feed/post
router.post(
  '/post',
  isAuth, //route guard. Authentication/authorization
  [
    body('title')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Title should be more than 6 characters long.')
      // .isString()
      .isAlpha()
      .withMessage('Post Titles must contain only letters.')

      .custom((value, { req }) => {
        ////EIS O CÓDIGO EM QUESTÃO. //////ESSE BLOCO '.custom()' É UM __ EXEMPLO DE ' ASYNC VALIDATION'.. --> para mais informações, VER AULA 291, adding async validation.... (é async validation pq NOSSO APP VAI QUERER CONTATAR A DATABASE PARA CHECAR SE O EMAIL INPUTTADO PELO USER JÁ NÃO EXISTE DENTRO DE 1 USER PRÉVIO, O QUE O TORNARIA INVÁLIDO/INUSÁVEL...)

        console.log(value);
        return Post.findOne({ title: value }).then((post) => {
          console.log(post);
          if (post) {
            console.log(post, 'LINE');
            return Promise.reject(
              'A post with the chosen title already exists, please choose another one.'
            );
          } else {
            return value;
          }
        });
      }),
    body('content')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Content should be more than 6 characters long.'),
  ],



  feedController.createPost
);

// router.patch('/edit-post/:postId', feedController.editPost); //minha antiga versão do código

// router.patch('/post-edit', feedController.editPost); /////minha versão do código....

router.put(
  '/post/:postId',
  isAuth, ///route guard. Authentication/authorization
  [
    body('title')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Title should be more than 6 characters long.')
      // .isString()
      .isAlpha()
      .withMessage('Post Titles must contain only letters.'),

    body('content')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Content should be more than 6 characters long.'),
  ], 
 

  feedController.editPost
); ///versão do professor... ele encoda o postId na url, e também usa esse method de 'put' em vez de 'patch' (pq PUT VAI SUBSTITUIR RESOURCES NO NOSSO DATABASE, no caso as INFORMAÇÕES CONTIDAS EM 1 'POST'... isso é uma substituição, no caso, pq A OLD DATA desse post é PERDIDA, exceto o _Id....)

// router.post('/delete-post/:postId', feedController.deletePost);

// router.post('/delete-post', feedController.deletePost);

router.delete('/delete-post/:postId', 

isAuth, ///route guard. Authentication/authorization

feedController.deletePost); ////route com o METHOD/verbo http mais correcto... (em REST APIS...)
////DELETE __ ROUTES_ NÃO __ ACEITAM/PERMITEM O SEND DE 'bodies' com o REQUEST... (ao contrário de POST requests, que permitem esse send....)
////e é exatamente por isso que aqui (e na grande maioria dos casos de DELETE ALGUMA COISA, EM REST APIs) VAMOS PREFERIR __ O APPROACH DO 'extract postId lá da url' em vez de 'extract postId lá do request body'...

//PATCH /feed/post

// router.patch('/post', feedController.editPost);

// GET  /feed/post/:postId

router.get('/post/:postId', 
isAuth, ///route guard. Authentication/authorization

feedController.getSinglePost);

//DELETE /feed/post/:postId

// router.delete('/post', feedController.deletePost);







router.post('/post/buttons/:postId', 
    isAuth,
  feedController.buttonDisplay
)

module.exports = router;
