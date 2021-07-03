const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const uri = 'mongodb+srv://kikmess:kikmess99@kaloyan.pfzry.mongodb.net/kikmess';
const app = express();
const path = require('path');
const port = 7777;

function connectToDb(cb, collection) {
    MongoClient.connect(uri, { useUnifiedTopology: true }, async function (err, client) {
        if (err) throw err;
        await cb(client.db('kikmess').collection(collection || 'kikmess'));
        client.close();
    });
}

app.use(express.static(path.resolve(__dirname + '\\..\\dist\\')));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname + '\\..\\dist\\index.html'));
});

const server = require('http').createServer(app);
const options={
    cors:true,
    origins:["*"],
   };

const io = require('socket.io')(server, options);

io.on('connection', (socket) => {
    socket.on('user-connected', (user) => {
        connectToDb(async (collection) => {
            const room = await collection.findOne({chatroom: 'public-chat'});
            
            if (!room) collection.insertOne({chatroom: 'public-chat'});
            
          socket.emit('server-changed', room);
        });
        console.log(`${user} connected`);
    });

    socket.on('user-changed-server', (data) => {
        console.log(data);
        connectToDb(async (collection) => {
            const room = await collection.findOne({ chatroom: data.chatroom });
            
            if (room) {
                if (room.id === 'public-chat' || room.password == data.password) {
                    socket.emit('server-changed', room);
                } else {
                    socket.emit('server-wrong-password', { status: 'error', message: `Wrong password for server with id: ${room.chatroom}` })
                }
            } else {
                collection.insertOne({chatroom: data.chatroom, password: data.password});
                socket.emit('server-changed', room);
            }
        });
    });

    socket.on('new-message-added', (message) => {
        connectToDb(async (collection) => {
            const room = await collection.findOne({chatroom: message.chatroom});
            
            if (room) {
                if (room.messages) {
                    room.messages.push(message.message);
                } else room.messages = [message.message];
                
                await collection.replaceOne({ chatroom: message.chatroom }, room);

                socket.broadcast.emit('new-message-sent', room);
            } else {
                socket.emit('server-unknown-room', { status: 'error', message: `Couldn't find server with id: ${message.chatroom}` })
            }
        });
    });


    // API
    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', (data));
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
    });

    socket.on('stopTyping', (data) => {
        socket.broadcast.emit('stopTyping', (data));
    });

    socket.on('joined', (data) => {
        socket.broadcast.emit('joined', (data));
    });

    socket.on('user-disconnected', (username) => {
        socket.broadcast.emit('user-disconnected', (username));
        console.log(`${username} disconnected`);
    });
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});