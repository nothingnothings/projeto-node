const User = require('../models/user');

const { validationResult } = require('express-validator');

const { hash, compare } = require('bcryptjs');

const jwt = require('jsonwebtoken'); //necessário para o generate de JSON WEB TOKENS, para authenticate o user...
const { ObjectId } = require('mongodb');

// exports.signup = (req, res, next) => { ////versão sem async/await...

//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed.');
//     error.statusCode = 422;
//     error.data = errors.array(); ///array com todos os errors ocorridos durante o validation.... ////esse pass de errors é totalmente opcional, mas é bom se você quer que o user/desenvolvedores tenham o array de errors na response, quando errors ocorrerem....
//     throw error; //será capturado por nosso MAIN ERROR HANDLING MIDDLEWARE, lá em 'app.js'...
//   }

//   const email = req.body.email;
//   const name = req.body.name;
//   const password = req.body.password;

//   hash(password, 12)
//     .then((hashedPassword) => {
//       const user = new User({
//         email: email,
//         name: name,
//         password: hashedPassword,
//       });

//       return user.save(); ///retornamos para usar o then block subsequente....
//     })
//     .then((result) => {
//       console.log(result);
//       res.status(201).json({
//         message: 'User was created successfully!',
//         userId: result._id,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array(); ///array com todos os errors ocorridos durante o validation.... ////esse pass de errors é totalmente opcional, mas é bom se você quer que o user/desenvolvedores tenham o array de errors na response, quando errors ocorrerem....
      throw error; //será capturado por nosso MAIN ERROR HANDLING MIDDLEWARE, lá em 'app.js'...
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    const hashedPassword = await hash(password, 12);

    // .then((hashedPassword) => {
    const user = new User({
      email: email,
      name: name,
      password: hashedPassword,
      status: 'I am new!'
    });

    const savedUser = await user.save(); ///retornamos para usar o then block subsequente....
    // })
    // .then((result) => {
    // console.log(result);

    res.status(201).json({
      message: 'User was created successfully!',
      userId: savedUser._id,
    });
    // })
  } catch (err) {
    // .catch((err) => {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    // });
  }
};

exports.getUserStatus = async (req, res, next) => {
  const userId = req.userId; ///isso existe no nosso browser se tivermos essa TOKEN...

  try {
    const user = await User.findOne({ _id: ObjectId(userId) });

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      status: user.status,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  const userId = req.userId;
  console.log(userId);
  const newStatus = req.body.status;

  console.log(newStatus);

  try {
    const user = await User.findOne({ _id: ObjectId(userId) });

    if (!user) {
      const error = new Error('User could not be found');
      error.statusCode = 404;
      throw error;
    }

    user.status = newStatus;

    const savedUser = await user.save();
    res.status(200).json({ message: 'User status updated.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

// exports.login = (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   let loadedUser;

//   User.findOne({ email: email })
//     .then((user) => {
//       if (!user) {
//         const error = new Error(
//           'No user could be found for the entered email.'
//         );
//         error.statusCode = 404;
//         throw error;
//       }
//       loadedUser = user; ///aqui armazenamos a data de nosso user naquela variável inicial... vamos o utilizar mais para baixo, em execuções dentro dessa promise chain...
//       return compare(password, user.password);
//     })
//     .then((isEqual) => {
//       if (!isEqual) {
//         const error = new Error('Invalid Password. Please try again.');
//         error.statusCode = 401; //'unauthenticated'...
//         throw error;
//       } else {
//         const token = jwt.sign(

//           {
//               ///// PRIMEIRO ARGUMENTO = DATA QUE VOCê QUER QUE SEJA RETORNADA, NA SUA JSON WEB TOKEN, AO USER (nunca coloque o hashedPassword, essa é a única regra... common practice é retornar o email...) --> aqui retornamos o 'userId' pq vamos o utilizar em coisas como 'deletePost'...
//             email: loadedUser.email,
//             userId: loadedUser._id,
//           },  //////SEGUNDO ARGUMENTO = 'SECRET', OU A 'PRIVATE KEY' usada no GENERATE DA ASSINATURA (signature) dessa JSON WEB TOKEN --> É BOM USAR STRINGS ALEATÓRIAS E BEM LONGAS, para deixar seguro.... use o site mkjwk.org....
//           'zVzS42wNmzOOmlRgYCNWE1dxTH4n_sL6JuDnNj2srF2B7YxRsAgVmvqO8z14Wd3nzOqXzseBAjJ7PA5RSzjs0GsdrR5nxrVu8NPQJjooJLq2GqEl4h9JxwJ8zg5d_Fl2l3Q3n8yf13Gydum25V3mYRUy--L1EskSMs2PcEXLOJM', //private key/secret ---> SERÁ CONHECIDA APENAS PELO SERVER...
//           {
//             ////TERCEIRO ARGUMENTO, ARGUMENTO DE OPTIONS...
//             //////TERCEIRO ARGUMENTO = 'OBJETO CONFIG' --> você define CARACTERÍSTICAS DESSA WEBTOKEN: quando ela deve expirar,
//             expiresIn: '1h', ///JSON WEB TOKEN VAI EXPIRAR EM 1 HORA... (no browser do user...) --> boa medida de segurança, pq aí se o token do user, no browser do user, for roubado por um user malicioso, essa token logo expirará, em 1 hora....
//           }
//         );

//         res.status(200).json({
//           token: token, //vamos querer enviar isso ao nosso frontend, para que seja armazenada...
//           userId: loadedUser._id.toString(), ///também vamos querer enviar isso ao nosso frontend, para que seja armazenado.... (e então utilizado no frontend/app react)....
//         });
//       }
//     })
//     .catch((err) => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }

//       next(err);
//     });
// };

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    const user = await User.findOne({ email: email });
    // .then((user) => {
    if (!user) {
      const error = new Error('No user could be found for the entered email.');
      error.statusCode = 404;
      throw error;
    }

    // loadedUser = user; ///aqui armazenamos a data de nosso user naquela variável inicial... vamos o utilizar mais para baixo, em execuções dentro dessa promise chain...
    const passwordsAreEqual = await compare(password, user.password);
    // })
    // .then((isEqual) => {

    if (!passwordsAreEqual) {
      const error = new Error('Invalid Password. Please try again.');
      error.statusCode = 401; //'unauthenticated'...
      throw error;
    } else {
      const token = jwt.sign(
        //não é código async....
        {
          ///// PRIMEIRO ARGUMENTO = DATA QUE VOCê QUER QUE SEJA RETORNADA, NA SUA JSON WEB TOKEN, AO USER (nunca coloque o hashedPassword, essa é a única regra... common practice é retornar o email...) --> aqui retornamos o 'userId' pq vamos o utilizar em coisas como 'deletePost'...
          email: user.email,
          userId: user._id,
        }, //////SEGUNDO ARGUMENTO = 'SECRET', OU A 'PRIVATE KEY' usada no GENERATE DA ASSINATURA (signature) dessa JSON WEB TOKEN --> É BOM USAR STRINGS ALEATÓRIAS E BEM LONGAS, para deixar seguro.... use o site mkjwk.org....
        'zVzS42wNmzOOmlRgYCNWE1dxTH4n_sL6JuDnNj2srF2B7YxRsAgVmvqO8z14Wd3nzOqXzseBAjJ7PA5RSzjs0GsdrR5nxrVu8NPQJjooJLq2GqEl4h9JxwJ8zg5d_Fl2l3Q3n8yf13Gydum25V3mYRUy--L1EskSMs2PcEXLOJM', //private key/secret ---> SERÁ CONHECIDA APENAS PELO SERVER...
        {
          ////TERCEIRO ARGUMENTO, ARGUMENTO DE OPTIONS...
          //////TERCEIRO ARGUMENTO = 'OBJETO CONFIG' --> você define CARACTERÍSTICAS DESSA WEBTOKEN: quando ela deve expirar,
          expiresIn: '1h', ///JSON WEB TOKEN VAI EXPIRAR EM 1 HORA... (no browser do user...) --> boa medida de segurança, pq aí se o token do user, no browser do user, for roubado por um user malicioso, essa token logo expirará, em 1 hora....
        }
      );

      res.status(200).json({
        token: token, //vamos querer enviar isso ao nosso frontend, para que seja armazenada...
        userId: user._id.toString(), ///também vamos querer enviar isso ao nosso frontend, para que seja armazenado.... (e então utilizado no frontend/app react)....
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
  // .catch((err) => {

  // });
};

///TERCEIRO ARGUMENTO DE 'jwt.sign()'... argumento de OPTIONS....

// options:

// algorithm (default: HS256)
// expiresIn: expressed in seconds or a string describing a time span vercel/ms.
// Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default ("120" is equal to "120ms").

// notBefore: expressed in seconds or a string describing a time span vercel/ms.
// Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default ("120" is equal to "120ms").

// audience
// issuer
// jwtid
// subject
// noTimestamp
// header
// keyid
// mutatePayload: if true, the sign function will modify the payload object directly. This is useful if you need a raw reference to the payload after claims have been applied to it but before it has been encoded into a token.
