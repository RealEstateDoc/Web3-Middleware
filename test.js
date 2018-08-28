const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/gZXjFZI0io2O0HexZV6c'));
let contractService = require('./services/contract.service')('https://rinkeby.infura.io/gZXjFZI0io2O0HexZV6c');
let contractAddress = '0x7a824ee91d12c9eb6323194196b28562c41c3ac1';
let config = require('config');

let aliceAdd = '0x8B774afFBb38d87767fCa579A289a01787572493';
let alicePrivateKey = '87419ebded4154928ae64c6530ac1894050b2528e4e52800e0a9e6ff73057e6d';


describe('Interact with contract', function () {
    it('delete from the whitelist', function (done) {
        var addressList = ["0x99F43B22c1D3202B891908540F6048D3e76Ea692"];
        contractService.sendTransactionRaw('WHITELIST', addressList, "removeWhiteListed", {
            address: config.get('contract.whiteLister.address'),
            private: config.get('contract.whiteLister.private')
        }, config.get('contract.address'), function (err, hash) {
            console.log(err || hash);
            done();
        });
    });
    it.skip('add new to the whitelist', function (done) {
        var addressList = ["0x99F43B22c1D3202B891908540F6048D3e76Ea692"];
        contractService.sendTransactionRaw('WHITELIST', addressList, "addWhiteListed", {
            address: config.get('contract.whiteLister.address'),
            private: config.get('contract.whiteLister.private')
        }, config.get('contract.address'), function (err, hash) {
            console.log(err || hash);
            done();
        });
    });
    it.skip('call doc Hash', function (done) {

        contractService.addNewHash(111, "0x7521d1cadbcfa91eec65aa16715b94ffc1c9654ba57ea2ef1a2127bca1127a86", {
            address: aliceAdd,
            private: alicePrivateKey
        }, contractAddress, 'addDocumentHash', function (err, hash) {
            console.log(err || hash);
            done();
        });
    });

    it.skip('check config', function (done) {
        console.log(config.get('provider'));
        console.log(config.get('contract'));
        console.log(config.get('contract.address'));
        done();
    })
    it.skip('call smart contract property', (done) => {
        var testInstance = null
        contractService.getContractInstance('Voting', contractAddress, (err, instance) => {
            testInstance = instance;
        });
    });

    it.skip('Add voter to contract', (done) => {
        var testInstance = null
        contractService.getContractInstance('Voting', contractAddress, (err, instance) => {
            testInstance = instance;
            testInstance.addNewVoter.call(5, '0xed973b234cf2238052c9ac87072c71bcf33abc1bbd721018e0cca448ef79b377', function (err, transaction) {
                console.log(err || transaction);
                done();
            });


        });


    });

    it.skip('get signed transaction', (done) => {
        //let getSignedTransaction = (docId, hashstr, from, to, method, cb) =>{
        var from = {
            address: aliceAdd,
            private: alicePrivateKey
        };
        var to = '0x7a824ee91d12c9eb6323194196b28562c41c3ac1';
        contractService.getSignedTransaction(22, '0x7521d1cadbcfa91eec65aa16715b94ffc1c9654ba57ea2ef1a2127bca1127a83', from, to, 'addDocumentHash', (err, data) => {
            console.log(err || data);
            done();
        });

    });
});

// describe.skip('Deploy contract', function () {
//     it();
//     it.skip('compile and deploy contract', function (done) {
//         const Web3 = require('web3');
//         const solc = require('solc');
//         const fs = require('fs');
//         web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//         console.log(web3.eth.accounts);
//         let code = fs.readFileSync('./contracts/Voting.sol').toString();
//         let compiledCode = solc.compile(code);
//         let abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
//         console.log('ABI DEFINITION********************');
//         console.log(abiDefinition);

//         let VotingContract = web3.eth.contract(abiDefinition);
//         let byteCode = compiledCode.contracts[':Voting'].bytecode;
//         console.log('byteCode ********************');
//         console.log(byteCode);
//         let deployedContract = VotingContract.new(['Rama', 'Nick', 'Jose'], { data: byteCode, from: web3.eth.accounts[0], gas: 4700000 });
//         console.log(`as of now, contract address = ${deployedContract.address}`);
//         console.log(deployedContract);
//         console.log(deployedContract.transactionHash);

//         let receipt = web3.eth.getTransactionReceipt(deployedContract.transactionHash);
//         console.log(receipt);
//         done();
//         // while (!deployedContract.address) {
//         //     if (deployedContract.address) {
//         //         console.log(`contract address = ${deployedContract.address}`);
//         //         done();
//         //     } else {
//         //         console.log('Nope, not deployed yet');
//         //         console.log(deployedContract.address);
//         //     }
//         // }
//         // setTimeout(function () {
//         //     console.log(`contract address = ${deployedContract.address}`);
//         //     done();
//         // }, 5000);



//     });



//     it.skip('compile and deploy contract async', function (done) {
//         const Web3 = require('web3');
//         const solc = require('solc');
//         const fs = require('fs');
//         web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//         console.log(web3.eth.accounts);
//         let code = fs.readFileSync('./contracts/Voting.sol').toString();
//         let compiledCode = solc.compile(code);
//         let abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
//         console.log('ABI DEFINITION********************');
//         console.log(abiDefinition);

//         let VotingContract = web3.eth.contract(abiDefinition);
//         let byteCode = compiledCode.contracts[':Voting'].bytecode;
//         console.log('byteCode ********************');
//         console.log(byteCode);
//         let deployedContract = VotingContract.new(['Rama', 'Nick', 'Jose'], { data: byteCode, from: web3.eth.accounts[0], gas: 4700000 }, function (err, newContract) {
//             if (err) {
//                 console.log('ERROR');
//                 console.log(err);
//             } else {
//                 console.log('SUCCEESS');
//                 console.log(newContract);
//             }
//             done();
//         });
//         // console.log(`as of now, contract address = ${deployedContract.address}`);
//         // console.log(deployedContract);
//         // console.log(deployedContract.transactionHash);
//         // setTimeout(function () {
//         //     console.log(`contract address = ${deployedContract.address}`);
//         //     done();
//         // }, 5000);

//     });
// });