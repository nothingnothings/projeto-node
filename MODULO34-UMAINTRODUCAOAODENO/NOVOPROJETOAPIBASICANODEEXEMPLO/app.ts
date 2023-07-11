

import express from 'express';



import todoRoutes from './routes/todos';



import bodyParser from 'body-parser';





const app = express();


app.use(bodyParser.json());





app.use(
    (req, res, next) => {

            console.log('Some middleware!');
            next();
    }
)


app.use(todoRoutes);








app.listen(3000);