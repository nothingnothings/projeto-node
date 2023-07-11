"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTodo = exports.deleteTodo = exports.createTodo = exports.getTodos = void 0;
const express_validator_1 = require("express-validator");
// type Todo = { ///PROFESSOR DECIDE IMPORTAR ISSO DE UM FOLDER EXTERNO, 'models'... 
// }
// const todos: string[] = []; ///array de STRINGS....  (porém só inicialmente, pq vamos querer que seja um ARRAY DE OBJETOS 'todo' --> type aliasing)....
// const todos: Array<Todo> = []; ///SINTAXE COMPLETA DE COMO ASSIGNAR O TYPE 'todo' COMO INNERTYPE DESSE GENERIC TYPE (que é o array em si)....
let todos = []; ///SINTAXE COMPLETA DE COMO ASSIGNAR O TYPE 'todo' COMO INNERTYPE DESSE GENERIC TYPE (que é o array em si)....
//queremos uma VARIABLE, e não const, pq vamos SUBSTITUIR ESSE ARRAY POR UM ARRAY SEM O TODO QUE QUEREMOS 'DELETAR'...
// const todos: Todo[] = []; /É UM SHORTCUT PARA A SINTAXE LOGO ACIMA.... (de definição de inner type do generic type que é o array...)
const getTodos = (req, res, next) => {
    console.log('TODO');
    res.status(200).json({
        todos: todos //vamos retornar esse array, na nossa response..
    });
};
exports.getTodos = getTodos;
console.log('TESTTasaassasasREEasaasasasasdasdssadssdsas');
console.log('EXAMPLE121');
const createTodo = (req, res, next) => {
    // const newTodo = new Todo( ///sintaxe ERRADA (isso não é um model mongoose, e sim um model normal)....
    //     {
    //     }
    // )
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        //   const error = new Error('Validation failed, entered data is incorrect.');
        //   error.statusCode = 422;
        //   throw error; //vai fazer com que entremos NO MIDDLEWARE ESPECIAL DE ERROR HANDLING, LÁ EM 'app.js'...  (USE 'throw err' com códigos SYNC, e 'next(err)' com códigos ASYNC... )
        return res.status(422).json({
            message: 'ENTERED DATA IS INVALID',
            errors: errors
        });
    }
    // const body = req.body as { ///TYPE __ CONVERSION__ do typescript... (definirá esse formato COMO O VÁLIDO PARA 'body', no CONTEXTO DESTE CONTROLLER ESPECÍFICO de 'get todos')....
    //     text: string  //essa será a única propriedade tida como 'válida' dentro de nosso 'body', no contexto desse controller...
    // }
    const body = req.body; ////^^^^ É O MESMO CÓDIGO LOGO DE CIMA, aquele 'const body = req.body as {text: string}' ------> ENTRETANTO, NESSA VERSÃO AQUI usamos um 'type alias', para fazer OUTSOURCE DE NOSSO TYPE lá em cima... (type que define a estrutura do nosso 'body' nesse controller).... 
    //////VVVVVVV --> esse trecho aí, se o escrevemos, é a coisa que VAI NOS 'FORÇAR A DEFINIR ESSE OBJECT EM UM FORMATO COMPATÍVEL COM O MODELO/INTERFACE DE Todo, definido lá no nosso MODEL....""
    const newTodo = {
        // id: 'String',
        // text: 'EXEMPLO' 
        id: new Date().toISOString(),
        // text: req.body.text ///precisamos do BODYPARSER para isso... ------> ///O objeto 'body' SEMPRE SERÁ, INICIALMENTE, UM objeto de 'TYPE: ANY'....
        text: body.text
        //texts: req.body.texts ///isso aparecerá como INVÁLIDO, pq é isso que definimos logo ali em cima, com 'const body = req.body as {text: string}
    };
    todos.push(newTodo); ///esse todo vai passar a existir NA MEMÓRIA DE NOSSO APP, lá naquele array...
    res.status(201).json({
        message: 'Created todo',
        todos: todos
    });
};
exports.createTodo = createTodo;
const deleteTodo = (req, res, next) => {
    const params = req.params;
    // const todoId = req.params.todoId;
    const todoId = params.todoId; /// acessamos esse 'type' aí... (definido GLOBALMENTE)...
    /// const todoIds = params.todoIds; //não existe no type 'RequestParams' --> isso nos providencia TYPE SAFETY...
    todos.find((todo) => {
        return todo.id === todoId;
    });
    if (todos.length === 0) {
        return res.status(404).json({
            message: 'Todo could not be found'
        });
    }
    todos = todos.filter((todo) => {
        return todo.id !== todoId;
    });
    res.status(200).json({
        message: 'Deleted todo successfully',
        data: todos
    });
};
exports.deleteTodo = deleteTodo;
const editTodo = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({
            message: 'ENTERED DATA IS INVALID',
            errors: errors
        });
    }
    ;
    const params = req.params;
    const body = req.body; ///DEFINE O FORMATO DE NOSSO 'BODY' (que terá só a propriedade 'text', sem NENHUMA OUTRA, nenhuma outra como 'texts', por exemplo...)
    // const todoId = req.params.todoId; ////'req.params' É UM OBJETO DE 'type: any'... ( pode ser qualquer coisa...) -> MESMA COISA COM o 'body', QUE TAMBÉM TEM ESSE 'type:any'.... 
    const todoId = params.todoId;
    // const inputtedText = req.body.text;
    const inputtedText = body.text;
    const todoIndex = todos.findIndex((todo) => {
        return todo.id === todoId;
    });
    console.log(todoIndex);
    if (todoIndex >= 0) {
        todos[todoIndex].text = inputtedText;
        return res.status(200).json({
            message: 'Updated todo',
            todos: todos
        });
    }
    res.status(404).json({
        message: 'Could not find todo for this id.'
    });
};
exports.editTodo = editTodo;
