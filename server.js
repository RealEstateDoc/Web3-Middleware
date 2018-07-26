const express = require('express');
const bodyParser = require('body-parser');
const contractConfig = require('config').get('contract');
const contractService = require('./services/contract.service.js')(require('config').get('provider'));


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;


app.get('/api/hash', (req, res) => {
    let hashString = req.query.hash;

    contractService.getContractInstance(contractConfig.name, contractConfig.address, (err, instance) => {
        if (err) {
            return res.status(500).json({ "error": err });
        } else {
            var result = instance.checkDocumentHash(hashString).toString();
            return res.send(result);
        }

    });
});


app.post('/api/hash', (req, res) => {
    let docId = req.body.docId;
    let hashString = req.body.hashString;
    let owner = require('config').get('contract.owner');
    contractService.addNewHash(docId, hashString, {
        address: owner.address,
        private: owner.private
    }, contractConfig.address, 'addDocumentHash', function (err, hash) {
        if (err) {
            return res.status(500).json({ "error": err });
        } else {
            return res.status(200).json(hash);
        }
    });
});


// app.get('/api/deployContract/:contract', (req, res) => {
//     let contractName = req.params.contract;
//     return contractService.deployNewContract(undefined, contractName, ['Nick', 'Rams'], (err, contract) => {
//         console.log(contract);
//         if (err) {
//             return res.status(500).json({ "error": err });
//         } else {
//             console.log(contract);
//             return res.status(200).json(contract);
//         }

//     });
// });



app.listen(port, () => console.log(`Listening on port ${port}`));