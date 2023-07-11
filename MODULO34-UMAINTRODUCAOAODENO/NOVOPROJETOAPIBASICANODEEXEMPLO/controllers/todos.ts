import { Request, Response, NextFunction } from 'express'; ///soluciona nosso problema de 'auto-correct'....

type Todo = {
  text: string;
  id: string;
};

type RequestBody = {
  text: string;
};

type RequestParams = {
  todoId: string;
};

let todos: Todo[] = []; ////uso de TYPESCRIPT...

export const getTodos = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: 'Got all Todos',
    todos: todos,
  });
};

export const createTodo = (req: Request, res: Response, next: NextFunction) => {
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: req.body.text,
  };

  todos.push(newTodo);

  res.status(201).json({
    message: 'Added Todo',
    todos: todos,
  });
};

export const editTodo = (req: Request, res: Response, next: NextFunction) => {
  const params = req.params as RequestParams;

  const body = req.body as RequestBody;

  const todoId = params.todoId;

  const todoText = body.text;

  const todoIndex = todos.findIndex((todo) => {
    return todo.id === todoId;
  });

  todos[todoIndex].text = todoText;

  res.status(201).json({
    message: 'Edited Todo',
    todos: todos,
  });
};

export const deleteTodo = (req: Request, res: Response, next: NextFunction) => {
  const params = req.params as RequestParams;

  const todoId = params.todoId;

  todos.filter((todo) => {
    return todo.id !== todoId;
  });

  res.status(200).json({
    message: 'Deleted Todo',
    todos: todos,
  });
};
