"use strict";
// const addButton = document.querySelector('button');
// const input1 = document.getElementById('input1').textContent;
// const input2= document.getElementById('input2').textContent;
// const add = (num1, num2) => {
//     const paragraphNumber = document.querySelector('p');
//     paragraphNumber.textContent = num1 + num2;
// }
// addButton.addEventListener('click', add(input1, input2))
const num1Element = document.getElementById('input1'); //SIM, O TYPESCRIPT FUNCIONA COM QUALQUER TIPO DE JAVASCRIPT CODE, ATÉ CMO BROWSERSIDE VANILLA...
const num2Element = document.getElementById('input2');
const buttonElement = document.querySelector('button'); ///O 'BANG' OPERATOR AO FINAL DE UM VALOR DE UMA CONST SERVE PARA DIZER '''ESSA CONST NUNCA FICARÁ COMO 'NULL', ENTÃO PARE DE NOS INCOMODAR COM ESSE AVISO DE 'OBJECT IS POSSIBLY NULL', PQ ELE __ NUNCA __ VAI FICAR COMO NULL, SEU IDIOTA....
const numResults = []; ////////COM ESSA SINTAXE DO LADO ESQUERDO DO '=', DIZEMOS AO TYPESCRIPT QUE NESSE ARRAY _ SÓ SERÃO PERMITIDOS __ NUMBERS....
////////////// ESSA É A SINTAXE 'ABREVIADA' de definir o INNERTYPE ('number') de UM 'OUTERTYPE' (array, que é o 'GENERIC TYPE', nesse caso... generic type pq podemos ter um array de number, string, boolean, ou misto, se não especificarmos nada)...
// const numResults: Array<number> = []; ////////SINTAXE __ FULL__ DAQUELE CÓDIGO ALI DE CIMA.... --> DEFINE O INNTER TYPE ('number') de UM 'OUTERTYPE' (array, que é o 'GENERIC TYPE', nesse caso... generic type pq podemos ter um array de number, string, boolean, ou misto, se não especificarmos nada)...
const textResults = []; ///SÓ SERÃO PERMITIDAS _ strings__ DENTRO DESSE ARRAY...
// interface ResultObject  { ///é a mesma coisa que USAR UM TYPE ALIAS para definir o SEU OBJECT TYPE (como visto com 'Result'), mas AS INTERFACES POSSUEM UM BÔNUS; EXPÕEM COMPORTAMENTOS ESTRANHOS NOS METHODS DOS OBJECTS... (coisas mais avançadas, que o professor explica no curso de typescript)....
//     val: number;
//     exemplo: string;
//     timestamp: Date;
// }
// function addSum (num1: number, num2: number, num3) { ///POR MEIO DESSA SINTAXE 'num1: number', DEFINIMOS __ QUAL_ _TYPE_ ESSE ARGUMENTO OBRIGATORIAMENTE DEVE TER/SER...
function addSum(
// num1: number | string ///AQUI __ PERMITIMOS, NESSE PARÂMETRO, TANTO 'STRINGS' COMO 'NUMBERS'...
num1, ///exemplo de utilizaçaõ de 'TYPE ALIAS' (visto ali em cima, em ''' type NumOrString = string | number;''' )
// num2: number | string
num2) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        ////EIS O CÓDIGO EM QUESTAÕ.
        return num1 + num2;
    }
    else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + '' + num2;
    }
    return; ///case de 'MIXED DATA TYPES'... -> não vamos querer rodar CÓDIGO ALGUM...
}
function printResult(resultObject ///uso do TYPE ALIAS DE 'Result' (que vai SUBSTITUIR esse código que temos logo abaixo)....
// { ///EXEMPLO DE __ COMO DEFINIR __ 'OBJECT TYPES' nos seus parâmetros... --> 'vou querer que essa function receba um data type DE FORMATO OBJECT, COM ESTE, ESTE E ESTE FORMATO'... (define as características do objeto-parâmetro nesse PRÓPRIO OBJETO-CONFIG aqui... {})
//     //objeto-config/molde DO FORMATO QUE NOSSO 'object TYPE' deverá ter...
//     val: number;
//    exemplo: string;
//    timestamp: Date ///com isso, nos referimos ao OBJETO/CONSTRUCTOR FUNCTION 'Date' DO __ JAVASCRIPT__... (builtin)...
// }
) {
    ///function body
    console.log(resultObject.val);
}
// function addSum(num1: any) {} ////SIM, TAMBÉM EXISTE ESSE TYPE DE 'any', que é USADO COMO UM FALLBACK, PQ NÃO É NADA __ ESPECÍFICO, APENAS ATRAPALHA NOSSO CÓDIGO...
//// SE VOCê NÃO DEFINE nenhum data type em 1 dos seus parâmetros, ele é considerado como 'ANY', mas isso NÃO É BOM, PQ É UM 'ANY' IMPLÍCITO, um any que faz com que o STRICT MODE PENSE QUE VOCê 'ESQUECEU' DE DEFINIR O DATA TYPE DESSA FUNCTION, o que fará ele RECLAMAR.... (como visto com 'num3')...
console.log(addSum(1, 6));
// console.log(add('1', '6')); // --> isso fará com que UM ERROR SEJA THROWN PELO TYPESCRIPT, PQ NAQUELA FUNÇÃO DEFINIMOS QUE O DATA TYPE __ DEVE SER, OBRIGATORIAMENTE, _ 'NUMBER', e não string... (como visto nesse CONSOLE.LOG)...
buttonElement.addEventListener('click', //ver anotaçaõ lá no selector/ definição da constante de 'buttonElement'...
() => {
    // const num1 = num1Element.value; ///SE ESCREVERMOS ISSO SEM _ EXPLICARMOS AO TYPESCRIPT QUE 'num1Element' É _ UMA CONSTANTE QUE SEGURA UM INPUT (pq inputs são elementos que REALMENTE POSSUEM ESSA PROPRIEDADE 'value', que é uma propriedade QUE MUITAS VEZES NÃO EXISTE EM ELEMENTOS HTML... -> precisamos usar aquilo que é chamado de 'TYPE CASTING'... ---> TYPE CASTING É AQUELE TRECHO 'as HTMLInputElement', QUE ESCLARECE QUE ESSE _ ELEMENTO QUE FOI SELECIONADO ___ SERÁ_ __ SEMPRE UM 'INPUT ELEMENT'... (assim, deixamos nosso código bem mais CLARO, EXPLÍCITO)...
    ///o código de const num1Element = document.getElementById('input1') as HTMLInputElement;  VAI FAZER COM QUE O 'error/aviso' que surge por causa de 'num1Element.value' SUMA...
    // const num2 = num2Element.value;
    const num1 = num1Element.value; //coloco o '+' para CONVERTER ISSO EM UM NÚMERO...
    const num2 = num2Element.value;
    const result = addSum(+num1, +num2);
    const stringResult = addSum(num1, num2); ////////EIS O CÓDIGO EM QUESTÃO (vamos querer adicionar/CONCATENAR 2 STRINGS EM 1 SÓ)..... --> aqui veremos COMO DEFINIR 'MÚLTIPLOS DATA TYPEs' como válidos para 1 parâmetro (tanto o type de STRING como de NUMBER)...
    console.log(result, stringResult);
    numResults.push(result);
    textResults.push(stringResult);
    printResult({
        val: result,
        exemplo: 'EXEMPLOZXC',
        timestamp: new Date(),
    });
    console.log(numResults, textResults);
    // console.log(addSum(true, false)); ////ISSO NÃO FUNCIONARÁ, E O TYPESCRIPT APITARÁ/NOS AVISARÁ DISSO... --> É PQ NOSSA FUNCTION DE 'addSum' SÓ ACEITA OS DATATYPES DE NUMBER/STRING PARA SEUS PARÂMETROS, não permitindo o datatype de 'BOOLEAN'... (como true e false)...
});
// if (buttonElement) { ////se escrevermos assim, CONSERTAMOS O 'AVISO' do TYPESCRIPT de que essa variável PODERIA ESTAR COMO UNDEFINED (nenhum button encontrado, essa é a hipótese que ele considera)..
// buttonElement.addEventListener('click',
// () => {
//     // const num1 = num1Element.value; ///SE ESCREVERMOS ISSO SEM _ EXPLICARMOS AO TYPESCRIPT QUE 'num1Element' É _ UMA CONSTANTE QUE SEGURA UM INPUT (pq inputs são elementos que REALMENTE POSSUEM ESSA PROPRIEDADE 'value', que é uma propriedade QUE MUITAS VEZES NÃO EXISTE EM ELEMENTOS HTML... -> precisamos usar aquilo que é chamado de 'TYPE CASTING'... ---> TYPE CASTING É AQUELE TRECHO 'as HTMLInputElement', QUE ESCLARECE QUE ESSE _ ELEMENTO QUE FOI SELECIONADO ___ SERÁ_ __ SEMPRE UM 'INPUT ELEMENT'... (assim, deixamos nosso código bem mais CLARO, EXPLÍCITO)...
//     ///o código de const num1Element = document.getElementById('input1') as HTMLInputElement;  VAI FAZER COM QUE O 'error/aviso' que surge por causa de 'num1Element.value' SUMA...
//     // const num2 = num2Element.value;
//     const num1 = +num1Element.value; //coloco o '+' para CONVERTER ISSO EM UM NÚMERO...
//     const num2 = +num2Element.value;
//     const result = addSum(num1, num2);
//     console.log(result);
// })
// }
printResult({
    val: 4214142,
    exemplo: 'asdasa',
    timestamp: new Date(),
});
const myPromise = new Promise((res, rej) => {
    setTimeout(() => {
        res('IT WORKED!');
    }, 1000);
});
myPromise.then((result) => {
    console.log(result); //vai outputtar 'it worked'...
})
    .catch((err) => {
    console.log(err);
});
