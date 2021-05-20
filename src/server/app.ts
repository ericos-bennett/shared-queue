import express from 'express';
import httpServer from 'http';
import cookieParser from 'cookie-parser';
import { initializeWs } from './utils';
import routes from './routes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// Add express middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle API calls in separate file
app.use('/api', routes);

const server = httpServer.createServer(app);

// Add WS to http server
initializeWs(server);

const port: string | number = process.env.PORT || 8080;
server.listen(port, () => console.log('App is listening on port ' + port));
