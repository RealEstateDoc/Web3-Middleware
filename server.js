const express = require('express');
//web3 add
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const abi = JSON.parse('[{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"bytes32"}],"name":"bytes32ToString","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contractOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"type":"constructor"}]')
const VotingContract = web3.eth.contract(abi);
const contractInstance = VotingContract.at('0x695843749315696ce25527422b0f957a144dfc83');
const solc = require('solc');
const fs = require('fs');


const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

app.get('/api/candidate/:name', (req, res) => {
    let val = contractInstance.totalVotesFor.call('Nick').toString();
    res.send({ express: "Candidate Name: " + req.params.name });
});

app.get('/api/votes/:name', (req, res) => {
    let val = contractInstance.totalVotesFor.call(req.params.name).toString();
    res.send({ express: "Candidate Name: " + req.params.name + " Votes: " + val });
});

app.get('/api/deployContract/:contract', (req, res) => {
    let contractName = req.params.contract.toLowerCase();
    fs.readFile(`./contracts/${contractName}.sol`, (err, file) => {
        if (err) {
            res.status(500).json({ error: "Not Found contract" });
        } else {
            let compiledCode = solc.compile(file.toString());
            let abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
            let VotingContract = web3.eth.contract(abiDefinition);
            let byteCode = compiledCode.contracts[':Voting'].bytecode;
            let deployedContract = VotingContract.new(['Rama', 'Nick', 'Jose'], { data: byteCode, from: web3.eth.accounts[0], gas: 4700000 });
            let receipt = web3.eth.getTransactionReceipt(deployedContract.transactionHash);
            if (receipt && receipt.contractAddress) {
                res.status(200).json({
                    transactionHash: receipt.transactionHash,
                    contractAddress: receipt.contractAddress
                });
            } else {
                res.status(500).json({});
            }
        }
    });
    

});

app.listen(port, () => console.log(`Listening on port ${port}`));