



import { Response, Request } from "https://deno.land/x/oak/mod.ts";


import {
    Bson ///// CONTÉM O TYPE DE 'ObjectId' no seu interior....
  } from 'https://deno.land/x/mongo@v0.29.0/mod.ts';



import { getDb } from '../helpers/db_client.ts'


type Todo = { ////DEFINIÇÃO DE 'TYPE'/type aliasing...
    // id: string,
    id?: string; /// SE ESCREVEMOS UM '?' DEPOIS DO WRITE DA KEY, deixamos essa propriedade como OPCIONAL, para que o  typescript NÃO RECLAME SE CRIARMOS UM OBJETO TODO sem um id no interir..
    text: string
}


// type Document = {
//     _id: Bson.ObjectId;
//     text: string
// }



interface Document {
        text: string;
        _id: Bson.ObjectId
}




interface RequestBody {
    value: {
        text: string
    }
}

let todos:Todo[] = []; ///usávamos isto quando usávamos a MEMÓRIA PARA ARMAZENAR NOSSOS 'TODO'....





export const getTodos = async ({request, response, params }: {
    request: Request,
    response: Response,
    params: { todoId: string }





}) => {


    const todos = await getDb().collection('todos').find({}, {noCursorTimeout: false}).toArray(); ///2o parametro é necessário para acabar com erro específico do DENO...

    const transformedTodos = todos.map(
        (todo) => {
            return {
                id: todo._id.toString(), ///fazemos isso para converter o 'ObjectId' em um formato utilizável no frontend...
                text: todo.text
            }


        }
    );

    console.log(transformedTodos);
    
    response.status = 200;
    response.body = {
        message: 'Got todos',
        data: transformedTodos
    }


}





export const editTodo = async ({request, response, params }: {
    request: Request,
    response: Response,
    params: { todoId: string }





}) => {





    const todoId = params.todoId!; //sempre será DEFINED, sempre será uma STRING...


    console.log(params, 'LINE');
  

    const body = await request.body({type: "json"}) //Returns { type: "json", value: Promise { <pending> } }


    if(!request.hasBody) {
        response.status = 400;
        response.body = { message: "No data provided"};
        return;
    }


    const values = await body.value;


    console.log(values.text, 'LINE2');


  
    // const todoIndex = todos.findIndex((todo) => {
    //   return todo.id === todoId;
    // });
  
    // todos[todoIndex].text = values.text;


    // console.log(todos[todoIndex])
    

    getDb().collection('todos').updateOne({_id: new Bson.ObjectId(todoId)}, {$set: {text: values.text  }} )



    response.status = 200;
    response.body = {
        message: 'Edited todo',
        data: todos
    }


}






export const createTodo =  async ( {request, response, params }: { ////async --> 'eis o código em questão'
    request: Request,
    response: Response,
    params: { todoId: string }
}) => {



        // const body = await request.body();

    ///////EIS A SINTAXE EM QUESTÃO (conversão de JSON DATA em JAVASCRIPT OBJECT)....



    const body = await request.body({type: "json"}) //Returns { type: "json", value: Promise { <pending> } }


    if(!request.hasBody) {
        response.status = 400;
        response.body = { message: "No data provided"};
        return;
    }


    const values = await body.value;


    // const newTodo: Todo = {
    //     id: Math.random().toString(),
    //     // text: request.body.text
    //    text: values.text
    // }

    // todos.push(newTodo);


        const newTodo: Todo = {
            // id: Math.random().toString(), //vai ser gerado automaticamnete pelo mongodb...
            text: values.text

        }



        const insertedTodoId = await getDb().collection('todos').insertOne(newTodo); ////vai retornar uma promise, que será resolved quando essa promise tiver acabado...
        ///essa promise vai resolver/retornar o ID DO __ TODO QUE RECÉM FOI ADICIONADO A NOSSA COLLECTION...





        newTodo.id = insertedTodoId.$oid; ///MESMA COISA QUE 'insertedTodoId.toString()'...




    response.status = 201;
    response.body = {
        message: 'Created todo',
        data: newTodo
    }


}


export const deleteTodo = async ({request, response, params }: {
    request: Request,
    response: Response,
    params: any





}) => {



    const todoId = params.todoId;
    console.log(todoId);



    // const newTodos = todos.filter((todo) => { ///trabalhando com o negócio NA MEMÓRIA DO APP..
    //     console.log(todoId === todo.id);
    //     return todo.id !== todoId;
    //   });



    //   todos = newTodos;
    //   console.log(todos);


  const removedTodo = await getDb().collection('todos').deleteOne(
        {
            _id: new Bson.ObjectId(todoId)
        }
    )


    // const todoList = await getDb().collection('todos').find( //PROFESSOR JÁ FAZ ISSO POR MEIO DO CALL DE 'getTodos', lá no frontend...
    //     {
    //     }, {
    //         noCursorTimeout: false
    //     }
    // ).toArray();

    console.log(removedTodo);

    
    response.status = 200;
    response.body = {
        message: 'DELETED TODO',
        // data: todoList
    }


}
