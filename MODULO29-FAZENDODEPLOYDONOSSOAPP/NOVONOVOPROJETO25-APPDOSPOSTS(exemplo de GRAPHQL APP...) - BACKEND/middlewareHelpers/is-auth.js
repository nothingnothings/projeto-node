const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  ///POR MEIO DESTA SINTAXE, EXPORTAMOS APENAS 1 ÚNICA FUNÇÃO...

  const header = req.get('Authorization'); ///ESSE MÉTODO '.get()' É UM MÉTODO __ QUE NOS PERMITE__ FAZER 'get' DO VALOR _de 1 DE NOSSOS HEADERS, DENTRO DO NOSSO REQUEST...
  ///vamos querer fazer get DESSE HEADER DE 'Authorization', QUE É O LOCAL EM QUE EMBUTIMOS NOSSA TOKEN (JSON WEB TOKEN)...
  ////O VALOR EXTRAÍDO DESSE HEADER SERÁ 'Bearer ashsiahasihasasi' (o gibberish é a __TOKEN EM SI___)...

  if (!header) { ////cases em que NEM MESMO O HEADER FOI ANEXADO AO REQUEST...
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }

  const actualToken = header.split(' ')[1]; ////VAMOS QUERER __ SEPARAR A STRING DE 'bearer' da TOKEN EM SI, portanto usamos esse método split para pegar a token... é algo bem padrão, visto frequentemente...

  let decodedToken;

  try {
    ///com essa sintaxe FAREMOS O 'DECODE/verify' (ou verificação, na verdade) DE NOSSA TOKEN, da token recebida no nosso backend...

    decodedToken = jwt.verify(
      actualToken, ///o método 'verify' de 'jsonwebtoken' vai TANTO DECODIFICAR (parsear, extrair valores) como __ VALIDAR/VERIFICAR SUA TOKEN (ver se não é inválida)...
      /// outro método, mais situacional, é '.decode()', que apenas DECODIFICA A TOKEN, SEM SE IMPORTAR POR/CHECAR SUA VALIDADE...
      'zVzS42wNmzOOmlRgYCNWE1dxTH4n_sL6JuDnNj2srF2B7YxRsAgVmvqO8z14Wd3nzOqXzseBAjJ7PA5RSzjs0GsdrR5nxrVu8NPQJjooJLq2GqEl4h9JxwJ8zg5d_Fl2l3Q3n8yf13Gydum25V3mYRUy--L1EskSMs2PcEXLOJM' /// ESSE É O SEGUNDO ARGUMENTO DESSE MÉTODO '.verify()', que __ TAMBÉM É OBRIGATÓRIO... --> NESSE ARGUMENTO, PASSAMOS __ O __ SECRET__ QUE VOCÊ USOU NA CRIAÇÃO DAS TOKENS, criação feita no seu próprio backend (no nosso caso, lá no controller de 'auth.js', no controller de 'exports.login'...)..
    );
  } catch (err) {
    err.statusCode = 500;
    throw err; ///vai fazer com que o SPECIAL EXPRESS ERROR HANDLER MIDDLEWARE assuma o comando...
  }

  if (!decodedToken) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error; // de novo, para engatilhar aquele middleware de error handling geral....
  }

  req.userId = decodedToken.userId; ////////////VAMOS QUERER ARMAZENAR, NO OBJETO 'REQ' DO USER, VALORES QUE ESTAVAM CONTIDOS DENTRO DA TOKEN QUE RECEBEMOS NO BACKEND...

  next(); ///após armazenar o userId no request, fazemos forward do request, para que continue com o flow do runtime, para que alcance os controllers como o de 'getPosts'...
};