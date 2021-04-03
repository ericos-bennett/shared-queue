import express from 'express';
import httpServer from 'http';
import cookieParser from 'cookie-parser';
import { Server, Socket } from "socket.io";
import routes from './routes';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

const server = httpServer.createServer(app);

const io = new Server(server, {
  // Options ...
});

io.on("connection", (socket: Socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('join room', (roomId: string) => {
    socket.join(roomId);
    console.log(`Socket joined room: ${roomId}`);
    socket.to(roomId).emit('data', 'Another user joined the room!');
  });
});

const port: string | number = process.env.PORT || 8080;
server.listen(port, () => console.log('App is listening on port ' + port));
