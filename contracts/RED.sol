pragma solidity ^0.4.23;
// contract address: 
// hash: https://packagist.org/packages/hashing/keccak256
// https://github.com/raineorshine/solidity-by-example/blob/master/remove-from-array.sol

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(owner);
    owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner) public onlyOwner {
    _transferOwnership(_newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address _newOwner) internal {
    require(_newOwner != address(0));
    emit OwnershipTransferred(owner, _newOwner);
    owner = _newOwner;
  }
}

contract RED is Ownable {
    
    struct Contract{
        uint created_at;
        bytes32 hash_value;
    }
    
    mapping (uint => Contract) contracts;
    
    uint[] public contractAccts;
    
    
    
    function addDocumentHash(uint _contract_id, bytes32 _hash) external onlyOwner{
        
        if(contracts[_contract_id].hash_value == 0){
            Contract storage contract_info = contracts[_contract_id];
        
            contract_info.created_at = now;
            contract_info.hash_value = _hash;
            
            contractAccts.push(_contract_id) -1;
        }
        
        
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
    
    function checkDocumentHash(bytes32 _hash) view public returns(bool){
        uint i = 0;
        uint tmp = 0;
        uint num = contractAccts.length;
        while (contracts[i].hash_value != _hash) {
            
            if(contracts[i].hash_value>0){
                tmp+=1;
            }
            
            //not exist hash value
            if(tmp==num){
                return false;
            }
            
            i++;
        }
        //exist hash value
       return true;
        
    }
    
    function checkExistDocument(uint _contract_id, bytes32 _hash) view public returns(bool){
        //hash value don't change
        if(contracts[_contract_id].hash_value == _hash){
            return true;
        }
        //hash value changed
        return false;
    }
    
    /*
    @return uint total contracts
    */
    
    function countContracts() view public returns(uint){
        return contractAccts.length;
    }


}
