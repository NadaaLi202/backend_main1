import express from'express';
import { dbConnect } from './dbconnected.js'
import userRoutes from './routes/userRoutes.js'

import AppError from './handleErrors/appError.js';
import globalErrorHandler from './handleErrors/globalError.js';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express()
app.use(express.json())
dbConnect()

app.use('/api/v1/users',userRoutes);


app.all('*', (req, res, next) => {
    return next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));//update here by return//class AppError extends Error
  });
app.use(globalErrorHandler)


app.get('/', (req, res) => res.send('Hello World!'))
//import { join } from "path"
 export default app;