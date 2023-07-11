let io; ///DECLARAÇÃO INICIAL DO 'io'...


///esse OBJETO que exportamos aqui vai ser usado em 'app.js' e em outros lugares de nosso código que precisam comunicar/fazer coisas com nossa conexão 'webSocket'...

module.exports = {/// É A MANEIRA UTILIZADA PARA 'SHARE THAT IO OBJECT OVER MULTIPLE FILES' (para que não fiquemos limitados ao seu uso em 'app.js')....

    init: httpServer => {///recebemos o 'httpServer' como um argumento...  //// VAMOS USAR ESSA FUNÇAÕ/MÉTODO 'init()' LÁ NO __ APP.JS DO NOSSO BACKEND, QUANDO ESTIVERMOS INICIANDO NOSSO SERVER E DEFININDO SUA CONEXÃO à DATABASE MONGODB...

            io = require('socket.io')(httpServer);
            return io;

    },

    getIo: () => { //não vamos esperar quaisquer argumentos...
        if (!io) {
            throw new Error('Socket.io not initiazlized');
        }

        return io;
    }


     


}