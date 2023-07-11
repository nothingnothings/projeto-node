const sum = (a, b) => {  ///////1

  
  if(!b) {

  throw new Error('Please input second value for the sum operation to work'); ///importante.

}

  return a + b;
};

// console.log(sum(1, 2));

// console.log(sum(1));


try {        ////////////2 


  console.log(sum(1)); ///////////3

} catch(error) { //


  console.log('An error has occurred!'); ///////////4   ////////OBS::: ESSE CÓDIGO AÍ _ NÃO VAI CESSAR __ A EXECUÇÃO, O RUNTIME DE NOSSO APP... --> PQ O ERROR SERÁ 'HANDLED' (não será um UNHANDLED ERROR, 1 ERROR QUE QUEBRA NOSSO APP/SUA RUNTIME...)     ---------> (captura o ERROR de 'Please Input a  second value', o que FAZ COM QUE ESSE CONSOLE.LOG LOGO ABAIXO SEJA DISPARADO... MAS ISSO NÃO VAI PARAR A EXECUÇÃO, pois agora esse 'please input second value' SERÁ UM _ HANDLED ERROR.... 
  // console.log(error);
}




console.log('This works!'); ///////5 ------>  __ É EXECUTADO_ MESMO OCORRENDO AQUELE CÓDIGO EM 'try-catch', justamentep q esse CÓDIGO DE 'try-catch' VAI TRANSFORMAR NOSSO ERROR EM UM 'HANDLED ERROR' (e como no nosso CATCH BLOCK nós __ SÓ FIZEMOS 1 CONSOEL.LOG SIMPLES DE 'an error has occurred', o código SEGUIRÁ SEU RUNTIME NORMAL... --> e é por isso que este console.log, esta linha aqui, é LIDA E EXECUTAD...)