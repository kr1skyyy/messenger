const http = require("http");
const hostname = 'localhost';
const port = 3000;
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://kikmess:kikmess99@kaloyan.pfzry.mongodb.net/';

MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
}); 
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});