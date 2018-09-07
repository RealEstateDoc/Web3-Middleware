
const assert = require('assert');

const contractService = require('../services/contract.service')('http://localhost:8545');

const STATUS_NEW = 1;
const STATUS_DEPOSITTED = 2;
const STATUS_REQUEST_FUND = 3;
const STATUS_APPROVED = 4;
const STATUS_RELEASED = 5;
const STATUS_DISPUTED = 6;

var escrow_contract_address = null;
var ERC20_Address = '';


const numToken = Math.pow(10, 18);
const zanis_acc = '0xdb8209274f8dd94ea9d38a7f9feae8ce83fb6388';
const lubu_acc = '0x7c87200958b6831f7b803bc307e3793c4e98dd9e';
const ryoma_acc = '0x7f7d47d2705102e87316d580f462eb72e6ab395b';
//1537189200
const new_escrowContract = {
    tenant: lubu_acc,
    landlord: ryoma_acc,
    contract_id: 456,
    depositValue: 50 * numToken,
    hashDoc: '0xb424839777e8131ea2d999b4263a07d0f91541938d85e7d84de8048672d6f8b6',
    expiry: Math.round(3600 * 24 + Date.now() / 1000)
};


var initialBalanceERC20 = {
    lubu: 0,
    zanis: 0,
    ryoma: 0,
    escrow: 0
};
var contract_instance = null;
var erc20_instance = null;

describe('Surrender Flow of Testing', function () {
    this.timeout(25000);

    var setUpTest = function (done) {
        console.log('About to Deploy and Setup new contract instance');
        contractService.deployNewContract(zanis_acc, 'Escrow_Contract', undefined, function (err, result) {
            console.log(err || result);
            escrow_contract_address = result.contractAddress;
            contractService.getContractInstance('Escrow_Contract', escrow_contract_address, function (err, instance) {
                if (err) {
                    console.log(err);
                } else {
                    contract_instance = instance;
                    ERC20_Address = contract_instance.token().toString();
                    console.log(`ERC20address = ${ERC20_Address}`);
                    contractService.getContractInstance('ERC20', ERC20_Address, function (error, contract_erc20) {
                        erc20_instance = contract_erc20;
                        console.log('setup first initial balance');
                        // setup first initial balance
                        initialBalanceERC20.lubu = Number(erc20_instance.balanceOf(lubu_acc).toString());
                        initialBalanceERC20.zanis = Number(erc20_instance.balanceOf(zanis_acc).toString());
                        initialBalanceERC20.ryoma = Number(erc20_instance.balanceOf(ryoma_acc).toString());
                        initialBalanceERC20.escrow = Number(erc20_instance.balanceOf(escrow_contract_address).toString());
                        done();
                    });
                }
            });
        });
    };

    describe('Tenant Surrender', function (done) {
        before(function (done) {
            setUpTest(done);
        });

        it('Create new escrow contract', (done) => {
            contract_instance.createEscrow.sendTransaction(
                new_escrowContract.contract_id,
                new_escrowContract.tenant,
                new_escrowContract.landlord,
                new_escrowContract.depositValue,
                new_escrowContract.expiry,
                new_escrowContract.hashDoc,
                { from: zanis_acc, to: escrow_contract_address, value: 0, gas: 50000000, gasPrice: 50000000000 },
                function (err, result) {
                    console.log(`Creating new escrow contract address = ${result}`);
                    done();
                });
        });

        it('Tenant Deposit tokens to contract', function (done) {
            erc20_instance.approve.sendTransaction(
                escrow_contract_address,
                new_escrowContract.depositValue,
                { from: lubu_acc, to: ERC20_Address, gas: 500000 }, function (err, txid) {
                    console.log('After approve to smart contract');
                    console.log(erc20_instance.allowance(lubu_acc, escrow_contract_address).toString());

                    contract_instance.depositToken.sendTransaction(
                        new_escrowContract.contract_id,
                        { from: lubu_acc, to: escrow_contract_address, value: 0, gas: 5000000 },
                        function (err1, result) {
                            var lubuBalanceNow = Number(erc20_instance.balanceOf(lubu_acc).toString());
                            var contractBalanceNow = Number(erc20_instance.balanceOf(escrow_contract_address).toString());
                            assert.equal(contractBalanceNow - initialBalanceERC20.escrow, new_escrowContract.depositValue);
                            assert.equal(initialBalanceERC20.lubu - lubuBalanceNow, new_escrowContract.depositValue);

                            // verify contract state

                            var escrowContractReturn = contract_instance.getEscrow(new_escrowContract.contract_id).toString().split(',');
                            assert.equal(escrowContractReturn[4], STATUS_DEPOSITTED);
                            done();
                        }
                    );
                }
            );
        });

        it('Tenant Surrender', function (done) {
            contract_instance.surrenderAndReleaseFund.sendTransaction(
                new_escrowContract.contract_id,
                { from: lubu_acc, to: escrow_contract_address, value: 0, gas: 5000000 },
                function (err, result) {
                    var escrowContractReturn = contract_instance.getEscrow(new_escrowContract.contract_id).toString().split(',');
                    var ryomaBalanceNow = Number(erc20_instance.balanceOf(ryoma_acc).toString());
                    var contractBalanceNow = Number(erc20_instance.balanceOf(escrow_contract_address).toString());
                    // verify balance of landlord ryoma
                    assert.equal(ryomaBalanceNow - initialBalanceERC20.ryoma, new_escrowContract.depositValue);
                    // verify balance of contract now
                    assert.equal(contractBalanceNow, initialBalanceERC20.escrow);
                    // verify current state = release
                    assert.equal(escrowContractReturn[4], STATUS_RELEASED);
                    done();
                });
        });
    });

    describe('Landlord Surrender', function (done) {
        before(function (done) {
            setUpTest(done);
        });

        it('Create new escrow contract', (done) => {
            contract_instance.createEscrow.sendTransaction(
                new_escrowContract.contract_id,
                new_escrowContract.tenant,
                new_escrowContract.landlord,
                new_escrowContract.depositValue,
                new_escrowContract.expiry,
                new_escrowContract.hashDoc,
                { from: zanis_acc, to: escrow_contract_address, value: 0, gas: 50000000, gasPrice: 50000000000 },
                function (err, result) {
                    console.log(`Creating new escrow contract address = ${result}`);
                    done();
                });
        });

        it('Tenant Deposit tokens to contract', function (done) {
            erc20_instance.approve.sendTransaction(
                escrow_contract_address,
                new_escrowContract.depositValue,
                { from: lubu_acc, to: ERC20_Address, gas: 500000 }, function (err, txid) {
                    console.log('After approve to smart contract');
                    console.log(erc20_instance.allowance(lubu_acc, escrow_contract_address).toString());

                    contract_instance.depositToken.sendTransaction(
                        new_escrowContract.contract_id,
                        { from: lubu_acc, to: escrow_contract_address, value: 0, gas: 5000000 },
                        function (err1, result) {
                            var lubuBalanceNow = Number(erc20_instance.balanceOf(lubu_acc).toString());
                            var contractBalanceNow = Number(erc20_instance.balanceOf(escrow_contract_address).toString());
                            assert.equal(contractBalanceNow - initialBalanceERC20.escrow, new_escrowContract.depositValue);
                            assert.equal(initialBalanceERC20.lubu - lubuBalanceNow, new_escrowContract.depositValue);

                            // verify contract state

                            var escrowContractReturn = contract_instance.getEscrow(new_escrowContract.contract_id).toString().split(',');
                            assert.equal(escrowContractReturn[4], STATUS_DEPOSITTED);
                            done();
                        }
                    );
                }
            );
        });

        it('Landlord Surrender', function (done) {
            contract_instance.surrenderAndReleaseFund.sendTransaction(
                new_escrowContract.contract_id,
                { from: ryoma_acc, to: escrow_contract_address, value: 0, gas: 5000000 },
                function (err, result) {
                    var escrowContractReturn = contract_instance.getEscrow(new_escrowContract.contract_id).toString().split(',');
                    var lubuBalanceNow = Number(erc20_instance.balanceOf(lubu_acc).toString());
                    var contractBalanceNow = Number(erc20_instance.balanceOf(escrow_contract_address).toString());
                    // verify balance of tenant lubu
                    assert.equal(lubuBalanceNow, initialBalanceERC20.lubu);
                    // verify balance of contract now
                    assert.equal(contractBalanceNow, initialBalanceERC20.escrow);
                    // verify current state = release
                    assert.equal(escrowContractReturn[4], STATUS_RELEASED);
                    done();
                });
        });
    });


    describe('TENANT REQUESTS AND LANDLORD APPROVES', function (done) {
        before(function (done) {
            setUpTest(done);
        });

        it('Create new escrow contract', (done) => {
            contract_instance.createEscrow.sendTransaction(
                new_escrowContract.contract_id,
                new_escrowContract.tenant,
                new_escrowContract.landlord,
                new_escrowContract.depositValue,
                new_escrowContract.expiry,
                new_escrowContract.hashDoc,
                { from: zanis_acc, to: escrow_contract_address, value: 0, gas: 50000000, gasPrice: 50000000000 },
                function (err, result) {
                    console.log(`Creating new escrow contract address = ${result}`);
                    done();
                });
        });

        it('Tenant Deposit tokens to contract', function (done) {
            erc20_instance.approve.sendTransaction(
                escrow_contract_address,
                new_escrowContract.depositValue,
                { from: lubu_acc, to: ERC20_Address, gas: 500000 }, function (err, txid) {
                    console.log('After approve to smart contract');
                    console.log(erc20_instance.allowance(lubu_acc, escrow_contract_address).toString());

                    contract_instance.depositToken.sendTransaction(
                        new_escrowContract.contract_id,
                        { from: lubu_acc, to: escrow_contract_address, value: 0, gas: 5000000 },
                        function (err1, result) {
                            var lubuBalanceNow = Number(erc20_instance.balanceOf(lubu_acc).toString());
                            var contractBalanceNow = Number(erc20_instance.balanceOf(escrow_contract_address).toString());
                            assert.equal(contractBalanceNow - initialBalanceERC20.escrow, new_escrowContract.depositValue);
                            assert.equal(initialBalanceERC20.lubu - lubuBalanceNow, new_escrowContract.depositValue);

                            // verify contract state

                            var escrowContractReturn = contract_instance.getEscrow(new_escrowContract.contract_id).toString().split(',');
                            assert.equal(escrowContractReturn[4], STATUS_DEPOSITTED);
                            done();
                        }
                    );
                }
            );
        });

        it('Tenant to confirm', function (done) {
            contract_instance.confirmEscrow.sendTransaction(new_escrowContract.contract_id,
                { from: lubu_acc, to: escrow_contract_address, value: 0, gas: 5000000 },
                function (err, result) {
                    var result = contract_instance.isConfirmed(new_escrowContract.contract_id, lubu_acc);
                    console.log(`Is tenant to confirm = ${result}`);
                    done();
                }
            );
        });

        it('Landlord to confirm', function (done) {
            contract_instance.confirmEscrow.sendTransaction(new_escrowContract.contract_id,
                { from: ryoma_acc, to: escrow_contract_address, value: 0, gas: 5000000 },
                function (err, result) {
                    var result = contract_instance.isConfirmed(new_escrowContract.contract_id, ryoma_acc);
                    console.log(`Is landlord to confirm = ${result}`);
                    done();
                }
            );
        });

        it('Tenant Request For Refund', function (done) {
            contract_instance.tenantRequestForRefund.sendTransaction(
                new_escrowContract.contract_id,
                { from: lubu_acc, to: escrow_contract_address, value: 0, gas: 5000000 },
                function (err, result) {
                    var escrowContractReturn = contract_instance.getEscrow(new_escrowContract.contract_id).toString().split(',');
                    // verify current state = release
                    assert.equal(escrowContractReturn[2], new_escrowContract.depositValue);
                    assert.equal(escrowContractReturn[4], STATUS_REQUEST_FUND);
                    done();
                });
        });

        it('Landlord Approve Refund', function (done) {
            contract_instance.landlordRequestForApprove.sendTransaction(
                new_escrowContract.contract_id,
                { from: ryoma_acc, to: escrow_contract_address, value: 0, gas: 5000000 },
                function (err, result) {
                    var escrowContractReturn = contract_instance.getEscrow(new_escrowContract.contract_id).toString().split(',');
                    var lubuBalanceNow = Number(erc20_instance.balanceOf(lubu_acc).toString());
                    //verify account of tenant
                    assert.equal(lubuBalanceNow, initialBalanceERC20.lubu);
                    // verify current state = release
                    assert.equal(escrowContractReturn[3], 0);
                    assert.equal(escrowContractReturn[4], STATUS_RELEASED);
                    done();
                });
        });
    });


    describe('LANDLORD REQUESTS AND TENANT APPROVES', function (done) {
        before(function (done) {
            setUpTest(done);
        });

        it('Create new escrow contract', (done) => {
            contract_instance.createEscrow.sendTransaction(
                new_escrowContract.contract_id,
                new_escrowContract.tenant,
                new_escrowContract.landlord,
                new_escrowContract.depositValue,
                new_escrowContract.expiry,
                new_escrowContract.hashDoc,
                { from: zanis_acc, to: escrow_contract_address, value: 0, gas: 50000000, gasPrice: 50000000000 },
                function (err, result) {
                    console.log(`Creating new escrow contract address = ${result}`);
                    done();
                });
        });

        it('Tenant Deposit tokens to contract', function (done) {
            erc20_instance.approve.sendTransaction(
                escrow_contract_address,
                new_escrowContract.depositValue,
                { from: lubu_acc, to: ERC20_Address, gas: 500000 }, function (err, txid) {
                    console.log('After approve to smart contract');
                    console.log(erc20_instance.allowance(lubu_acc, escrow_contract_address).toString());

                    contract_instance.depositToken.sendTransaction(
                        new_escrowContract.contract_id,
                        { from: lubu_acc, to: escrow_contract_address, value: 0, gas: 5000000 },
                        function (err1, result) {
                            var lubuBalanceNow = Number(erc20_instance.balanceOf(lubu_acc).toString());
                            var contractBalanceNow = Number(erc20_instance.balanceOf(escrow_contract_address).toString());
                            console.log(`lubuBalanceNow = ${lubuBalanceNow}`);
                            console.log(`contractBalanceNow = ${contractBalanceNow}`);
                            console.log(`initialBalanceERC20.escrow = ${initialBalanceERC20.escrow}`);
                            assert.equal(contractBalanceNow - initialBalanceERC20.escrow, new_escrowContract.depositValue);
                            assert.equal(initialBalanceERC20.lubu - lubuBalanceNow, new_escrowContract.depositValue);

                            // verify contract state

                            var escrowContractReturn = contract_instance.getEscrow(new_escrowContract.contract_id).toString().split(',');
                            assert.equal(escrowContractReturn[4], STATUS_DEPOSITTED);
                            done();
                        }
                    );
                }
            );
        });

        it('Tenant to confirm', function (done) {
            contract_instance.confirmEscrow.sendTransaction(new_escrowContract.contract_id,
                { from: lubu_acc, to: escrow_contract_address, value: 0, gas: 5000000 },
                function (err, result) {
                    var result = contract_instance.isConfirmed(new_escrowContract.contract_id, lubu_acc);
                    console.log(`Is tenant to confirm = ${result}`);
                    done();
                }
            );
        });

        it('Landlord to confirm', function (done) {
            contract_instance.confirmEscrow.sendTransaction(new_escrowContract.contract_id,
                { from: ryoma_acc, to: escrow_contract_address, value: 0, gas: 5000000 },
                function (err, result) {
                    var result = contract_instance.isConfirmed(new_escrowContract.contract_id, ryoma_acc);
                    console.log(`Is landlord to confirm = ${result}`);
                    done();
                }
            );
        });

        it('Landlord Request For Refund', function (done) {
            contract_instance.landlordRequestForRefund.sendTransaction(
                new_escrowContract.contract_id,
                { from: ryoma_acc, to: escrow_contract_address, value: 0, gas: 5000000 },
                function (err, result) {
                    var escrowContractReturn = contract_instance.getEscrow(new_escrowContract.contract_id).toString().split(',');
                    // verify current state = release
                    assert.equal(escrowContractReturn[2], new_escrowContract.depositValue);
                    assert.equal(escrowContractReturn[4], STATUS_REQUEST_FUND);
                    done();
                });
        });

        it('Tenant Approve Refund', function (done) {
            contract_instance.tenantRequestForApprove.sendTransaction(
                new_escrowContract.contract_id,
                { from: lubu_acc, to: escrow_contract_address, value: 0, gas: 5000000 },
                function (err, result) {
                    var escrowContractReturn = contract_instance.getEscrow(new_escrowContract.contract_id).toString().split(',');
                    var ryomaBalanceNow = Number(erc20_instance.balanceOf(ryoma_acc).toString());
                    //verify account of tenant
                    assert.equal(ryomaBalanceNow, initialBalanceERC20.ryoma + new_escrowContract.depositValue);
                    // verify current state = release
                    assert.equal(escrowContractReturn[3], 0);
                    assert.equal(escrowContractReturn[4], STATUS_RELEASED);
                    done();
                });
        });
    });

    describe('Check Hash Doc Existed', function (done) {
        before(function (done) {
            setUpTest(done);
        });

        it('Create new escrow contract', (done) => {
            contract_instance.createEscrow.sendTransaction(
                new_escrowContract.contract_id,
                new_escrowContract.tenant,
                new_escrowContract.landlord,
                new_escrowContract.depositValue,
                new_escrowContract.expiry,
                new_escrowContract.hashDoc,
                { from: zanis_acc, to: escrow_contract_address, value: 0, gas: 50000000, gasPrice: 50000000000 },
                function (err, result) {
                    console.log(`Creating new escrow contract address = ${result}`);
                    done();
                });
        });

        it('Hash Doc Existed', function (done) {
            var result = contract_instance.isHashDocExisted(new_escrowContract.hashDoc);

            assert.equal(result, true);

            done();
        });

        it('Hash Doc Not Existed', function (done) {
            var result = contract_instance.isHashDocExisted('0xb424839777e8131ea2d999b4263a07d0f91541938d85e7d84de8048672d6f7b1');
            assert.equal(result, false);

            done();
        });


    });


    // it.skip('Get escrow contract info', (done) => {
    //     var result = contract_instance.getEscrow(new_escrowContract.contract_id).toString().split(',');
    //     assert.equal(result[0], new_escrowContract.tenant);
    //     assert.equal(result[1], new_escrowContract.landlord);
    //     assert.equal(result[2], new_escrowContract.depositValue);

    //     console.log(`tenant add = ${result[0]}`);
    //     console.log(`landlord add = ${result[1]}`);
    //     console.log(`depositTokenAmount = ${result[2]}`);
    //     console.log(`currentDepositBalance = ${result[3]}`);
    //     console.log(`current state = ${result[4]}`);
    //     done();
    // });
});