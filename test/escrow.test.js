const assert = require('assert');

const contractService = require('../services/contract.service')('http://localhost:8545');

var escrow_contract = null;
var ERC20_Address = '';

const zanis_acc = '0xdb8209274f8dd94ea9d38a7f9feae8ce83fb6388';
const lubu_acc = '0x7c87200958b6831f7b803bc307e3793c4e98dd9e';
const ryoma_acc = '0x7f7d47d2705102e87316d580f462eb72e6ab395b';
//1537189200
const new_escrowContract = {
    tenant: lubu_acc,
    landlord: ryoma_acc,
    contract_id: 456,
    depositValue: 100,
    expiry: Math.round(3600 * 24 + Date.now() / 1000)
};

describe('Surrender Flow of Testing', function () {
    this.timeout(25000);
    var contract_instance = null;
    var erc20_instance = null;
    before(function (done) {
        console.log('Deploy and Setup new contract instance');
        contractService.deployNewContract(zanis_acc, 'Escrow_Contract', undefined, function (err, result) {
            console.log(err || result);
            escrow_contract = result.contractAddress;
            contractService.getContractInstance('Escrow_Contract', escrow_contract, function (err, instance) {
                if (err) {
                    console.log(err);
                } else {
                    contract_instance = instance;
                    ERC20_Address = contract_instance.token().toString();
                    console.log(`ERC 20 address = ${ERC20_Address}`);
                    contractService.getContractInstance('ERC20', ERC20_Address, function (error, contract_erc20) {
                        erc20_instance = contract_erc20;
                        done();
                    });
                }
            });
        });

    });

    it('Test approve ERC20 Tokens to Zanis', (done) => {
        // console.log('balance of Zanis');
        // console.log(erc20_instance.balanceOf(zanis_acc).toString());
        console.log('Before approve to zanis');
        console.log(erc20_instance.allowance(lubu_acc, zanis_acc).toString());

        erc20_instance.approve.sendTransaction(
            zanis_acc,
            20,
            { from: lubu_acc, to: ERC20_Address, gas: 500000 }, function (err, txid) {
                console.log('After approve to zanis');
                console.log(erc20_instance.allowance(lubu_acc, zanis_acc).toString());
                done();
            }
        );
        

    });
    it.skip('Create new escrow contract', (done) => {
        contract_instance.createEscrow.sendTransaction(
            new_escrowContract.contract_id,
            new_escrowContract.tenant,
            new_escrowContract.landlord,
            new_escrowContract.depositValue,
            new_escrowContract.expiry,
            { from: zanis_acc, to: escrow_contract, value: 0, gas: 50000000, gasPrice: 50000000000 },
            function (err, result) {
                console.log(err || result);
                done();
            });
    });

    it.skip('Get escrow contract info', (done) => {
        var result = contract_instance.getEscrow(new_escrowContract.contract_id).toString().split(',');
        assert.equal(result[0], new_escrowContract.tenant);
        assert.equal(result[1], new_escrowContract.landlord);
        assert.equal(result[2], new_escrowContract.depositValue);

        console.log(`tenant add = ${result[0]}`);
        console.log(`landlord add = ${result[1]}`);
        console.log(`depositTokenAmount = ${result[2]}`);
        console.log(`currentDepositBalance = ${result[3]}`);
        console.log(`current state = ${result[4]}`);
        done();
    });
});