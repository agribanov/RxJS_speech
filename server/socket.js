const WebSocket = require('ws');
const data = require('./data.json');
const wss = new WebSocket.Server({
  port: 8081
});

wss.on('connection', function connection(ws) {
    const locationIntervals = {};

    ws.on('message', function incoming(message) {
        message = JSON.parse(message);
        
        const location = data.find((location => location.name === message.location));
        
        if (!location) { return; }

        clearInterval(locationIntervals[location]);

        if (message.type == 'start') {
            locationIntervals[location.name] = setInterval(() => {
                const utc = Date.now();

                ws.send(JSON.stringify({
                    location: location.name,
                    date: new Date(utc + (3600000 * location.offset))
                }))
            }, 500);
        }
    });

    ws.on('close', function close() {
        console.log('socket disconnected');

        Object.keys(locationIntervals).forEach((key) => clearInterval(locationIntervals[key]));
    });
 
  ws.send('socket connected');
});
 