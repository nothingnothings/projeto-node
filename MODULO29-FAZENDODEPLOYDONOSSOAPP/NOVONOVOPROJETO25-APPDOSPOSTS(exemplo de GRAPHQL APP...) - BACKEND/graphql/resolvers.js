const User = require('../models/user'); //NÓS AINDA VAMOS TRABALHAR COM MODELS MONGOOSE NESSE ARQUIVO DE 'GRAPHQL'/projetos graphql... (principalmente nos nossos  RESOLVERS)....

const Post = require('../models/post');

const ObjectId = require('mongodb').ObjectId;

const validator = require('validator'); ///VAMOS USAR ISTO NO LUGAR DE 'EXPRESS-VALIDATOR' (e vamos escrever essa lógica de VALIDATE INPUT aqui nesse arquivo 'resolvers', e NÃO LÁ NAS NOSSAS ROUTES, COMO FAZÍAMOS no app NODEEXPRESS CLÁSSICO e REST API....)
///fazemos esse validate por meio de SIMPLES IF STATEMENTS...

const { hash, compare } = require('bcryptjs');

const fs = require('fs');

const ITEMS_PER_PAGE = 5; ///usado na pagination...

const jwt = require('jsonwebtoken');

//////OBS: É NESTE ARQUIVO 'RESOLVERS' (nos resolvers) que vamos ESCREVER A VALIDATION PARA CADA 1 DOS INPUTS NOS REQUESTS__ DOS USERS, em suas queries... --> FAZEMOS ESSE VALIDATION NOS 'RESOLVERS' __ JUSTAMENTE__ PQ O PACOTE 'express-validator' __ NÃO FUNCIONA__ COM 'GRAPHQL' (pq o express-validator DEPENDE DA EXISTÊNCIA DE __ MÚLTIPLAS ROUTES/ENDPOINTS, AO PASSO QUE NO __ GRAPHQL __ TEMOS/TEREMOS __ SEMPRE APENAS 1 ÚNICO ENDPOINT, ENDPOINT DE 'POST /graphql'...)

module.exports = {
  hello() {
    return 'Hello World!';
  },

  hello2() {
    return {
      textTest: 'TESTANDO',
      views: 12321480,
    };
  },

  //    createuser(args, req) {  ///sintaxe _ NORMAL___ (SEM ASYNC/AWAIT OPERATIONS)...
  //        //////EM QUERIES/MUTATIONS/SUBSCRIPTIONS MAIS COMPLEXAS (tanto get, como post, patch, delete, etc etc), VAMOS TER ARGUMENTOS SENDO PASSADOS A NOSSOS METÓDOS, ARGUMENTOS QUE SÃO DEFINIDOS LÁ NO NOSSO 'SCHEMA', by the way.... (e aí, vamos ter esses 2 argumentos, o argumento 'args', ARGUMENTS, e o ARGUMENTO 'req', QUE É O __ OBJETO REQUEST__ EM SI)...

  //         const { name, email, password } = args.userInput; ///ver nosso SCHEMA para perceber que temos esse objeto aí no interior de 'args', pq é isso que definimos lá no schema...

  //         const user = await new User(
  //             {
  //                 name: name,
  //                 email: email,
  //                 password: password
  //             }
  //         )

  //         const savedUser = await user.save();

  //     }

  createUser: async function (args, req) {
    ///sintaxe _ ANORMAL__ (COM ASYNC/AWAIT OPERATIONS)... --> PREFIRA ESTA SINTAXE, POIS É MAIS LIMPA... --> é opcional, mas é melhor.

    //////EM QUERIES/MUTATIONS/SUBSCRIPTIONS MAIS COMPLEXAS (tanto get, como post, patch, delete, etc etc), VAMOS TER ARGUMENTOS SENDO PASSADOS A NOSSOS METÓDOS, ARGUMENTOS QUE SÃO DEFINIDOS LÁ NO NOSSO 'SCHEMA', by the way.... (e aí, vamos ter esses 2 argumentos, o argumento 'args', ARGUMENTS, e o ARGUMENTO 'req', QUE É O __ OBJETO REQUEST__ EM SI)...

    const { name, email, password } = args.userInput; ///ver nosso SCHEMA para perceber que temos esse objeto aí no interior de 'args', pq é isso que definimos lá no schema...

    const errors = [];

    console.log(password);

    if (!validator.isEmail(email) || validator.isEmpty(email)) {
      ////EIS O CÓDIGO DE __'VALIDATE INPUT' de PROJETOS GRAPHQL... (depende da package de 'validator', que usa o mesmo RULESET DO 'express-validator'...).
      errors.push({ message: 'E-mail is invalid!' });
    }

    if (validator.isEmpty(password)) {
      ////OBS: nunca use 'validator.isString()', PQ _ _ TODOS NOSSOS INPUT FIELDS SEMPRE SERÃO CONSIDERADOS __ COMO __ STRINGS_ pelo 'validator' package... (por isso, não existe essa função '.isString()')...
      errors.push({ message: 'Password is invalid!' });
    }

    if (!validator.isLength(password, { min: 6 })) {
      errors.push({ message: 'Password is too short!' });
    }

    if (errors.length > 0) {
      // const error = new Error(errors[0].message); ///vai retornar a 'message' property NO PRIMEIRO 'error' object no nosso array.... (assim entregamos mais information acerca do validation error ao useR).... ---> esse código dá mais info que o throw GENÉRICO do professor...
      // const error = new Error('Invalid input'); ///throw genérico de error, se for constatado QUALQUER ERRO DE INPUT, nas hipóteses acima....

      const error = new Error('Invalid input!');
      error.data = errors; ///vamos armazenar o ARRAY DOS ERROS DE VALIDATION DO NOSSO RUNTIME nessa propriedade de 'data', se quisermos... (na verdade, podemos armazenar o QUE QUISERMOS, essa é só uma recomendação)...
      error.code = 422; ///exemplo de como podemos SETTAR O CODE QUE QUISERMOS, DATA QUE QUISERMOS, nesses errors....

      throw error;
    }

    const foundUser = await User.findOne({ email: email });

    if (foundUser) {
      const error = new Error(
        'An user for that email already exists on the database, please choose another one.'
      );
      throw error;
    }

    const hashedPassword = await hash(password, 12);

    //  const user = await new User(
    const user = new User({ ///talvez esse '''await'''' não seja necessário, com essa INSTANCIAÇÃO...
      name: name,
      email: email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    return {
      ///devemos seguir o SCHEMA de 'createUser', que demanda QUE SEJA RETORNADO UM OBJETO 'User' COM UM DETERMINADO __ LAYOUT__...
      ...savedUser._doc, /////'._doc' FAZ COM QUE TODAS AS PROPRIEDADES/DATA __ 'REAL' DESSE DOCUMENT SEJAM __ RETORNADAS (ou seja, DEIXAMOS DE LADO A 'METADATA' DESSE DOCUMENT, QUE SERÁ INÚTIL PARA __ O FIM DE 'RETURN SOME DATA TO THE USER; RETURN THE DATA OF THE USER THAT WAS CREATED, TO THE USER'...)
      _id: savedUser._id.toString(), ///esse field LÁ NO NOSSO 'TYPE' DE USER, LÁ NO SCHEMA DO GRAPHQL, está como 'STRING', por isso precisamos CONVERTER ESSE _id de valor 'ObjectId()', LÁ DA DATABASe_, PARA UM FORMATO __ 'string'....
    };

    // return 'String';
  },

  //  createUser2: async function(args, req) {  ///sintaxe _ ANORMAL__ (COM ASYNC/AWAIT OPERATIONS)... --> PREFIRA ESTA SINTAXE, POIS É MAIS LIMPA... --> é opcional, mas é melhor.

  //     //////EM QUERIES/MUTATIONS/SUBSCRIPTIONS MAIS COMPLEXAS (tanto get, como post, patch, delete, etc etc), VAMOS TER ARGUMENTOS SENDO PASSADOS A NOSSOS METÓDOS, ARGUMENTOS QUE SÃO DEFINIDOS LÁ NO NOSSO 'SCHEMA', by the way.... (e aí, vamos ter esses 2 argumentos, o argumento 'args', ARGUMENTS, e o ARGUMENTO 'req', QUE É O __ OBJETO REQUEST__ EM SI)...

  //      const { name, email, password } = args.userInput; ///ver nosso SCHEMA para perceber que temos esse objeto aí no interior de 'args', pq é isso que definimos lá no schema...

  //     const foundUser = await User.findOne({email: email});

  //     if (foundUser) {
  //             const error = new Error('An user for that email already exists on the database, please choose another one.');
  //             throw error;
  //     }

  //     const hashedPassword = await hash(password, 12);

  //     //  const user = await new User(
  //         const user = new User( ///talvez esse '''await'''' não seja necessário, com essa INSTANCIAÇÃO...
  //          {
  //              name: name,
  //              email: email,
  //              password: hashedPassword
  //          }
  //      )

  //      const savedUser = await user.save();

  //      return { ///devemos seguir o SCHEMA de 'createUser', que demanda QUE SEJA RETORNADO UM OBJETO 'User' COM UM DETERMINADO __ LAYOUT__...
  //          ...savedUser._doc, /////'._doc' FAZ COM QUE TODAS AS PROPRIEDADES/DATA __ 'REAL' DESSE DOCUMENT SEJAM __ RETORNADAS (ou seja, DEIXAMOS DE LADO A 'METADATA' DESSE DOCUMENT, QUE SERÁ INÚTIL PARA __ O FIM DE 'RETURN SOME DATA TO THE USER; RETURN THE DATA OF THE USER THAT WAS CREATED, TO THE USER'...)
  //             _id: savedUser._id.toString(), ///esse field LÁ NO NOSSO 'TYPE' DE USER, LÁ NO SCHEMA DO GRAPHQL, está como 'STRING', por isso precisamos CONVERTER ESSE _id de valor 'ObjectId()', LÁ DA DATABASe_, PARA UM FORMATO __ 'string'....

  //         }

  //     // return 'String';

  //  }

  loginUser: async function (args, req) {
    ///escrita recomendada dessa função...

    console.log(args);
    //    const { email, password } = args; //com isso, ficaremos com esses DOIS VALORES ARMAZENADOS EM CONSTS...

    const errors = [];

    const user = await User.findOne({ email: args.email });

    if (!user) {
      errors.push({
        message: 'No user could be found for that email',
        statusCode: 404,
      });
    }

    if (!validator.isEmail(args.email) || validator.isEmpty(args.email)) {
      ////EIS O CÓDIGO DE __'VALIDATE INPUT' de PROJETOS GRAPHQL... (depende da package de 'validator', que usa o mesmo RULESET DO 'express-validator'...).
      errors.push({ message: 'E-mail is invalid!' });
    }

    if (validator.isEmpty(args.password)) {
      ////OBS: nunca use 'validator.isString()', PQ _ _ TODOS NOSSOS INPUT FIELDS SEMPRE SERÃO CONSIDERADOS __ COMO __ STRINGS_ pelo 'validator' package... (por isso, não existe essa função '.isString()')...
      errors.push({ message: 'Password is invalid!' });
    }

    if (!validator.isLength(args.password, { min: 6 })) {
      errors.push({ message: 'Password is too short!' });
    }

    if (errors.length > 0) {
      const error = new Error('Invalid data entered!');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const passwordCompareResult = await compare(args.password, user.password);

    if (!passwordCompareResult) {
      const error = new Error('Invalid password entered!');
      error.data = errors;
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        _id: user._id.toString(),
      },
      'zVzS42wNmzOOmlRgYCNWE1dxTH4n_sL6JuDnNj2srF2B7YxRsAgVmvqO8z14Wd3nzOqXzseBAjJ7PA5RSzjs0GsdrR5nxrVu8NPQJjooJLq2GqEl4h9JxwJ8zg5d_Fl2l3Q3n8yf13Gydum25V3mYRUy--L1EskSMs2PcEXLOJM', //private key/secret ---> SERÁ CONHECIDA APENAS PELO SERVER...
      {
        expiresIn: '1h',
      }
    );

    // console.log(user._id);
    // console.log(token);

    return {
      //acho que será assim o retorno de nossa data, mas não tenho certeza...
      userId: user._id.toString(),
      token: token,
    };
  },

  createPost: async function (args, req) {
    // console.log(req.isAuth, 'LINESAHDSUU');
    if (!req.isAuth) {
      ///informação (propriedade) que existirá/será enfiada no nosso objeto request POR _ MEIO _ DE __ NOSSA TOKEN, e POR MEIO DO MIDDLEWARE DE 'is-auth-graphql.js'... ---> ver 'app.js', trecho logo acima do MIDDLEWARE QUE DEFINE NOSSA ÚNICA ROUTE DO GRAPHQL (app.use('/graphql')....)
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    const errors = [];

    if (
      validator.isEmpty(args.userInput.title) ||
      !validator.isLength(args.userInput.title, { min: 6 })
    ) {
      ////EIS O CÓDIGO DE __'VALIDATE INPUT' de PROJETOS GRAPHQL... (depende da package de 'validator', que usa o mesmo RULESET DO 'express-validator'...).
      errors.push({
        message: 'Please insert a valid title, with more than 6 characters.',
      });
    }

    if (
      validator.isEmpty(args.userInput.content) ||
      !validator.isLength(args.userInput.content, { min: 6 })
    ) {
      ////OBS: nunca use 'validator.isString()', PQ _ _ TODOS NOSSOS INPUT FIELDS SEMPRE SERÃO CONSIDERADOS __ COMO __ STRINGS_ pelo 'validator' package... (por isso, não existe essa função '.isString()')...
      errors.push({
        message: 'Please input valid content, with more than 6 characters.',
      });
    }

    if (errors.length > 0) {
      const error = new Error('Invalid data entered!');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    // console.log(args.userInput);

    // console.log(req.userId, 'LINEdzxc');

    const post = new Post({
      title: args.userInput.title,
      content: args.userInput.content,
      imageUrl: args.userInput.imageUrl, ///talvez o mesmo funcionamento do Multer?
      creator: {
        userId: ObjectId(req.userId), ///extraído do TOKEN, que vai ter ficado armazenado no request object....
      },
      //updatedAt e createdAt vão ser criados/addados __ AUTOMATICAMENTE PELO MONGOOSE, por conta de 'timestamps: true'. Mesma coisa com '_id' desse post....
    });

    const savedPost = await post.save();

    console.log(savedPost, 'LINE');

    // console.log(ObjectId(req.userId));

    const user = await User.findOne({ _id: ObjectId(req.userId) });

    console.log(user, 'LINESAFASF');

    if (!user) {
      const error = new Error('Invalid user.');
      error.code = 401;
      throw error;
    }

    // user.posts.push( //não está funcionando, no GRAPHQL world... --> professor diz que nós REALMENTE FIZEMOS 'push' do array aqui, mas que nós NUNCA 'SAVED THAT CHANGE'... (ué, mas eu salvei logo abaixo...).
    //     {
    //         postId: ObjectId(post._id),
    //       }
    // );

    // user.addPost(post);

    user.posts.push({
      postId: ObjectId(post._id),
    });

    const savedUser = await user.save();

    console.log(savedUser.name, 'LINE22');

    // console.log(post);


    console.log(savedPost);

    return {

        ...savedPost._doc,
        title: savedPost.title,
        _id: savedPost._id.toString(), //para evitar o return do id do post NA FORMA DE UM OBJETO, vamos OVERWRITTAR O VALOR DESSE ID OBJETO POR SUA FORMA 'string'....
        createdAt: savedPost.createdAt.toISOString(), //mesma coisa; o formato 'DATE TYPE', usado pelo mongoose, NÃO É RECONHECIDO PELA GRAPHQL API __ COMO __ SENDO UMA VALID STRING (String!), por isso temos que o converter por meio de 'toISOString()'...
        updatedAt: savedPost.updatedAt.toISOString(),
        creator: {
          name: savedUser.name,
          _id: savedUser._id.toString()
        }
        // creator: {
        //   name: savedUser.name,
        //   _id: savedUser._id.toString(),
        //   posts: savedUser.posts
        // },
      }
  },








  getPosts: async function (args, req) {

    const errors = [];

    if (!req.isAuth) {
      ///informação (propriedade) que existirá/será enfiada no nosso objeto request POR _ MEIO _ DE __ NOSSA TOKEN, e POR MEIO DO MIDDLEWARE DE 'is-auth-graphql.js'... ---> ver 'app.js', trecho logo acima do MIDDLEWARE QUE DEFINE NOSSA ÚNICA ROUTE DO GRAPHQL (app.use('/graphql')....)
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }

    const pageNumber = args.pageNumber || 1; //extraído de nossa QUERY....

    console.log(pageNumber);

    const countedDocuments = await Post.find().countDocuments();

    const neededUserDocuments = await Post.find({}, null, {
      skip: (pageNumber - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
    })
      .populate('creator.userId')
      .sort({ _id: -1 });

    if (!neededUserDocuments) {
      const error = new Error(
        'No posts found in the database, please try again.'
      );
      error.code = 404;
      throw error;
    }

    console.log(errors)

    // console.log(neededUserDocuments[0].createdAt.toISOString(), 'LINE350');

    return {
      posts: neededUserDocuments.map((post) => {
        return {
          ...post._doc, //TUDO, EXCETO ESSAS 3 KEYS/PROPRIEDADES, PERMANECERÁ O MESMO...
          creator: {
            //hotfix...
            name: post.creator.userId.name,
            _id: post.creator.userId._id,
          },
          _id: post._id.toString(), //// DE NOVO, PRECISAMOS TRANSFORMAR essas 3 propriedades, pois seus data types MONGOOSE (ObjectId e DATETYPE) não SÃO/SERÃO RECONHECIDOS PELO GRPAHQL e seu schema...
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        };
      }),
      totalItems: countedDocuments,
      page: +pageNumber,
    };
  },

  getCreationStatus: async function (args, req) {
    const postId = args.postId;

    const userId = args.userId;

    console.log(postId);

    const foundPost = await Post.findOne({
      _id: ObjectId(postId),
    });

    console.log(foundPost);

    if (!foundPost) {
      const error = new Error('Post could not be found');
      error.code = 404;
      throw error;
    }

    const foundUser = await User.findOne({
      _id: ObjectId(userId),
    });

    console.log(foundUser);

    if (foundUser._id.toString() === foundPost.creator.userId.toString()) {
      console.log(
        'ENTERED',
        foundUser._id.toString(),
        foundPost.creator.userId.toString()
      );
      return {
        created: true,
      };
    } else {
      return {
        created: false,
      };
    }
  },

  getPost: async function (args, req) {

    if (!req.isAuth) {
        ///informação (propriedade) que existirá/será enfiada no nosso objeto request POR _ MEIO _ DE __ NOSSA TOKEN, e POR MEIO DO MIDDLEWARE DE 'is-auth-graphql.js'... ---> ver 'app.js', trecho logo acima do MIDDLEWARE QUE DEFINE NOSSA ÚNICA ROUTE DO GRAPHQL (app.use('/graphql')....)
        const error = new Error('Not authenticated!');
        error.code = 401;
        throw error;
      }


    const postId = args.postId;

    const singlePost = await Post.findOne({ _id: ObjectId(postId) }).populate('creator.userId')

    if (!singlePost) {
      const error = new Error('Could not find post.');
      error.code = 404;
      throw error;
    }

    return {
        title: singlePost.title,
        imageUrl: singlePost.imageUrl,
        content: singlePost.content,
        createdAt: singlePost.createdAt.toISOString(),
        creator: {
            name: singlePost.creator.userId.name
        }
    };
  },



  updatePost: async function(args, req) {
    const errors = [];
        
    if (!req.isAuth) {
        ///informação (propriedade) que existirá/será enfiada no nosso objeto request POR _ MEIO _ DE __ NOSSA TOKEN, e POR MEIO DO MIDDLEWARE DE 'is-auth-graphql.js'... ---> ver 'app.js', trecho logo acima do MIDDLEWARE QUE DEFINE NOSSA ÚNICA ROUTE DO GRAPHQL (app.use('/graphql')....)
        const error = new Error('Not authenticated!');
        error.code = 401;
        throw error;
      }

      const postId = args.postId;


      const userId = req.userId;

      console.log(userId, 'LINERSZ')
      
      const post = await Post.findOne({_id: ObjectId(postId)}).populate('creator.userId')

      if (!post) {
        const error = new Error('Could not find post.');
        error.code = 404;
        throw error;
      }

      console.log(post.creator.userId._id.toString(), 'SSSSS');

      if(post.creator.userId._id.toString() !== userId.toString()) {
        const error = new Error('Your user was not responsible for that post');
        error.code = 403;
        throw error;
      }

      if (
        validator.isEmpty(args.userInput.title) ||
        !validator.isLength(args.userInput.title, { min: 6 })
      ) {
        ////EIS O CÓDIGO DE __'VALIDATE INPUT' de PROJETOS GRAPHQL... (depende da package de 'validator', que usa o mesmo RULESET DO 'express-validator'...).
        errors.push({
          message: 'Please insert a valid title, with more than 6 characters.',
        });
      }
  
      if (
        validator.isEmpty(args.userInput.content) ||
        !validator.isLength(args.userInput.content, { min: 6 })
      ) {
        ////OBS: nunca use 'validator.isString()', PQ _ _ TODOS NOSSOS INPUT FIELDS SEMPRE SERÃO CONSIDERADOS __ COMO __ STRINGS_ pelo 'validator' package... (por isso, não existe essa função '.isString()')...
        errors.push({
          message: 'Please input valid content, with more than 6 characters.',
        });
      }
  
      if (errors.length > 0) {
        const error = new Error('Invalid data entered!');
        error.data = errors;
        error.code = 422;
        throw error;
      }


      post.title = args.userInput.title;
      post.content = args.userInput.content;


      if (args.userInput.imageUrl !== 'undefined') {  
        console.log(args.userInput);
        post.imageUrl = args.userInput.imageUrl;
      }





      const savedPost = await post.save();


      console.log(savedPost, 'LINE');

      console.log(
          {
              ...savedPost._doc
          },
          'LINE25'
      )


      const user = await User.findOne({_id: ObjectId(userId)}).populate()



      if (!user) {
        const error = new Error('User could not be found.');
        error.code = 404;
        throw error;
      }




      const editedPosts = user.posts.map(
        (post) => {
            return {
              ...post, 
              // title: savedPost.title //fix podre.
            }
        }
      )

      console.log(editedPosts);

      return {
            ...savedPost._doc,
            _id: savedPost._id.toString(),
            createdAt: savedPost.createdAt.toISOString(),
            updatedAt: savedPost.updatedAt.toISOString(),
            creator: {
                name: savedPost.creator.userId.name,
                posts: editedPosts
            }
      }

  },






  deletePost: async function(args, req) {


    const errors = [];
        
    if (!req.isAuth) {
        ///informação (propriedade) que existirá/será enfiada no nosso objeto request POR _ MEIO _ DE __ NOSSA TOKEN, e POR MEIO DO MIDDLEWARE DE 'is-auth-graphql.js'... ---> ver 'app.js', trecho logo acima do MIDDLEWARE QUE DEFINE NOSSA ÚNICA ROUTE DO GRAPHQL (app.use('/graphql')....)
        const error = new Error('Not authenticated!');
        error.code = 401;
        throw error;
      }


      const postId = args.postId;

      const userId = req.userId;



      console.log(userId, 'USERSID');



      const post = await Post.findOne({_id: ObjectId(postId)});

      if (!post) {
        const error = new Error('Could not find post.');
        error.code = 404;
        throw error;
      }


      if(post.creator.userId.toString() !== userId.toString()) {
        const error = new Error('Your user was not responsible for that post');
        error.code = 403;
        throw error;
      }

      fs.unlink(post.imageUrl, (err) => {
        console.log(err);
      });

     const removedPost = await Post.findByIdAndRemove(postId); //isto já vai chamar 'save' para nós, nessa collection de 'Posts'...


      console.log(removedPost, 'XXXXXXXX');


     const user = await User.findById(userId);

     user.posts.pull(postId);

     await user.save();



     return postId;


  },




  getStatus: async function(args, req) {

    const errors = [];
        
    if (!req.isAuth) {
        ///informação (propriedade) que existirá/será enfiada no nosso objeto request POR _ MEIO _ DE __ NOSSA TOKEN, e POR MEIO DO MIDDLEWARE DE 'is-auth-graphql.js'... ---> ver 'app.js', trecho logo acima do MIDDLEWARE QUE DEFINE NOSSA ÚNICA ROUTE DO GRAPHQL (app.use('/graphql')....)
        const error = new Error('Not authenticated!');
        error.code = 401;
        throw error;
      }



    const userId = req.userId;

    const user = await User.findOne({ _id: ObjectId(userId) });

    if (!user) {
      const error = new Error('User not found.');
      error.code = 404;
      throw error;
    }

    return user.status;

  },




  updateUserStatus: async function(args, req) {


    
    const errors = [];
        
    if (!req.isAuth) {
        ///informação (propriedade) que existirá/será enfiada no nosso objeto request POR _ MEIO _ DE __ NOSSA TOKEN, e POR MEIO DO MIDDLEWARE DE 'is-auth-graphql.js'... ---> ver 'app.js', trecho logo acima do MIDDLEWARE QUE DEFINE NOSSA ÚNICA ROUTE DO GRAPHQL (app.use('/graphql')....)
        const error = new Error('Not authenticated!');
        error.code = 401;
        throw error;
      }

      const userId = req.userId;

      const user = await User.findOne({ _id: ObjectId(userId) });


      if (!user) {
        const error = new Error('User not found.');
        error.code = 404;
        throw error;
      }


      user.status = args.status;




      const savedUser = await user.save();



      if(
        !savedUser
      ) {
        return 'FAILED';
      } else {
        return user.status
      }
  }
};

//VER ARQUIVO 'schema' para ver POSSIBILIDADES DE VALUES QUE PODEM SER RETORNADOS NESSAS QUERIES/METHODS nesse objeto 'resolver'...
