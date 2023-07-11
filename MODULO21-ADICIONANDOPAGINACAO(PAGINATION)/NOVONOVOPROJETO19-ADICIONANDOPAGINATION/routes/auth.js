const express = require('express');

// const expValidator = require('express-validator/check'); ////SE VOCÊ QUER ADICIONAR 'VALIDATION LOGIC' AO SEU SERVERSIDE CODE, importe essa package  DE 'check', dentro da package de 'express-validator'....

// const { check, validationResult } = require('express-validator/check'); //DEPRECADO. (express-validator: requires to express-validator/check are deprecated.You should just use require("express-validator") instead.)

const { check, body, validationResult } = require('express-validator');

const User = require('../models/user');

const bcrypt = require('bcryptjs');

// const { body, param, header, cookie } = require('express-validator'); //// SÃO VERSÕES MAIS 'ESPECÍFICAS' do método 'check()' (isso pq o método CHECK VAI SEMPRE CHECAR __POR HEADERS, COOKIES, O BODY, PARAMS, TUDO... vai checar por tudo para tentar encontrar 'values' advindo dos INPUT FIELDS DE SEU VIEW/runtime de seu app...)

const authController = require('../controllers/auth');

const router = express.Router();

router.get(
  '/login',

  authController.getLoginPage
);

router.post(
  '/login',

  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        ////EIS O CÓDIGO EM QUESTÃO. //////ESSE BLOCO '.custom()' É UM __ EXEMPLO DE ' ASYNC VALIDATION'.. --> para mais informações, VER AULA 291, adding async validation.... (é async validation pq NOSSO APP VAI QUERER CONTATAR A DATABASE PARA CHECAR SE O EMAIL INPUTTADO PELO USER JÁ NÃO EXISTE DENTRO DE 1 USER PRÉVIO, O QUE O TORNARIA INVÁLIDO/INUSÁVEL...)

        return User.findOne({ email: value }) ///////EIS O CÓDIGO EM QUESTÃO.
          .then((user) => {
            if (!user) {
              return Promise.reject(
                'No account assigned to that email, please try another one.'
              );
            }
          });
      })
      .normalizeEmail(), ////vai converter todos os caracteres do email em LOWERCASE... pq é isso que queremos, com emails, queremos que sejam STORADOS ASSIM, na nossa database... (E que sejam verificados assim, quando fazemos login....)
    check('password')
      .isAlphanumeric()
      .withMessage('Password must be made of only letters and numbers.')
      .custom((value, { req }) => {
        console.log(req.body.email, 'EMAIL');

        return User.findOne({ email: req.body.email }).then((user) => {
          return bcrypt
            .compare(user.password.toString(), value.toString())
            .then((result) => {
              if (result) {
                return value;
              } else {
                if (value.length < 6) {
                  return Promise.reject(
                    'Your Password must contain 6 or more characters.'
                  );
                } else {
                  return Promise.reject('Invalid Password');
                }
              }
            });
        });
      })
      .trim(), ////VAI REMOVER TODOS OS WHITE SPACES DO PASSWORD inputtado...

    // body('password',
    //  'Invalid Password'). ////EIS O CÓDIGO EM QUESTÃO. É ASSIM QUE ADICIONAMOS UMA ERROR MESSAGE 'GERAL' A UM DE NOSSOS CHECKS...
    //  isAlphanumeric()
    //   .withMessage('Passwords must be made of only letters and numbers')
    //   .custom(
    //     (value, { req }) => {

    //       return
    //     }
    //   )
  ],

  authController.postLogin
);

router.post(
  '/logout',

  authController.postLogout
);

router.get(
  '/signup',

  authController.getSignupPage
);

router.post(
  '/signup',

  [
    ///E SIM, podemos TER MULTIPLOS 'VALIDATORS' atribuídos/vinculados a 1 MESMO FIELD...
    check('email') ///MIDDLEWARE... é um middleware de 'express-validator', usado para VALIDATE OUR USER INPUT... --> ele vai checar se aquele input field de 'email' (que pode existir OU NO REQUEST BODY, OU NOS QUERY PARAMS, OU NOS COOKIES, OU NOS HEADERS ) __ É REALMENTE 1 EMAIL, SE ELE PODE SER CONSIDERADO 1 'EMAIL' (por isso o method chainado de 'isEmail()'.... OBS::: ESSE METHOD de 'isXXXX()' É OBRIGATÓRIO.....)
      .isEmail() ///ESSE MIDDLEWARE de 'check()' DEVE SER USADO JUNTO DE 'validationResult', lá no arquivo CONTROLLER de 'auth.js' (é lá que temos esse 'validationResult', TAMBÉM IMPORTADO de 'express-validator'....) //withMessage() é usado para __ SUBSTITUIR objetos 'normais' de 'erros' obtidos com 'check().isXXX()' PELA __ STRING QUE VOCÊ PASSOU para dentro dele... (no caso, essa string de 'please enter a valid email')...
      .withMessage('Please enter a valid email.')
      .custom(
        ///usado para CHECAR__ SE 1 EMAIL DESSES JÁ EXISTE EM 1 USER NA NOSSA DATABASE/APP... (uma validation SERVERSIDE, no caso, ao contrário da validation que fizemos com 'req.flash()' lá nos nossos controllers, com um código BEM PARECIDO de 'User.findOne()')
        (value, { req }) => {
          ////EIS O CÓDIGO EM QUESTÃO. //////ESSE BLOCO '.custom()' É UM __ EXEMPLO DE ' ASYNC VALIDATION'.. --> para mais informações, VER AULA 291, adding async validation.... (é async validation pq NOSSO APP VAI QUERER CONTATAR A DATABASE PARA CHECAR SE O EMAIL INPUTTADO PELO USER JÁ NÃO EXISTE DENTRO DE 1 USER PRÉVIO, O QUE O TORNARIA INVÁLIDO/INUSÁVEL...)

          return User.findOne({ email: value }) ///////EIS O CÓDIGO EM QUESTÃO.
            .then((user) => {
              if (user) {
                return Promise.reject(
                  'Email already exists, please pick a different one'
                );
              }
            });
        }
      )
      .normalizeEmail(), ////vai converter todos os caracteres do email em LOWERCASE... pq é isso que queremos, com emails, queremos que sejam STORADOS ASSIM, na nossa database... (E que sejam verificados assim, quando fazemos login....)

    // .withMessage('Please enter a valid email address.'),   ////ver aula 'USANDO VALIDATION ERROR MESSAGES'

    //--> 'withMessage()' é usado PARA DEFINIR _CUSTOM_ _ ERROR MESSAGES, que vão aparecer no field de 'msg', lá no nosso array de 'errors', nos CONTROLLERS em que USAMOS 'validationResult' (Que também é importado de 'express-validator', como o é 'check()' )...

    // .custom((value, {req}) => { ///ESTE É UM EXEMPLO DE 'ADD A CUSTOM VALIDATOR'; VOCÊ DEVE ESCREVER SEU PRÓPRIO VALIDATOR QUANDO VOCÊ ACHAR QUE VALIDATORS COMO 'isEmail()', 'isEmpty()', 'isIn()' e OUTROS VALIDATORS BUILTIN não forem suficientes para suas necessidades...
    //     if (value === 'test@test.com')  {
    //       throw new Error('This email address sucks, please choose another one.');
    //     }
    //   return true;
    // }

    // )

    //  check('password',
    body(
      'password',
      'Your password has to be made of only letters and numbers, and of 6 or more characters.'
    ) ////EIS O CÓDIGO EM QUESTÃO. É ASSIM QUE ADICIONAMOS UMA ERROR MESSAGE 'GERAL' A UM DE NOSSOS CHECKS...
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(), ////VAI REMOVER TODOS OS WHITE SPACES DO PASSWORD inputtado...
    // body('confirmPassword').equals(req.body.password).withMessage('Passwords do not match.') /////APPROACH QUE NÃO FUNCIONA/NÃO FUNCIONARÁ. --> DEVEMOS USAR O APPROACH DO 'cusotm validator' visto logo abaixo...

    body('confirmPassword')
      .custom(
        ///aqui usamos um CUSTOM VALIDATOR (validator escrito por nós, lógica escrita por nós) PARA __ CHECAR__ SE OS FIELDS DE 'password' e 'confirmPassword' realmente MATCHEIAM...
        (value, { req, loc, path }) => {
          if (value !== req.body.password) {
            console.log('ENTERED');
            throw new Error('Passwords do not match.');
          } else {
            console.log(value, req.body.confirmPassword);
            console.log('TEST');
            return true;
          }
        }
      )
      .trim(),
  ],

  //body('password').isLength({min: 6}) //// 'body()' tem o MESMO EFEITO DE 'check()', aqui, MAS A DIFERENÇA É QUE _ ELE É MAIS ESPECÍFICO; ELE _ VAI __ PROCURAR 'values' de seus input fields __ APENAS___ NO BODY__ DO SEU REQUEST, e não em todos os lugares (params, body, cookies, header, queryparams), como faz o CHECK() geral...
  authController.postSignup
);

router.get('/reset-password', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

router.get('/reset-password/:token', authController.getNewPasswordPage);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
