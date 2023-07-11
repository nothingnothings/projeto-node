"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.editTodo = exports.createTodo = exports.getTodos = void 0;
let todos = []; ////uso de TYPESCRIPT...
const getTodos = (req, res, next) => {
    res.status(200).json({
        message: 'Got all Todos',
        todos: todos,
    });
};
exports.getTodos = getTodos;
const createTodo = (req, res, next) => {
    const newTodo = {
        id: new Date().toISOString(),
        text: req.body.text,
    };
    todos.push(newTodo);
    res.status(201).json({
        message: 'Added Todo',
        todos: todos,
    });
};
exports.createTodo = createTodo;
const editTodo = (req, res, next) => {
    const params = req.params;
    const body = req.body;
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
exports.editTodo = editTodo;
const deleteTodo = (req, res, next) => {
    const params = req.params;
    const todoId = params.todoId;
    todos.filter((todo) => {
        return todo.id !== todoId;
    });
    res.status(200).json({
        message: 'Deleted Todo',
        todos: todos,
    });
};
exports.deleteTodo = deleteTodo;
