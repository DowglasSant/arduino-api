import 'reflect-metadata';
import routes from './routes';
import { createConnection } from 'typeorm';
import express, { NextFunction, Request, Response } from 'express';
import AppError from '../../errors/AppErrors';
import { celebrate, errors, Joi, Segments } from 'celebrate';
import ArduinoDataController from '../../../modules/arduinodata/infra/http/controller/ArduinoDataController';

const app = express();

app.use(express.json());

createConnection();

const arduinoDataController = new ArduinoDataController();

app.post("/arduinodata", celebrate({
    [Segments.BODY]: {
        arduinoId: Joi.string().required(),
        distance: Joi.number().required(),
        sendAt: Joi.string().required()
    }
}),
    arduinoDataController.addData);

app.use(errors());

app.use(
    (error: Error, request: Request, response: Response, next: NextFunction) => {
        if (error instanceof AppError) {
            return response.status(error.statusCode).json({
                status: 'error',
                message: error.message,
            });
        }

        return response.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    },
);

app.listen(3000, () => {
    console.log("Server started on port 3000");
})