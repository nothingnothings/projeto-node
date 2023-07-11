import { Router } from 'express';

import { getTodos, createTodo, deleteTodo, editTodo } from '../controllers/todo';

import { check, body } from 'express-validator';

const router = Router();

router.get(
  '/',

  getTodos
);

router.post(
  '/todo',
  [
  body('text')
  .trim()
  .isLength({ min: 6 })
  .withMessage('Text should be more than 6 characters long.')

  ],
  createTodo
);










router.delete('/todo/:todoId', 

deleteTodo


);




console.log('EXAMPLECASCSasasA');



router.put(
  '/todo/:todoId',


  editTodo
)













export default router;
