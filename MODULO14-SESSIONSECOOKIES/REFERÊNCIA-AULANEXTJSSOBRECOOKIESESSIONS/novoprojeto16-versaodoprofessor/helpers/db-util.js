


import { MongoClient } from 'mongodb';





export const connectToDatabase = async () => {


 const client = await MongoClient.connect('mongodb+srv://madblorga:papanacuas@cluster0.nhtjo.mongodb.net/auth-demo?retryWrites=true&w=majority')







 return client;
}



