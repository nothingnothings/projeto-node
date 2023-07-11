import { MongoClient } from 'mongodb';

export const connectDatabase = async (url) => {
  const client = await MongoClient.connect(url);
  return client;
};

export const insertDocument = async (client, document, collection) => {
  const db = client.db();

  const result = await db.collection(collection).insertOne(document);


  return result;
};
