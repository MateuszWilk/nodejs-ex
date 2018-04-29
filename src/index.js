import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

import * as WebSocket from 'ws';
// import Boat from './models/boat'

let app = express();
let server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));


	/**
	 * ================================
	 * WEBSOCKET PART
	 * ================================
	 */
	const wss = new WebSocket.Server({ server });

	wss.on('connection', (ws) => {

		//connection is up, let's add a simple simple event
		ws.on('message', (message) => {

			//log the received message and send it back to the client
			console.log(`received: ${message}`);

			const Boat = db.model('boat');
			let boat = new Boat;
			let req = JSON.parse(message);
			boat.name = req.name;
			boat.lat = req.lat;
			boat.lng = req.lng;
			boat.date = Date.now();

			boat.save(function (err) {
				if (!err) console.log('Success!');
			});

			console.log(`received: ${ boat.date }`);
			
			// ws.send(`Hello, you sent -> ${message}`);
			
			wss.clients
				.forEach(client => {
					if (client != ws) {
						// client.send(`Hello, broadcast message -> ${message}`);
						client.send( JSON.stringify(boat) );
					}    
				});
		});

		//send immediatly a feedback to the incoming connection    
		ws.send('Hi there, I am a WebSocket server');
	});

	/**
	 * ================================
	 * WEBSOCKET PART
	 * ================================
	 */

	server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${server.address().port}`);
	});
});

export default app;
