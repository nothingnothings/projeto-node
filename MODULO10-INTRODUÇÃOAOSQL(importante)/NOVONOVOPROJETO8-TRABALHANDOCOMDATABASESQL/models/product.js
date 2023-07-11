// const fs = require('fs'); ///DEIXAMOS DE TRABALHAR COM FILESYSTEM PARA FAZER MANAGE DE NOSSA DATA.... --> passamos a usar uma SQL DATABASE para isso...

// const path = require('path'); ///mesma coisa vista ali em cima... path só estava sendo usado PARA __UTILIZAR_ _ O FILESYSTEM DE NOSSO BACKEND PARA ARMAZENAMENTO DE DADOS... --> COMO VAMOS ARMAZENAR ESSES DADOS AGORA LÁ EM UMA DATABASE SQL ADJACENTE, não precisamos mais de 'path' e 'fs'...



const db = require('../util/database'); //ISSO NOS DÁ ACESSO À CONNECTION POOL DE NOSSA DATABASE/À database em si....

const Cart = require('./cart');





// const pathHelper = require('../util/path');

// const filePath = path.join(pathHelper, 'data', 'ProductList.json');

// const getProductsFromFile = (callback) => { ///SUBSTITUÍDO POR CÓDIGO QUE USA _DATABASE__ SQL __ para DATA MANAGEMENT... (todo esse código verde que TIRAMOS PARA FORA, neste módulo, __ É CÓDIGO QUE USAVA O FILESYSTEM DE NOSSO BACKEND/ APLICATIVO NODE-EXPRESS  PARA ARMAZENAR A DATA do appp..)
//   fs.readFile(filePath, (err, fileContent) => {
//     if (err) {
//       callback([]);
//     } else {
//       callback(JSON.parse(fileContent));
//     }
//   });
// };


const findProductInDatabase = (id) => {
  return db.execute('SELECT * FROM PRODUCTS WHERE products.id = ?', [id]);
}


module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }







  save() {
    // getProductsFromFile((products) => { ///código que usava o FILESYSTEM como database...
    //   if (this.id) {
    //     const existingProductIndex = products.findIndex(
    //       (item) => item.id === this.id
    //     );
    //     const updatedProducts = [...products];

    //     updatedProducts[existingProductIndex] = this;
    //     fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
    //       console.log(err);
    //     });
    //     console.log('test');
    //   } else {
    //     this.id = Math.random().toString();

    //     products.push(this);
    //     fs.writeFile(filePath, JSON.stringify(products), (err) => {
    //       console.log(err);
    //     });
    //     console.log('test2');
    //   }
    // });

     return findProductInDatabase(this.id)
        .then(
          ([rows, fieldData]) => {
         const returnedData = [...rows];
         console.log(returnedData.length === 0, 'ZZZZ');
            if(returnedData.length === 0) {
              // db.execute(`INSERT INTO products (title, price, description, imageUrl) VALUES ('${this.title}', ${this.price}, '${this.description}', '${this.imageUrl}')`); //////////// NUNCA INSIRA VALORES ASSIM.... --> SE VOCÊ INSERIR VALORES ASSIM, VOCÊ CORRE RISCO DE SOFRER ATAQUES DE 'SQL INJECTION', EM QUE OS HACKERS ENFIAM VALORES NOS INPUT FIELDS DE SUA PÁGINA,O QUE FAZ COM QUE USUÁRIOS SEJAM PREJUDICADOS PELOS SCRIPTS QUE ELES RODARÃO, NO FUTURO... --> EM VEZ DISSO, utilize a sintaxe 'VALUES(?, ?, ?, ?), [${this.xxxx}]', QUE __ FAZ COM QUE __ OS VALORES DOS SEUS INPUT FIELDS __ SEJAM __ AUTOMATICAMENTE___ atribuídos a esses '?' dentro desse parâmetro de 'VALUES'...
              db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)', [this.title, this.price, this.description, this.imageUrl]);  ///  TUDO GRAÇAS AO PACOTE 'mysql2', é ele que FORRA os '?' nos values COM ESSES VALORES AÍ...., OS VALORES PASSADOS NESSE ARRAY..
            } else {
              console.log(rows, 'LINE');
              // db.execute(`UPDATE products SET title='${this.title}', price=${this.price}, description='${this.description}', imageUrl='${this.imageUrl}' WHERE id=${this.id} `) ///SINTAXE ERRADA/UNSAFE...
              db.execute('UPDATE products SET title=?, price=?, description=?, imageUrl=? WHERE id=?', [this.title, this.price, this.description, this.imageUrl, this.id]) ////SINTAXE __ SAFE__...
            }

          }
        )

        // console.log(existingProduct, 'LINE');
    // db.execute('SELECT * FROM products') ///antigo código de DATABASE SQL que tentei escrever...
    // .then(
    //   ([rows, fieldData]) => {
    //     console.log(rows);
    //   const existingProduct = rows.find(
    //       (row) => {
    //           return row.id === this.id;
    //       }
    //     )
      
    //   if(!existingProduct) {
    //     db.execute(`INSERT INTO products (title, price, description, imageUrl) VALUES ('${this.title}', ${this.price}, '${this.description}', '${this.imageUrl}')`);
    //   } else {
    //       db.execute(`UPDATE products SET title='${this.title}', price=${this.price}, description='${this.description}', imageUrl='${this.imageUrl}' WHERE id=${this.id} `)
    //   }
    //   }
    // )
  }

  // static findProduct(productId, callback) {
  //   // getProductsFromFile((products) => {
  //   //   const product = products.find((item, index) => {
  //   //     return item.id === productId;
  //   //   });

  //   //   callback(product);
  //   // });
  // }


  // static findProductInDatabase(id) {
  //   return db.execute(`SELECT * FROM products WHERE id = ${id}`);
  // }



  static findProduct(id) {
     return findProductInDatabase(id);
  }




  // static deleteProduct(productId) {
  //   // getProductsFromFile((products) => {
  //   //   const productPrice = products.find((product) => {
  //   //     return product.id === productId;
  //   //   }).price;
  //   //   const updatedProducts = products.filter((prod) => prod.id !== productId);

  //   //   fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
  //   //     console.log(err);

  //   //     if (!err) {
  //   //       Cart.deleteProductFromCart(productId, productPrice); ////vai DELETAR ESSE PRODUCT ESPECÍFICO DO NOSSO CART/CART DO USUÁRIO, caso o admin DELETE ESSE PRODUCT DA LISTA DE PRODUCTS DISPONÍVEIS...
  //   //     }
  //   //   });
  //   //   console.log('test');
  //   // });
  // }




  static deleteProduct(productId) {
    //  return db.execute(`DELETE FROM products WHERE id=${productId}`); // SINTAXE ERRADA, INSEGURA, VULNERÁVEL A ATAQUES DE SQL INJECTION...
    return db.execute('DELETE FROM products where products.id = ?', [productId]);

  }













  // static fetchAll(cb) {
    
  static fetchAll() {
    // getProductsFromFile(cb);

  return db.execute('SELECT * FROM products'); ///db.execute() nos retorna uma PROMISE. E aí, vamos querer RETORNAR ESSA PROMISE INTEIRA, como resultado desse método 'fetchAll'.... -> FAREMOS ISSO PARA QUE SEJA POSSÍVEL ESCREVER .then() e .catch() blocks __ NO LOCAL EM QUE FORMOS CHAMAR 'fetchAll()'....
        //não vamos escrever os '.then()' e '.catch()' aqui, e sim NO LUGAR EM QUE CHAMAMOS 'fetchAll()', no nosso app...
  }
};
