import express from 'express';
import { Node } from './src/node.js';

// Handler method 
const handler = num => (req,res)=>{
	const { method, url, headers, body } = req;
	res.send('Response from server ' + num);
}

const PORT = process.env.PORT || 3000;
const PORT1 = process.env.PORT || 3001;

const node = new Node();
await node.init(PORT);

const node1 = new Node();
await node1.init(PORT1);

// node.app.get('*', handler(1)).post('*', handler(1));
// node1.app.get('*', handler(2)).post('*', handler(2));

