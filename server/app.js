const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const uri = 'mongodb+srv://kikmess:kikmess99@kaloyan.pfzry.mongodb.net/kikmess';
const app = express();
const port = 3000;

function connectToDb(cb) {
    MongoClient.connect(uri, async function (err, client) {
        if (err) throw err;
        await cb(client.db('kikmess').collection('kikmess'));
        client.close();
    });
}

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/server', (req, res) => {
    console.log(req.body);
    connectToDb(async (collection) => {
        const room = await collection.findOne({chatroom: req.body.chatroom});
        
        if (room) {
            if (room.password == req.body.password) {
                res.json(room);
            }
        } else {
            collection.insertOne(req.body);
            res.json(req.body);
        }
    })
});

app.post('/send-message', (req, res) => {
    connectToDb(async (collection) => {
        //
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});