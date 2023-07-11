import { connectToDatabase } from "../../../helpers/db-util";

import { hashPassword } from "../../../helpers/auth"; /////utility function criada com a ajuda do 'bcrypt'...




const handler = async (req, res) => {


if (req.method === 'POST') {
    const data = req.body;


    const { email, password } = data;

    console.log(email, password.trim().length < 7)

    if (!email || !email.includes('@') || !password || password.trim().length < 7)  {

        
        res.status(422).json(
            {
                message: 'Invalid input - password should also be at least 7 characters long.'
            }
        )
        return;
    }

   const client = await connectToDatabase();

   const db = client.db();  ////necessário...


const existingUser  = await db.collection('users').findOne(
    {
        email: email
    }
)

if (existingUser) {   ////usado para EVITAR QUE VISITANTES DE NOSSA PÁGINA POSSAM CRIAR UM USER COM O MESMO EMAIL DE OUTRO USER NA NOSSA DATABASE...

    client.close();
    res.status(422).json(
        {
            message: 'An user with the entered email already exists on database. Please enter a different email.'
        }
    )

return; ////cessa execucao do restante do código
}

   const hashedPassword = await hashPassword(password);  ////voce deve colocar 'await' no call dessa function, PQ ELA É UMA FUNCTION ASSÍNCRONA...

 const result = await db.collection('users').insertOne(
       {
           email: email,
           password: hashedPassword
       }
   )

       res.status(201).json(
           {
               message:'Created user.'
           }
       )
    console.log(result);



    client.close();
}
   


return;
}







export default handler;