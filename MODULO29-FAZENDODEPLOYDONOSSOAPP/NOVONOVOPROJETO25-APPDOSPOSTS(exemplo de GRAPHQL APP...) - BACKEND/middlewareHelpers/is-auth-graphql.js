////OBS::: ESTE ARQUIVO/MIDDLEWARE AQUI, ao contrário do middleware 'is-auth.js' '''VERSÃO REST API''', este aqui, do graphQL, DEVE __ SER ADICIONADO _ E IMPLEMENTADO__ LÁ NO SEU ARQUIVO ROOT DO BACKEND, LÁ EM 'app.js', LOGO __ ANTES__ DO MIDDLEWARE QUE SETTA SEU ÚNICO ENDPOINT GRAPHQL (ou seja, antes de 'app.use('/graphql', {})' ....)



const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  const header = req.get('Authorization'); 

  if (!header) { 
    req.isAuth = false; ////diferente de nosso 'is-auth.js' (mundo REST API)
    return next(); //isto vai PULAR o resto da execução de nosso código.... (se entrarmos nesse block aqui....)
  }

  const actualToken = header.split(' ')[1]; ////VAMOS QUERER __ SEPARAR A STRING DE 'bearer' da TOKEN EM SI, portanto usamos esse método split para pegar a token... é algo bem padrão, visto frequentemente...

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      actualToken, 
      'zVzS42wNmzOOmlRgYCNWE1dxTH4n_sL6JuDnNj2srF2B7YxRsAgVmvqO8z14Wd3nzOqXzseBAjJ7PA5RSzjs0GsdrR5nxrVu8NPQJjooJLq2GqEl4h9JxwJ8zg5d_Fl2l3Q3n8yf13Gydum25V3mYRUy--L1EskSMs2PcEXLOJM' /// ESSE É O SEGUNDO ARGUMENTO DESSE MÉTODO '.verify()', que __ TAMBÉM É OBRIGATÓRIO... --> NESSE ARGUMENTO, PASSAMOS __ O __ SECRET__ QUE VOCÊ USOU NA CRIAÇÃO DAS TOKENS, criação feita no seu próprio backend (no nosso caso, lá no controller de 'auth.js', no controller de 'exports.login'...)..
    );
  } catch (err) {
    req.isAuth = false; ////diferente de nosso 'is-auth.js' (mundo REST API)
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false; ////diferente de nosso 'is-auth.js' (mundo REST API)
    return next();
  }

  req.userId = decodedToken._id; ////////////VAMOS QUERER ARMAZENAR, NO OBJETO 'REQ' DO USER, VALORES QUE ESTAVAM CONTIDOS DENTRO DA TOKEN QUE RECEBEMOS NO BACKEND...
  
  req.isAuth = true; ////diferente de nosso 'is-auth.js' (mundo REST API) --> essa propriedade NAÕ EXISTE NA VERSÃO 'REST API'...

  next(); ///após armazenar o userId no request, fazemos forward do request, para que continue com o flow do runtime, para que alcance os controllers como o de 'getPosts'...
};
