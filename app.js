const express = require('express');
const path = require('path');
const service = require('./services/github/middleware-get');

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));
app.get('/get-pulls', service.gitHubMiddlewareGetPulls());

app.listen(port);
console.log('Server started at http://localhost:' + port);