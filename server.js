const express = require('express');
const bodyParser = require('body-parser');

const contractService = require('./services/contract.service.js')('http://localhost:8545');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;


app.get('/api/checkHash', (req, res) => {
    //let val = contractInstance.hashList.call().toString();
    let contractAddress = req.query.contractAddress;
    let hashString = req.query.hash;

    contractService.getContractInstance('Voting', req.query.contractAddress, (err, instance) => {
        if (err) {
            return res.status(500).json({ "error": err });
        } else {
            res.send(instance.checkDocumentHash.call(hashString).toString());
        }

    });
});


app.get('/api/deployContract/:contract', (req, res) => {
    let contractName = req.params.contract;
    return contractService.deployNewContract(undefined, contractName, ['Nick', 'Rams'], (err, contract) => {
        console.log(contract);
        if (err) {
            return res.status(500).json({ "error": err });
        } else {
            console.log(contract);
            return res.status(200).json(contract);
        }

    });
});



app.listen(port, () => console.log(`Listening on port ${port}`));