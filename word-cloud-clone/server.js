import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.static(path.join(__dirname, 'dist')));

let words = {}; // { word: count }
let currentQuestion = "What's on your mind?";

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Send current words to the newly connected client
    socket.emit('wordUpdate', words);
    socket.emit('questionUpdate', currentQuestion);

    socket.on('submitWord', (word) => {
        if (!word) return;
        const cleanWord = word.trim().toLowerCase();
        if (cleanWord) {
            words[cleanWord] = (words[cleanWord] || 0) + 1;
            io.emit('wordUpdate', words);
        }
    });

    socket.on('setQuestion', (newQuestion) => {
        if (typeof newQuestion === 'string' && newQuestion.trim()) {
            currentQuestion = newQuestion.trim();
            io.emit('questionUpdate', currentQuestion);
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

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
