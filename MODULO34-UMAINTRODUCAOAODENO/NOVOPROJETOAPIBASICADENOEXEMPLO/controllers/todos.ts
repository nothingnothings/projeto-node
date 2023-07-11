



import { Response, Request, } from "https://deno.land/x/oak/mod.ts";


type Todo = { ////DEFINIÇÃO DE 'TYPE'/type aliasing...
    id: string,
    text: string
}





interface RequestBody {
    value: {
        text: string
    }
}


const todos:Todo[] = [];





export const getTodos = ({request, response, params }: {
    request: Request,
    response: Response,
    params: { todoId: string }





}) => {


    
    response.status = 200;
    response.body = {
        message: 'Got todos',
        data: todos
    }


}





export const editTodo = async ({request, response, params }: {
    request: Request,
    response: Response,
    params: { todoId: string }





}) => {





    const todoId = params.todoId;

    console.log(params, 'LINE');
  

    const body = await request.body({type: "json"}) //Returns { type: "json", value: Promise { <pending> } }


    if(!request.hasBody) {
        response.status = 400;
        response.body = { message: "No data provided"};
        return;
    }


    const values = await body.value;


    console.log(values.text, 'LINE2');


  
    const todoIndex = todos.findIndex((todo) => {
      return todo.id === todoId;
    });
  
    todos[todoIndex].text = values.text;




    todos[todoIndex].text
  

    
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


    const newTodo: Todo = {
        id: Math.random().toString(),
        // text: request.body.text
       text: values.text
    }



    todos.push(newTodo);

    
    response.status = 201;
    response.body = {
        message: 'Created todo',
        data: todos
    }


}


export const deleteTodo = ({request, response, params }: {
    request: Request,
    response: Response,
    params: any





}) => {



    const todoId = params.todoId;


    todos.filter((todo) => {
        return todo.id !== todoId;
      });

    
    response.status = 200;
    response.body = {
        message: 'DELETED TODO',
        data: todos
    }


}
