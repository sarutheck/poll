import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let words = {}; // { word: count }

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Send current words to the newly connected client
    socket.emit('wordUpdate', words);

    socket.on('submitWord', (word) => {
        if (!word) return;
        const cleanWord = word.trim().toLowerCase();
        if (cleanWord) {
            words[cleanWord] = (words[cleanWord] || 0) + 1;
            io.emit('wordUpdate', words);
        }
    });

    socket.on('reset', () => {
        words = {};
        io.emit('wordUpdate', words);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
