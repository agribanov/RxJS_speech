const path = require('path');
const express = require('express');
const app = express();
const data = require('./data.json');

function searchLocation(query) {
    query = query.toLowerCase();

  return (location) => {
      return query && location.name.toLowerCase().includes(query);
  }
}

app.use('/', express.static(path.join(__dirname, '../client')))

app.get('/locations', (req, res) => {
    if (!req.query.search) {
        res.json([]);        
    } else {
        res.json(data.filter(searchLocation(req.query.search)));
    }
});

app.listen(8080, () => console.log('server started'));
