


import { Router } from "https://deno.land/x/oak/mod.ts"; ///MESMA FEATURE/FUNÇÃO DE 'routing' DO EXPRESS ROUTER...

import { getTodos, deleteTodo, editTodo, createTodo } from '../controllers/todos.ts'




const router = new Router();











// router.get('/', (ctx, next) => {}); ////// RECEBEMOS 'CTX' E 'NEXT' em vez de 'req, res, next'..




router.get('/todos', getTodos);








router.post('/todos', createTodo);





router.put('/todos/:todoId', editTodo);






router.delete('/todos/:todoId', deleteTodo);





export default router; ////////SINTAXE DE EXPORTS ES6, e não 'NODE'....