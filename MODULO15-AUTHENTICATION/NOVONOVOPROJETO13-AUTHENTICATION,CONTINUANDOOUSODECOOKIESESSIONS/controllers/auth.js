const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLoginPage = (req, res, next) => {
  // console.log(req.get('Cookie')); ///VAI CONSOLE LOGGAR TODOS OS COOKIES settados por meio do header 'Set-Cookie' (que pode ser encontrado naquele controller ali de baixo...)

  // console.log(req.get('Cookie').trim().split('=')[1]); //manipulação do COOKIE QUE NOS INTERESSA... código meio subóptimo.

  // const isLoggedIn = req.get('Cookie').trim().split('=')[1];

  // console.log(req.session);


  // console.log(req.flash('error'), 'LINE');

  // console.log(typeof req.flash('error')) 

  ///use as messages do flash-connect assim, __EXTRAIA-AS ANTES USANDO uma variável (armazene o valor de 'req.flash('nomeDeSeuError')' ), PARA ENTÃO SER POSSÍVEL O SET DE RENDERS CONDICIONAIS nas paginas a que você redirecionar...
let message = req.flash('error'); /////USO DE 'flash-connection'... particularmente, do método 'req.flash()', que é SEU __cORE METHOD.... -----> AQUI NÓS VAMOS __ UTILIZAR__ a message/error message armazenada na key de 'error' DENTRO DE NOSSA SESSION (o store dessas error messages na session do user é mt efetivo PQ __ PODEMOS __ USAR a data das sessions AO LONGO DE REQUESTS DISTINTOS.... isso quer dizer que a DATA PERSISTE, pode ser usada em QUALQUER PAGE DE NOSSO APP, para fazer o ERROR HANDLING junto de REDIRECTS... esse é o uso de 'req.flash()' ) -----> OBS: ESSE É O REQ.FLASH() que __ USA__ o 'flash' que você definiu anteriormente... --> para ver a definição de um 'FLASH', veja o controller de 'postLogin', aquele block de 'if(!user)'...

    ///////////////ESTE TRECHO DE CÓDIGO AQUI __ VAI CONSERTAR__ O 'ALWAYS RENDER' de nosso ELEMENTO DE ERRO/div de erro QUE APARECE LÁ na página de 'login' a que somos redirecionados... --> este é um FIX da USAGE do FLASH-CONNECT, que é MEIO BUGADO....
if (message.length > 0) {

  message = message[0];
} else { ////caso NÃO EXISTA NENHUMA MESSAGE dentro de 'error' ( ou seja, user não COMETEU NENHUM ERRO de password/email, o que faz com que o objeto 'error' na sua session FIQUE VAZIO, SEM ELEMENTOS, portanto length de 0...), vamos querer SETTAR SEU VALOR COMO 'NULL', tudo para que SEJA __ EVITADO _ O TRIGGER DE 'if(errorMessage) { <div> }' LÁ NA NOSSA VIEW...

  message = null
}




  res.render(
    'auth/login',

    {
      pageTitle: 'Login',
      path: '/login',
      // errorMessage2: req.flash('error') /////USO DE 'flash-connection'... particularmente, do método 'req.flash()', que é SEU __cORE METHOD.... -----> AQUI NÓS VAMOS __ UTILIZAR__ a message/error message armazenada na key de 'error' DENTRO DE NOSSA SESSION (o store dessas error messages na session do user é mt efetivo PQ __ PODEMOS __ USAR a data das sessions AO LONGO DE REQUESTS DISTINTOS.... isso quer dizer que a DATA PERSISTE, pode ser usada em QUALQUER PAGE DE NOSSO APP, para fazer o ERROR HANDLING junto de REDIRECTS... esse é o uso de 'req.flash()' ) -----> OBS: ESSE É O REQ.FLASH() que __ USA__ o 'flash' que você definiu anteriormente... --> para ver a definição de um 'FLASH', veja o controller de 'postLogin', aquele block de 'if(!user)'...
      errorMessage: message
    
      // isLoggedIn: req.session.isLoggedIn,

      //  isLoggedIn: req.isLoggedIn
      // isLoggedIn: isLoggedIn
      // isLoggedIn: req.session.isLoggedIn
      // isLoggedIn: 'xx'
    }
  );
};

// exports.postLogin = (req, res, next) => { ///CÓDIGO QUE AINDA USAVA O 'DUMMY USER'...
//   User.findById('6178c60a90464c24983b0847') //todos os códigos abaixo SÃO NECESSÁRIOS para armazenar nossa SESSION DATA (uma 'ENTRY' de SESSION, em 'sessions') LÁ NA NOSSA DATABASE... --> essas linhas TAMBÉM VÃO CRIAR 1 'session cookie' no browser do user, AUTOMATICAMENTE.... (e esse session cookie terá um id HASHEADO que corresponderá AO ID da SESSION ARMAZENADA NA DATABASE, tbm por meio deste código aqui....)
//     .then((user) => {
//       // req.isLoggedIn = true; ///É PARTE DE NOSSO 'DUMMY AUTHENTICATION'.... --> BTW: este approach NÃO FUNCIONA, isso pq TODA VZE QUE ENVIARMOS 1 REQUEST e recebermos uma response (req -> res, como vemos aqui mesmo) ,_ _NÓS VAMOS __ PERDER __ TODA A DATA __ QUE FICA DENTRO DO OBJETO REQUEST... ----> a data de 'user', no nosso OBJETO REQUEST nesse nosso app, SÓ fica ''''PERSISTENTE''' pq __ NÓS ESTAMOS SEMPRE O READICIONANDO ao nosso objeto 'request' QUANDO INICIAMOS QUALQUER PAGE DE NOSSO APP, por causa daquele middleware 'app.use()' LÁ EM 'app.js'...

//       // res.setHeader('Set-Cookie', 'loggedIn=true'); ///é isto que SETTARÁ UM 'SESSION COOKIE' (cookie que só sobrevive ATÉ O MOMENTO EM QUE VOCê FECHA O BROWSER --> FECHADO O BROWSER, ESSE COOKIE VAI __ MORRER, PQ ELE NÃO É UM 'PERSISTENT COOKIE', E SIM É UM 'SESSION/TRANSIENT' COOKIE...) ------> E ESSE COOKIE SERÁ EMBUTIDOO _ EM TODOS OS REQUESTS__ QUE VOCê FIZER DESSE BROWSER AQUI... (você pode observar isso lá nos 'HEADERS' de cada request, na aba 'network', no google chrome... --> você acha esse cookie lá em 'Cookie', nos 'Headers'...) -----> MAS ESSE É UM 'SESSION COOKIE' __POBRE___; VOCÊ NÃO DEVE SETTAR COOKIES MANUALMENTE, ASSIM, __QUASE NUNCA__... --> PREFIRA USAR PACKAGES como 'express-session', PACKAGES QUE ___ FAZEM O STORE DE COOKIES __ PARA VOCê, automaticamente....
//       req.session.isLoggedIn = true; //MANEIRA ___ LEGIT__ de SETTAR 1 SESSION COOKIE no browser de seu user... --> é claro que esse approach aí REQUER QUE VOCÊ TENHA A PACKAGE DE 'express-session' JÁ INSTALADA no seu projeto.... (pq só assim o objeto 'session' no objeto 'request' passa a existir)....
//       // ^^^ por meio desse código, FAZEMOS __ O STORE__ DE NOSSA 'SESSION': 1) NA MEMORY DO SEU NODE APP (runtime); 2) NO BROWSER DO USUÁRIO, EM UM COOKIE... (por isso o nome 'session cookie', que é uma SESSION ARMAZENADA DENTRO DE 1 COOKIE.... e esse cookie terá o 'SESSIONID' HASHEADo/encriptado, ao passo que o SERVER/database terá A SESSIONID __ORIGINAL/pura... e esses 2 ids serão MATCHEADOS para identificar o user como AUTOR/correspondente Àquela session...)
//       req.session.user = user; ////vai definir nossa USER DATA lá na SESSION armazenada na database... (essa será a 'SENSITIVE DATA' armazenada no server...)

//       ///mas esse approach da MEMORY é HORRÍVEL, PQ É MT MELHOR ARMAZENAR SUA SESSION EM UMA __ DATABASE, por meio de packages como 'connect-mongodb-session'... --> para armazenar em uma DATABASE, como o mongodb, você deve SETTAR o uso dessa database lá naquele MIDDLEWARE DEFINIDOR DA SESsion, aquele 'app.use(session({store: store}))', LÁ NO APP.JS...
//       // res.setHeader('Set-Cookie', 'loggedIn=true; Expires='); ///com 'Expires', você define QUANTO TEMPO ESSE COOKIE VAI DURAR, NO MÁXIMO (aí ele vai ser removido SE ESSE TEMPO PAASSAR, ou se você FECHAR O BROWSER)... --> AS DATES DEFINIDAS COM ESSE 'Expires=' __DEVEM SEGUIR __ O FORMATO 'HTTP DATE'..
//       // res.setHeader('Set-Cookie', 'loggedIn=true; Max-age=10'); ///faz a mesma coisa que o CONFIG do cookie de cima, estabelece um TEMPO limite de duração para o cookie.... -->> entretanto, a diferença é que com 'Max-Age', nós definimos o TEMPO EM __ SEGUNDOS_ QUE ESSE COOKIE DEVERÁ DURAR...
//       // res.setHeader('Set-Cookie', 'loggedIn=true; Domain=google'); //USADO ___ NO TRACKING__ DE SEUS USERS/VOCê.... --> o domain a que É ENVIADO 1 COOKIE nem sempre precisa ser o mesmo domain QUE O PRODUZIU... (conluio entre empresas, que fazem acordos para te TRACKAR... ---> cookie produzido em 1 site pode acabar SENDO ENVIADO a DESTINO/DOMAIN distinto, como o google e seus servidores.....)
//       // res.setHeader('Set-Cookie', 'loggedIn=true; Secure'); ///SECURE faz com que seu cookie NÃO SEJA SETTADO NO BROWSER do user SE FOR CONSTATADO QUE A PAGE que produz esse cookie NÃO ESTÁ SENDO SERVIDA EM UM FORMATO HTTPS (http secure)...
//       // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly'); ///IMPORTANTE MECANISMO DE SEGURANÇA,  constatado na coluna 'HTTP' (V) da aba 'application', no google devtools --> ESSE ATTRIBUTE no cookie FAZ COM QUE SEJA __ IMPOSSÍVEL __ ALGUÉM USAR 'CLIENTSIDE JAVASCRIPT' para __ALTERAR O VALOR DESSE COOKIE ESPECÍFICO... --> É MUITO IMPORTANTE E UTILIZADO NO COMBATE A CROSS-SITE SCRIPTING ATTACKS, QUE AMEAÇAM NOSSO SERVER...

//       req.session.user.save(
//         //talvez funcione.... (não parece funcionar, mas tudo bem...)
//         () => {
//           //callback function, vai redirecionar APENAS __aPÓS___  o 'SAVE' da session na DATABASE ter ocorrido, e apenas APÓS A SESSION COOKIE CORRESPONDENTE ter sido criada no browser de seu user...
//           res.redirect('/');
//         }
//       );
//     });
// };

exports.postLogin = (req, res, next) => {
  const password = req.body.password;
  const email = req.body.email.toLowerCase(); ///para evitar problemas com '.com' e '.COM' naquela function de '.findOne()'.... (isso pq EMAILS NÃO SÃO CASE-SENSITIVE, não se importam com isso..)

  console.log(email);

  User.findOne({ email: email }).then((user) => {
    console.log(user, 'XX');
    if (!user) {
      req.flash('error', 'Invalid Email.'); ////ISSO FOI/É USADO LÁ NO CONTROLLER DE 'get' '/login', PQ __ É PARA LÁ QUE VAMOS REDIRECIONAR NOSSO USER, e é LÁ QUE VAMOS QUERER __ MOSTRAR__ NOSSA MENSAGEM DE ERRO DIZENDO QUE ELE ERROU O EMAIL/PASSWORD...
      return res.redirect('/login');
    } else {
      // const passwordIsValid = bcrypt.compare(password, user.password)
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          ///result será OU TRUE OU FALSE (pq esse será o RESULTADO de 'bcrypt.compare()', é isso que ele nos retorna...)

          if (result) {
            //JÁ SE __ OS PASSWORDS BATEREM, prosseguiremos com o processo de auth.... caso contrário, mostraremos um erro/aviso dizendo que os passwords estão incorretos...
            
            req.session.isLoggedIn = true;
            req.session.user = user;
           return req.session.save((err) => {
              console.log(err);
              // res.redirect('/');


              return res.redirect('/');
            });
          }  else {
          //esse case FORA DO 'if(result)' é o case em que OS PASSWORDS NÃO MATCHEIAM (user errou/não sabe o password....) ---> vamos querer MOSTRAR UMA MENSAGEM DE ERRO AO REDIRECIONAR, lá na page de 'login', a que redirecionaremos o user....
          
          req.flash('error', 'Invalid Password.');
          res.redirect('/login');

          }
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/login');
        });
    }
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(
    ///////'.destroy()' em cima do objeto 'session' no OBJETO REQUEST daquele user específico... -----> 'destroy()' É UM METHOD EM 'session' PROVIDENCIADO __ PELO PACKAGE DE 'express-session'... ---> ELE ___ VAI ___dESTRUIR__ A SESSION CORRESPONDENTE __ AO 'SESSION COOKIE' do user que ENVIOU ESSE REQUEST de 'logout'.... (aí, com isso, VAMOS ACABAR DESTRUINDO ___TANTO O SESSION COOKIE EM NOSSOS BROWSERS/BROWSERS DOS USERS__ COMO ___ TAMBÉM __ A SESSION ARMAZENADA_ LÁ NA NOSSA DATABASE, na collection de 'sessions'...)
    () => {
      console.log('Destroyed Session in Your Database');
      res.redirect('/');
      //////ESSA FUNÇAÕ INTERNA/callback SERÁ EXECUTADA QUANDO ESSE 'req.session.destroy()' TIVER _ACABADO __ COM O DESTROY__ DAQUELA SESSION ESPECÍFICA, LÁ NA SUA DATABASE....
      ///ver aula 'deletando um cookie' -----> NESSA AULA, APRENDEMOS QUE __ NÃO PRECISAMOS DELETAR__ O COOKIE/SESSION COOKIE NO BROWSER DO USER, JUSTAMENTE PQ __ ESSE É 1 'SESSION COOKIE'... --> session cookies SEMPRE SÃO PROVISÓRIOS, NUNCA PERMANENTES... e só duram
      //até o  USER FECHAR O BROWSER... -----> além disso, quando APAGAMOS a SESSION correspondente a esse SESSION COOKIE, LÁ NA DATABASE, na collection de 'sessions', por meio do código de '.req.session.destroy()', NÓS __ JÁ DEIXAMOS ESSE SESSION COOKIE INÚTIL/INUTILIZÁVEL, só 1 MINI pedaço de data armazenado na local storage do user... ----> E ESSE PEDACINHO DE DATA ___ AINDA SERÁ __AUTOMATICAMENTE OVERWRITTADO _ se o USER RESOLVER FAZER LOGIN DNV, nesse mesmo browser aberto, PQ __ AÍ _ESSE 'SESSION COOKIE' antigo, INÚTIL, será ___ OVERWRITTADO __ PELO NOVO SESSION COOKIE, produzido novamente por aquele código logo acima, as linhas de 'User.findById()' com os calls de 'req.session.user = user', etc etc, SETTADORES/CRIADORES DE 1 SESSION NA DATABASE e SETTADORES/CRIADORES DO SESSION COOKIE no browser do user....
    }
  );
};

exports.getSignupPage = (req, res, next) => {


let message = req.flash('error');




if (message.length > 0) {

    message = message[0];
} else {

    message = null;
}


console.log(message);


  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
    // isLoggedIn: req.session.isLoggedIn,
    // isLoggedIn: 'xx'
    // isLoggedIn: isLoggedIn
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  console.log(email);

  if (password !== confirmPassword) {
    console.log('Passwords do not match.');
    // return res.status(400).json({ message: "Passwords don't match!" });
    req.flash('error', 'Passwords do not match, please try again.'); ////uso de 'req.flash()', pacote 'connect-flash'... --> sempre usar esse pacote COM NOSSAS SESSIONS, com 'express-session'...
    return res.redirect('/signup');
  }

  User.findOne({ email: email.toLowerCase() }) /////TALVEZ ESTE CÓDIGO... (usei 'findOne' em vez de '.find()', pq FIND() NÃO FUNCIONOU/deu um erro....)
    .then((user) => {
      if (user) {
        ///se for descoberto que JÁ EXISTE 1 USER COM ESSE EMAIL LÁ NA NOSSA DATABASE, vamos querer RETORNAR UMA RESPONSE DIZENDO 'An user with that email already exists, please use a different email address.';

        // return res
        //   .status(400)
        //   .json({
        //     message:
        //       'An user with that email already exists, please use a different email address.',
        //   });
        req.flash('error', 'An User with that Email already exists, please choose another one.')
        return res.redirect('/signup');
      } else {
        return bcrypt
          .hash(password, 12) ///ESSE 'HASHING' é uma TAREFA ASSÍNCRONA, e é por isso que VAMOS USAR UM THEN BLOCK, para chainar o resto de nosso código a essa tarefa... --> e é por isso que vamos escrever aquele 'return', para CONTINUAR COM A EXECUÇÃO DOS THEN BLOCKS RESTANTES...

          .then((hashedPassword) => {
            const user = new User({
              email: email.toLowerCase(),
              password: hashedPassword,
              cart: {
                products: [],
              },
            });
            return user.save(); //salva/cria nosso user QUE AINDA NÃO EXISTIA (pq passamos aquele check de 'if(user)' ) LÁ NA DATABASE, NA COLLECTION DE 'users'...
          })
          .then((result) => {
            
            res.redirect('/login');
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
