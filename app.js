const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);


const server_dir = path.join(__dirname, 'public');
const port = process.env.PORT || 3000;

app.use(express.static(server_dir));

server.listen(port, () => console.log(`Server started on port ${port}`));