import express from 'express';
import routes from './routes';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('App is listening on port ' + port));
