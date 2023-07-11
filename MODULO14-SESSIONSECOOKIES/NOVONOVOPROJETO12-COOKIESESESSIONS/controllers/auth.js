


const User = require('../models/user');

exports.getLoginPage = (req, res, next) => {




  // console.log(req.get('Cookie')); ///VAI CONSOLE LOGGAR TODOS OS COOKIES settados por meio do header 'Set-Cookie' (que pode ser encontrado naquele controller ali de baixo...)

  // console.log(req.get('Cookie').trim().split('=')[1]); //manipulação do COOKIE QUE NOS INTERESSA... código meio subóptimo.


// const isLoggedIn = req.get('Cookie').trim().split('=')[1];

console.log(req.session);

  res.render(
    'auth/login',

    {
      pageTitle: 'Login',
      path: '/login',


      isLoggedIn: req.session.isLoggedIn
    //  isLoggedIn: req.isLoggedIn
    // isLoggedIn: isLoggedIn
        // isLoggedIn: req.session.isLoggedIn
    // isLoggedIn: 'xx'
    }
  );
};








exports.postLogin = (req, res, next) => {


    
      User.findById('6178c60a90464c24983b0847') //todos os códigos abaixo SÃO NECESSÁRIOS para armazenar nossa SESSION DATA (uma 'ENTRY' de SESSION, em 'sessions') LÁ NA NOSSA DATABASE... --> essas linhas TAMBÉM VÃO CRIAR 1 'session cookie' no browser do user, AUTOMATICAMENTE.... (e esse session cookie terá um id HASHEADO que corresponderá AO ID da SESSION ARMAZENADA NA DATABASE, tbm por meio deste código aqui....)
      .then(
        (user) => {



                  // req.isLoggedIn = true; ///É PARTE DE NOSSO 'DUMMY AUTHENTICATION'.... --> BTW: este approach NÃO FUNCIONA, isso pq TODA VZE QUE ENVIARMOS 1 REQUEST e recebermos uma response (req -> res, como vemos aqui mesmo) ,_ _NÓS VAMOS __ PERDER __ TODA A DATA __ QUE FICA DENTRO DO OBJETO REQUEST... ----> a data de 'user', no nosso OBJETO REQUEST nesse nosso app, SÓ fica ''''PERSISTENTE''' pq __ NÓS ESTAMOS SEMPRE O READICIONANDO ao nosso objeto 'request' QUANDO INICIAMOS QUALQUER PAGE DE NOSSO APP, por causa daquele middleware 'app.use()' LÁ EM 'app.js'...
                                    
        // res.setHeader('Set-Cookie', 'loggedIn=true'); ///é isto que SETTARÁ UM 'SESSION COOKIE' (cookie que só sobrevive ATÉ O MOMENTO EM QUE VOCê FECHA O BROWSER --> FECHADO O BROWSER, ESSE COOKIE VAI __ MORRER, PQ ELE NÃO É UM 'PERSISTENT COOKIE', E SIM É UM 'SESSION/TRANSIENT' COOKIE...) ------> E ESSE COOKIE SERÁ EMBUTIDOO _ EM TODOS OS REQUESTS__ QUE VOCê FIZER DESSE BROWSER AQUI... (você pode observar isso lá nos 'HEADERS' de cada request, na aba 'network', no google chrome... --> você acha esse cookie lá em 'Cookie', nos 'Headers'...) -----> MAS ESSE É UM 'SESSION COOKIE' __POBRE___; VOCÊ NÃO DEVE SETTAR COOKIES MANUALMENTE, ASSIM, __QUASE NUNCA__... --> PREFIRA USAR PACKAGES como 'express-session', PACKAGES QUE ___ FAZEM O STORE DE COOKIES __ PARA VOCê, automaticamente....
        req.session.isLoggedIn = true; //MANEIRA ___ LEGIT__ de SETTAR 1 SESSION COOKIE no browser de seu user... --> é claro que esse approach aí REQUER QUE VOCÊ TENHA A PACKAGE DE 'express-session' JÁ INSTALADA no seu projeto.... (pq só assim o objeto 'session' no objeto 'request' passa a existir)....
        // ^^^ por meio desse código, FAZEMOS __ O STORE__ DE NOSSA 'SESSION': 1) NA MEMORY DO SEU NODE APP (runtime); 2) NO BROWSER DO USUÁRIO, EM UM COOKIE... (por isso o nome 'session cookie', que é uma SESSION ARMAZENADA DENTRO DE 1 COOKIE.... e esse cookie terá o 'SESSIONID' HASHEADo/encriptado, ao passo que o SERVER/database terá A SESSIONID __ORIGINAL/pura... e esses 2 ids serão MATCHEADOS para identificar o user como AUTOR/correspondente Àquela session...) 
      req.session.user = user; ////vai definir nossa USER DATA lá na SESSION armazenada na database... (essa será a 'SENSITIVE DATA' armazenada no server...)


        ///mas esse approach da MEMORY é HORRÍVEL, PQ É MT MELHOR ARMAZENAR SUA SESSION EM UMA __ DATABASE, por meio de packages como 'connect-mongodb-session'... --> para armazenar em uma DATABASE, como o mongodb, você deve SETTAR o uso dessa database lá naquele MIDDLEWARE DEFINIDOR DA SESsion, aquele 'app.use(session({store: store}))', LÁ NO APP.JS...
        // res.setHeader('Set-Cookie', 'loggedIn=true; Expires='); ///com 'Expires', você define QUANTO TEMPO ESSE COOKIE VAI DURAR, NO MÁXIMO (aí ele vai ser removido SE ESSE TEMPO PAASSAR, ou se você FECHAR O BROWSER)... --> AS DATES DEFINIDAS COM ESSE 'Expires=' __DEVEM SEGUIR __ O FORMATO 'HTTP DATE'..
      // res.setHeader('Set-Cookie', 'loggedIn=true; Max-age=10'); ///faz a mesma coisa que o CONFIG do cookie de cima, estabelece um TEMPO limite de duração para o cookie.... -->> entretanto, a diferença é que com 'Max-Age', nós definimos o TEMPO EM __ SEGUNDOS_ QUE ESSE COOKIE DEVERÁ DURAR...
      // res.setHeader('Set-Cookie', 'loggedIn=true; Domain=google'); //USADO ___ NO TRACKING__ DE SEUS USERS/VOCê.... --> o domain a que É ENVIADO 1 COOKIE nem sempre precisa ser o mesmo domain QUE O PRODUZIU... (conluio entre empresas, que fazem acordos para te TRACKAR... ---> cookie produzido em 1 site pode acabar SENDO ENVIADO a DESTINO/DOMAIN distinto, como o google e seus servidores.....)
      // res.setHeader('Set-Cookie', 'loggedIn=true; Secure'); ///SECURE faz com que seu cookie NÃO SEJA SETTADO NO BROWSER do user SE FOR CONSTATADO QUE A PAGE que produz esse cookie NÃO ESTÁ SENDO SERVIDA EM UM FORMATO HTTPS (http secure)...
      // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly'); ///IMPORTANTE MECANISMO DE SEGURANÇA,  constatado na coluna 'HTTP' (V) da aba 'application', no google devtools --> ESSE ATTRIBUTE no cookie FAZ COM QUE SEJA __ IMPOSSÍVEL __ ALGUÉM USAR 'CLIENTSIDE JAVASCRIPT' para __ALTERAR O VALOR DESSE COOKIE ESPECÍFICO... --> É MUITO IMPORTANTE E UTILIZADO NO COMBATE A CROSS-SITE SCRIPTING ATTACKS, QUE AMEAÇAM NOSSO SERVER...



            req.session.user.save( //talvez funcione.... (não parece funcionar, mas tudo bem...)
              () => { //callback function, vai redirecionar APENAS __aPÓS___  o 'SAVE' da session na DATABASE ter ocorrido, e apenas APÓS A SESSION COOKIE CORRESPONDENTE ter sido criada no browser de seu user...
                res.redirect('/');
              }
            )


        }
      )







}








exports.postLogout = (req, res, next) => {



  req.session.destroy( ///////'.destroy()' em cima do objeto 'session' no OBJETO REQUEST daquele user específico... -----> 'destroy()' É UM METHOD EM 'session' PROVIDENCIADO __ PELO PACKAGE DE 'express-session'... ---> ELE ___ VAI ___dESTRUIR__ A SESSION CORRESPONDENTE __ AO 'SESSION COOKIE' do user que ENVIOU ESSE REQUEST de 'logout'.... (aí, com isso, VAMOS ACABAR DESTRUINDO ___TANTO O SESSION COOKIE EM NOSSOS BROWSERS/BROWSERS DOS USERS__ COMO ___ TAMBÉM __ A SESSION ARMAZENADA_ LÁ NA NOSSA DATABASE, na collection de 'sessions'...)
    () => {
      console.log('Destroyed Session in Your Database');
      res.redirect('/');
       //////ESSA FUNÇAÕ INTERNA/callback SERÁ EXECUTADA QUANDO ESSE 'req.session.destroy()' TIVER _ACABADO __ COM O DESTROY__ DAQUELA SESSION ESPECÍFICA, LÁ NA SUA DATABASE....
        ///ver aula 'deletando um cookie' -----> NESSA AULA, APRENDEMOS QUE __ NÃO PRECISAMOS DELETAR__ O COOKIE/SESSION COOKIE NO BROWSER DO USER, JUSTAMENTE PQ __ ESSE É 1 'SESSION COOKIE'... --> session cookies SEMPRE SÃO PROVISÓRIOS, NUNCA PERMANENTES... e só duram 
        //até o  USER FECHAR O BROWSER... -----> além disso, quando APAGAMOS a SESSION correspondente a esse SESSION COOKIE, LÁ NA DATABASE, na collection de 'sessions', por meio do código de '.req.session.destroy()', NÓS __ JÁ DEIXAMOS ESSE SESSION COOKIE INÚTIL/INUTILIZÁVEL, só 1 MINI pedaço de data armazenado na local storage do user... ----> E ESSE PEDACINHO DE DATA ___ AINDA SERÁ __AUTOMATICAMENTE OVERWRITTADO _ se o USER RESOLVER FAZER LOGIN DNV, nesse mesmo browser aberto, PQ __ AÍ _ESSE 'SESSION COOKIE' antigo, INÚTIL, será ___ OVERWRITTADO __ PELO NOVO SESSION COOKIE, produzido novamente por aquele código logo acima, as linhas de 'User.findById()' com os calls de 'req.session.user = user', etc etc, SETTADORES/CRIADORES DE 1 SESSION NA DATABASE e SETTADORES/CRIADORES DO SESSION COOKIE no browser do user....
   
   
   
      }
  ); 
}