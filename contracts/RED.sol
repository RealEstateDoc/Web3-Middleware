pragma solidity ^0.4.23;
// contract address: 
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
        string hash_value;
    }
    
    mapping (uint => Contract) contracts;
    
    uint[] public contractAccts;
    
    function addDocumentHash(uint _contract_id, string _hash) external onlyOwner{
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
    @return unit (created_at), string (hash)
    */
    
    function getDocumentHash(uint _contract_id) view public returns(uint, string){
        return (contracts[_contract_id].created_at, contracts[_contract_id].hash_value);
    }
    
    //function checkDocumentHash(string _hash) view public return(bool){
    //    if(contracts[_contract_id].hash_value != _hash){
    //        return true;
    //    }
    //    return false;
    //}
    
    function checkDocumentContractID(uint _contract_id, string _hash) view public returns(bool){
        if(keccak256(contracts[_contract_id].hash_value) != keccak256(_hash)){
            return true;
        }
        return false;
    }
    
    function countContracts() view public returns(uint){
        return contractAccts.length;
    }


}
