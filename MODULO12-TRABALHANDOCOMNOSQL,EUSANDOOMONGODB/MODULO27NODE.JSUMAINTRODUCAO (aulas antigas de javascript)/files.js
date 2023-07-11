console.log('Hello world!'); /////ISSO FUNCIONA


/*
document.querySelector('button');


ISSO NÃO FUNCIONA.
*/



let variable = 'variável'; ///ISSO FUNCIONA (como a grande maioria das features no node.js)





const shit = 'crap'; ///ISSO FUNCIONA também





console.log(`isso também funciona`);




///////////////////////////////////









const fs = require('fs');


fs.writeFile('user-data.txt', 'username=Max', err => {
    if (err) {
        console.log(err);
    } else {
        console.log('Wrote to file!');
    }
} );



fs.readFile('user-data.txt', (err, data) => {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log(data.toString());
    }
})
