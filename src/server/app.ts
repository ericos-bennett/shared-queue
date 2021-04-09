import express from 'express';
import httpServer from 'http';
import cookieParser from 'cookie-parser';
import { Server, Socket } from "socket.io";
import routes from './routes';
import dotenv from 'dotenv';
dotenv.config();

/*-------------------------
-- Express Server Config --
-------------------------*/
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle API calls in separate file
app.use('/api', routes);

const server = httpServer.createServer(app);

/*-----------------------------
-- Websockets Initialization --
-----------------------------*/
const io = new Server(server, {
  // Options ...
});

io.on("connection", (socket: Socket) => {
  console.log('Socket connected:', socket.id);

  // Join Room hanlder
  socket.on('join', (roomId: string) => {
    socket.join(roomId);
    console.log(`Socket joined room: ${roomId}`);
    console.log('Rooms: ', io.sockets.adapter.rooms);
    socket.to(roomId).emit('data', 'Another user joined the room!');
  });

  // Delete Track handler
  socket.on('delete', (playlistId: string, index: number) => {
    console.log(`Deleting track ${index} from playlist id: ${playlistId}`);
    socket.to(playlistId).emit('delete', index);
  })

});

/*---------------
-- Port Config --
---------------*/
const port: string | number = process.env.PORT || 8080;
server.listen(port, () => console.log('App is listening on port ' + port));
