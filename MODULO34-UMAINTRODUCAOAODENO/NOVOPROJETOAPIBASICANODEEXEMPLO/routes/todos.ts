
import { Router } from "express";

import { getTodos, deleteTodo, editTodo, createTodo } from '../controllers/todos';


const router = Router();






router.get('/todos', getTodos);






router.post('/todos', createTodo );




router.put('/todos/:todoId', editTodo );



router.delete('/todos/:todoId', deleteTodo);






export default router;