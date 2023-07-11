import Document from 'next/document'; ///isso governa REALMENTE NOSSO APP INTEIRO... É MUITO IMPORTANTE, e nos ajuda a ESTRUTURAR TUDO NOS MÍNIMOS DETALHES...

import { Html, Head, Main, NextScript } from 'next/document';

// IMPORTANTE!!!!!!!!! ---> O COMPONENT

// 'Head'
// que importamos
// de 'next/document'
// __NÃO É O MESMO __ 'Head' QUE IMPORTAMOS

// LÁ
// DE

// 'next/head',

// ELES __ NÃO SÃO IGUAIS___....

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <div id="overlays" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
