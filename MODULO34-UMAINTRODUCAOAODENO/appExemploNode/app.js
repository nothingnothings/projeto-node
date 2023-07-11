"use strict";
// import fs from 'fs';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import path from 'path'; ///ESSES 2 TIPOS DE CÓDIGO (que importam CORE NODE MODULES) não vao funcionar com o typescript.... siga o modelo logo abaixo:
const fs = __importStar(require("fs/promises")); ////vamos querer a versão PROMISES desse código do 'fileSystem'....
// One more thing - you will need to tell the typescript compiler where do these come from - it is done in the tsconfig.json, with 
// the following line: "compilerOptions": { "types": [ "node" ] } //// CERTO, ISSO FUNCIONOU....
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const text = 'this is a text - and it should be stored in a file, with the help of NODE.';
const filePath = 'message.txt';
fs.writeFile(filePath, text)
    .then((result) => {
    console.log(result);
    console.log('Wrote file!');
})
    .catch((error) => {
    console.log(error);
});
app.get('/', (req, res, next) => {
    res.send('Hello World!');
});
app.listen(3000);
//VERSÃO DO DENO DESTE NOSSO CÓDIGO:
// const text = 'this is a text - and it should be stored in a file';
// const encoder = new TextEncoder();  ////CONSTRUCTOR FUNCTION __ DISPONÍVEL___ GLOBALMENTE NO DENO.... (vamos o utilizar para CONVERTER NOSSA STRING EM BYTES, EM 1 DATA NO FORMATO 'Uint8Array', que é o formato ACTUALLY SUPORTADO POR 'writeFile'...)
// const data = encoder.encode(text);
// Deno.writeFile('message.txt', data)
// .then(
//     (result) => { ////COMO O DENO É UMA LANGUAGE QUE 'embraces new javascript features', ELE ACEITA TOTALMENTE PROMISES, E ODEIA CALLBACKS em funções... (pq elas fedem)...
//             console.log( ///NOSSO CÓDIGO VAI __ FALHAR/DAR ERROR, INICIALMENTE, POR 'FALTA DE PERMISSOES' no execute dessa função...
//                 'wrote to file!'
//             )
//     }
// )
// .catch(
//     (err) => {
//         console.log(err);
//     }
// )
