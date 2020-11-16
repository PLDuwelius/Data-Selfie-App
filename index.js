const { response } = require('express');
const express = require('express');
const fetch = require('node-fetch');
const Datastore = require('nedb');
require('dotenv').config();

const api_key = process.env.API_KEY;
console.log(api_key);
const app = express();
app.listen(3000, () => console.log('Listening at 3000'));
app.use(express.static('public'));
app.use(express.json({
  limit: '1mb'
}));

const database = new Datastore('database.db');
database.loadDatabase();

//Recieving request from client
app.post('/api', (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});

//Giving data back to client
app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });

});

app.get('/weather/:latlon', async (request, response) => {
  const latlon = request.params.latlon.split(',');
  console.log(latlon);
  const lat = latlon[0];
  const lon = latlon[1];
  const api_url = `https://api.climacell.co/v3/weather/realtime?lat=${lat}&lon=${lon}&unit_system=us&fields=weather_code%2Ctemp&apikey=${api_key}`;
  const fetch_response = await fetch(api_url);
  const json = await fetch_response.json();
  json.message = "Hello from server";
  response.json(json);
})
