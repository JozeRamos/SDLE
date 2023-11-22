// index.js

import express from 'express';
import { Node } from './src/node.js';


const PORT1 = process.env.PORT || 3000;
const PORT2 = process.env.PORT || 3001;

const node1 = new Node();
const node2 = new Node();

(async () => {
    await node1.init(PORT1);
    await node2.init(PORT2);

    // Handler method 
    const handler = num => (req, res) => {
        const { method, url, headers, body } = req;
        res.send(`Response from server ${num}`);
    }

    
})();
