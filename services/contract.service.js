const solc = require('solc');
const fs = require('fs');
const Web3 = require('web3')


module.exports = (urlProvider = 'http://localhost:8545') => {
    const web3 = new Web3(new Web3.providers.HttpProvider(urlProvider));

    let getABIandByteCodefromContract = (contractName, cb) => {
        let abiDefinition = null, byteCode = null;
        return fs.readFile(`./contracts/${contractName}.sol`, (err, file) => {
            if (err) {
                return cb(err);
            } else {
                let compiledCode = solc.compile(file.toString());
                try {
                    console.log(`already enter here`);
                    
                    abiDefinition = JSON.parse(compiledCode.contracts[`:${contractName}`].interface);
                    byteCode = compiledCode.contracts[`:${contractName}`].bytecode;

                    console.log({
                        abiDefinition,
                        byteCode
                    });
                    

                    return cb(null, {
                        abiDefinition,
                        byteCode
                    });
                } catch (e) {
                    return cb(new Error('Unable to parse and compile contract code !'));
                }
            }
        });
    }

    let getContractInstance = (contractName, contractAddress, cb) => {
        console.log('method contract instance');
        return getABIandByteCodefromContract(contractName, (err, contractMetadata) => {
            console.log('getting contract instance');
            if (err) {
                console.log('ERROR');
                console.log(err);
                return cb(err);
            } else {
                console.log('success');
                let abi = contractMetadata.abiDefinition;
                const contract = web3.eth.contract(abi);
                const instance = contract.at(contractAddress);
                return cb(null, instance);
            }
        });
    }

    let deployNewContract = (accountAddress = web3.eth.accounts[0], contractName, params, cb) => {
        console.log('deploy new contract');
        getABIandByteCodefromContract(contractName, (err, metadata) => {
            if (err) {
                return cb(new Error(err));
            } else {

                let web3Contract = web3.eth.contract(metadata.abiDefinition);
                let deployedContract = web3Contract.new(params, { data: metadata.byteCode, from: accountAddress, gas: 4700000 });
                let receipt = web3.eth.getTransactionReceipt(deployedContract.transactionHash);

                if (receipt && receipt.contractAddress) {
                    return cb(null, {
                        transactionHash: receipt.transactionHash,
                        contractAddress: receipt.contractAddress
                    });
                } else {
                    return cb(new Error("Deploy ok but contract Address = null"));
                }
            }
        });
    }

    return {
        getContractInstance,
        getABIandByteCodefromContract,
        deployNewContract
    }
}
