import '../styles/globals.css';


import Layout from '../components/Layout/Layout'


import Head from 'next/head';


// 
// 
// //             <Head> ////////OBS::: TODOS OS 'META TAGS' posicionados aqui, dentro de '<Head>', adjacente ao '<Component/>', SERÃO APLICADOS A TODOS OS <head></head> de TODAS AS PÁGNIAS DE NOSSO PROJETO....
// <meta name="viewport" content="initial-scale=1.0, width=device-width" />
// </Head>
// 
// 
// 




const MyApp = ( { Component, pageProps }) => { ////obs: se for definida alguma tag <title> em algum <HEAD> nos PAGE COMPONENTS DO SEU PROJETO, ESSE VALOR DE title de 'Next Events' VAI __SER OVERWRITTADO_ PELO TITLE MAIS ESPECÍFICO, DEFINIDO NO PAGE COMPONENT/PAGE COMPONENTS (e isso também se aplica a quaisquer tags 'meta', tags 'meta' que tenham O MESMO VALOR DE 'name' no seu interior...)
        return  <Layout>
                <Head>
                <title>Next Events</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <Component {...pageProps} />
                </Layout>

}


export default MyApp;