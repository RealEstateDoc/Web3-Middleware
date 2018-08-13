const express = require('express');
const bodyParser = require('body-parser');
const contractConfig = require('config').get('contract');
const contractService = require('./services/contract.service.js')(require('config').get('provider'));
const config = require('config');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;


app.post('/api/whitelist', (req, res) => {
    let addressList = new Array(req.body.address);

    contractService.sendTransactionRaw('WHITELIST', addressList, "addWhiteListed", {
        address: config.get('contract.whiteLister.address'),
        private: config.get('contract.whiteLister.private')
    }, config.get('contract.address'), function (err, hash) {
        if (err) {
            return res.status(500).json({ "error": err });
        } else {
            return res.status(200).json({
                txid: hash
            });
        }
    });
});


app.delete('/api/whitelist', (req, res) => {
    let address = req.body.address;
    contractService.sendTransactionRaw('WHITELIST', address, "removeWhiteListed", {
        address: config.get('contract.whiteLister.address'),
        private: config.get('contract.whiteLister.private')
    }, config.get('contract.address'), function (err, hash) {
        if (err) {
            return res.status(500).json({ "error": err });
        } else {
            return res.status(200).json({
                txid: hash
            });
        }
    });
});


app.listen(port, () => console.log(`Listening on port ${port}`));