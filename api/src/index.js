const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

const db = require('./queries');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

app.get('/devices', db.getDevices);
app.get('/devices/:id', db.getDeviceById);
app.post('/devices', db.createDevice);
app.put('/devices/:id', db.updateDevice);
app.delete('/devices/:id', db.deleteDevice);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});