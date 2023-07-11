const fetchData = () => { ////eis o código em questão.

    const promise = new Promise(
        (resolve, reject) => {


                    setTimeout(
                        () => {
                            resolve('Done!'); ////////eis o código em questão.
                        },
                        1500 
                    )
        }
    )
    return promise;
}










// const fetchData = (callback) => { ////eis o código em questão. (MESMO CÓDIGO, MAS SEM 'promise'... é pior, sintaticamente, pq é mt confuso...)

//     const promise = new Promise(
//         (resolve, reject) => {


//                     setTimeout(
//                         () => {
//                             callback('Done!'); ////////eis o código em questão.
//                         },
//                         1500 
//                     )
//         }
//     )
// }