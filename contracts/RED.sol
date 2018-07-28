pragma solidity ^0.4.23;


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
        uint doc_id;
        uint trail_id;
        uint created_at;
    }
    
    //save hash
    mapping (bytes32 => Contract) contracts;
    
    bytes32[] public contractAccts;
    
    
    function addDocumentHash(uint _doc_id, uint _trail_id, bytes32 _hash) external onlyOwner{
        
        if(contracts[_hash].trail_id == 0){
            Contract storage contract_info = contracts[_hash];
            
            contract_info.created_at = now;
            contract_info.doc_id = _doc_id;
            contract_info.trail_id = _trail_id;
            contractAccts.push(_hash) -1;
        }
        
        
    }
    
    /*
    
    @return all contract id
    @return array uint
    
    */
    function getDocumentHashs() view public returns(bytes32[]){
        return contractAccts;
    }
    

    
    function checkDocumentHash(bytes32 _hash) view public returns(uint, uint, uint){
        if(contracts[_hash].trail_id > 0){
            return (contracts[_hash].doc_id, contracts[_hash].trail_id, contracts[_hash].created_at);
        }
        return (0,0,0);
        
    }
    
    
    /*
    @return uint total contracts
    */
    
    function countContracts() view public returns(uint){
        return contractAccts.length;
    }


}
