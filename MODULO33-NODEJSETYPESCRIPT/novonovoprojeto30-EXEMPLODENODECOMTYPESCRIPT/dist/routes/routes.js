"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_1 = require("../controllers/todo");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get('/', todo_1.getTodos);
router.post('/todo', [
    (0, express_validator_1.body)('text')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Text should be more than 6 characters long.')
], todo_1.createTodo);
router.delete('/todo/:todoId', todo_1.deleteTodo);
console.log('EXAMPLECASCSasasA');
router.put('/todo/:todoId', todo_1.editTodo);
exports.default = router;
