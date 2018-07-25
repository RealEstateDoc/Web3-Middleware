pragma solidity ^0.4.23;
// contract address: 
// hash: https://packagist.org/packages/hashing/keccak256
//https://github.com/raineorshine/solidity-by-example/blob/master/remove-from-array.sol

contract Owned {
    address owner;
    
    constructor() public {
       owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}

contract RED is Owned {
    
    struct Contract{
        uint created_at;
        bytes32 hash_value;
    }
    
    mapping (uint => Contract) contracts;
    
    uint[] public contractAccts;
    
    
    function addDocumentHash(uint _contract_id, bytes32 _hash) external onlyOwner{
        Contract storage contract_info = contracts[_contract_id];
        
        contract_info.created_at = now;
        contract_info.hash_value = _hash;
        
        contractAccts.push(_contract_id) -1;
    }
    
    /*
    
    @return all contract id
    @return array uint
    
    */
    function getDocumentHashs() view public returns(uint[]){
        return contractAccts;
    }
    

    /*
    @return info in contract id
    @return unit (created_at), bytes32 (hash)
    */
    
    function getDocumentHash(uint _contract_id) view public returns(uint, bytes32){
        return (contracts[_contract_id].created_at, contracts[_contract_id].hash_value);
    }
    
    //function checkDocumentHash(bytes32 _hash) view public returns(bool){
    //    uint i = 0;
    //    while (keccak256(contracts[i].hash_value) != keccak256(_hash)) {
    //        i++;
    //    }
    //}
    
    function checkDocumentContractID(uint _contract_id, bytes32 _hash) view public returns(bool){
        if(keccak256(contracts[_contract_id].hash_value) != keccak256(_hash)){
            return true;
        }
        return false;
    }
    
    function countContracts() view public returns(uint){
        return contractAccts.length;
    }


}
