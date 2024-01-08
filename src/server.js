const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const MergedData = require('./MergedData.js');

const app = express();
const port = 3011;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://perfwswadmin:perfwswadmin123@perfwsw3.aus.stglabs.ibm.com:27017/crypto_db?authSource=admin', { useNewUrlParser: true });

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

// ... other routes and configurations

// HTTPS Configuration
var keyPath = '/etc/ssl/private/perfwsw.key';
var certPath = '/etc/ssl/certs/perfwsw.crt';

const credentials = {
    key: fs.readFileSync(keyPath, 'utf8'),
    cert: fs.readFileSync(certPath, 'utf8'),
};

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`Express server currently running on https://perfwsw3.aus.stglabs.ibm.com:${port}/`);
});

