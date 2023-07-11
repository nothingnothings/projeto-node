const express = require('express');

const router = express.Router();

const { body } = require('express-validator');

const authController = require('../controllers/auth');




const User = require('../models/user');

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Inputted email is not valid')
      .custom((value, { req }) => {
        ////EIS O CÓDIGO EM QUESTÃO. //////ESSE BLOCO '.custom()' É UM __ EXEMPLO DE ' ASYNC VALIDATION'.. --> para mais informações, VER AULA 291, adding async validation.... (é async validation pq NOSSO APP VAI QUERER CONTATAR A DATABASE PARA CHECAR SE O EMAIL INPUTTADO PELO USER JÁ NÃO EXISTE DENTRO DE 1 USER PRÉVIO, O QUE O TORNARIA INVÁLIDO/INUSÁVEL...)

        console.log(value);
        return User.findOne({ email: value }).then((user) => {
          console.log(user);
          if (user) {
            console.log(user, 'LINE');
            return Promise.reject(
              'An user with the chosen email already exists, please choose another one.'
            );
          } else {
            return value;
          }
        });
      })
      .normalizeEmail(), ///vai fazer com que não exista diferenciação entre LOWER e UPPERCASE....
    body('password')
      .trim()
      .isLength({ min: 7 })
      .withMessage('Your password has to have at least 7 characters.')
      .not()
      .isEmpty()
      .withMessage('You must input a password'),
    body('confirmPassword')
      .custom(
        ///aqui usamos um CUSTOM VALIDATOR (validator escrito por nós, lógica escrita por nós) PARA __ CHECAR__ SE OS FIELDS DE 'password' e 'confirmPassword' realmente MATCHEIAM...
        (value, { req, loc, path }) => {
          if (value !== req.body.password) {
            console.log('ENTERED');
            throw new Error('Passwords do not match.');
          } else {
            return true;
          }
        }
      )
      .trim(),
    body('name')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Your name has to have at least 6 characters.')
      .isString()
      .withMessage('Invalid name.')
      .not()
      .isEmpty()
      .withMessage('You must input a name'),
  ],

  authController.signup
);

// router.post('/login');




router.post('/login', authController.login);

// router.get('/status/:userId');

///EDIT STATUS

// router.patch('/status/:userId', )

module.exports = router;
