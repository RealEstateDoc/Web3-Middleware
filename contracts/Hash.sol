pragma solidity ^0.4.18;
// We have to specify what version of compiler this code will compile with

contract Hash {

  struct HashObj {
    bytes32 timeNow;
    bytes32 name;
  }
  /* mapping field below is equivalent to an associative array or hash.
  The key of the mapping is candidate name stored as type bytes32 and value is
  an unsigned integer to store the vote count
  */
  
  mapping (uint => HashObj) public hashList;

  uint public countHashList = 0;
  
  /* Solidity doesn't let you pass in an array of strings in the constructor (yet).
  We will use an array of bytes32 instead to store the list of candidates
  */

  /* This is the constructor which will be called once when you
  deploy the contract to the blockchain. When we deploy the contract,
  we will pass an array of candidates who will be contesting in the election
  */
  function Hash(bytes32[] candidateNames) public {
    
    for(uint i = 0; i< candidateNames.length;i++){
    var candidate = hashList[countHashList];
    candidate.name = candidateNames[i];
    candidate.timeNow = "hehehe";
      countHashList++;
    }
  }

}