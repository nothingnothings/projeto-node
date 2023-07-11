import {
  Bson, MongoClient, 
  
  Database, ///// É UM 'TPYE' do typescript.... que deve ser importado, para definir COMO É A ESTRUTURA DESSE OBJETo....
} from 'https://deno.land/x/mongo@v0.29.0/mod.ts';

const MONGODB_URI =
  'mongodb+srv://madblorga:T5lws5TGxtclEbKI@cluster0.nhtjo.mongodb.net/todos?authMechanism=SCRAM-SHA-1&retryWrites=true&w=majority'; ///database de 'todos'...

let db: Database; //COM ESSE CÓDIGO, SETTAMOS ESSA VARÍAVEL COMO SENDO O VALOR DE 'NOSSA DATABASE'.... --> SERÁ DE TYPE 'Database', que éu um type que TBM PODE __ SER OBTIDO LÁ DE 'https://deno.and/x/mongo@v0.29.0.mod.ts

export async function connect () {

  const client = new MongoClient();
  await client.connect(MONGODB_URI); 
  
  ////error: TS2339 [ERROR]: Property 'connectWithUri' does not exist on type 'MongoClient'. ----> 'connectWithUri' NÃO EXISTE MAIS, AGORA É SÓ 'connect()'


  db = client.database('todos');
}

export function getDb() {
  return db;
}

// const db = client.database('todos');
// const users = db.collection('todos');
