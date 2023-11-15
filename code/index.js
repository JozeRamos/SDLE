// index.js

import express from 'express';
import { Node } from "./src/node.js";

const app1 = express();
const app2 = express();

// Handler method 
const handler = num => (req,res)=>{
	const { method, url, headers, body } = req;
	res.send('Response from server ' + num);
}

// Create instances of the Node class and initialize with ports
const node1 = new Node();
node1.init(3000);

const node2 = new Node();
node2.init(3001);
