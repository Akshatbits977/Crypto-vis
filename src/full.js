const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const MergedData = require('./MergedData.js');

const app = express();
const port = 3011;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

mongoose.connect('mongodb://localhost/crypto_db', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/fetchCollectionData/:collectionName', async (req, res) => {
    const collectionName = req.params.collectionName;
    let data;
    if (collectionName === "merged") {
        data = await MergedData.find({});
    } else {
        return res.status(400).send();
    }
    res.send(data);
});

app.post('/saveMergedData', async (req, res) => {
    let incomingMergedData = req.body;
    let savedMergedData = await MergedData.create(incomingMergedData);
    res.send({ data: savedMergedData });
});

// Handle client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Express server currently running on http://perfwsw3.aus.stglabs.ibm.com:${port}/`);
});

