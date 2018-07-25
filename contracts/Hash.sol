pragma solidity ^0.4.18;
// We have to specify what version of compiler this code will compile with

contract Voting {
  /* mapping field below is equivalent to an associative array or hash.
  The key of the mapping is candidate name stored as type bytes32 and value is
  an unsigned integer to store the vote count
  */
  
  mapping (bytes32 => uint8) public votesReceived;
  
  /* Solidity doesn't let you pass in an array of strings in the constructor (yet).
  We will use an array of bytes32 instead to store the list of candidates
  */
  
  bytes32[] public candidateList;
  uint[] public testArray;
  
  uint public status = 0;
  
  function updateNewStatus(uint _status) public returns (bool) {
      if(status == _status){
          status = 999999;
          return false;
      }else{
          status = _status;
          return true;
      }
  }
  
  struct Voter {
      uint num;
      bytes32 hashStr;
      bool isExist;
  }
  
  event newVoter(uint indexNum, bytes32 hash, bool valid);
  
  mapping (bytes32 => Voter) public voterList;
  
  function addNewVoter(uint indexNum, bytes32 hashStr) public returns (bool) {
      if(!voterList[hashStr].isExist){
          var voter = Voter(indexNum, hashStr, true);
          voterList[hashStr] = voter;
          emit newVoter(indexNum, hashStr, true);
          return true;
      }else{
          emit newVoter(0, '0x', false);
          return false;
      }
  }

  /* This is the constructor which will be called once when you
  deploy the contract to the blockchain. When we deploy the contract,
  we will pass an array of candidates who will be contesting in the election
  */
  function Voting(bytes32[] candidateNames) public {
    candidateList = candidateNames;
    testArray.push(5);
    testArray.push(7);
  }

  // This function returns the total votes a candidate has received so far
  function totalVotesFor(bytes32 candidate) view public returns (uint8) {
    require(validCandidate(candidate));
    return votesReceived[candidate];
  }

  // This function increments the vote count for the specified candidate. This
  // is equivalent to casting a vote
  function voteForCandidate(bytes32 candidate) public {
    require(validCandidate(candidate));
    votesReceived[candidate] += 1;
  }

  function validCandidate(bytes32 candidate) view public returns (bool) {
    for(uint i = 0; i < candidateList.length; i++) {
      if (candidateList[i] == candidate) {
        return true;
      }
    }
    return false;
  }
  
  function testMethod(uint variableNumber) public returns (uint){
      return variableNumber*100;
  }
}