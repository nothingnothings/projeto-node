









// const toArray = (...arg) => {



//     return [arg]; ////SINTAXE/RETURN INCORRETO... (retornará um ARRAY DENTRO DE UM ARRAY, o que não queremos)...


// };



// console.log(toArray(1, 2, 3, 4, 5, 6, 7));














const toArray = (...arg) => {



    return arg; ///////SINTAXE CORRETA. VAI RETORNAR UM ARRAY COM TODOS NOSSOS ARGUMENTOS, QUE É O QUE QUEREMOS...
};



console.log(toArray(1, 2, 3, 4, 5, 6, 7));