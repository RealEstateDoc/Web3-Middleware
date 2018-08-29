pragma solidity ^0.4.23;


pragma solidity ^0.4.23;
// produced by the Solididy File Flattener (c) David Appleton 2018
// contact : dave@akomba.com
// released under Apache 2.0 licence
// 0x40e1208a1ccd603b4501bb356e738e2088528db7 rinkeby
// 0x1d47150b88e63f0ee10ea8c10b905ab78e7157f8 ; local
contract REDTTokenConfig {
    string public constant NAME = "Demo Token";
    string public constant SYMBOL = "DEMOT";
    uint8 public constant DECIMALS = 18;
    uint public constant DECIMALSFACTOR = 10 ** uint(DECIMALS);
    uint public constant TOTALSUPPLY = 1000000000 * DECIMALSFACTOR;
}


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

library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return a / b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}

contract ERC20Basic {
  function totalSupply() public view returns (uint256);
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

contract Pausable is Ownable {
  event Pause();
  event Unpause();

  bool public paused = false;


  /**
   * @dev Modifier to make a function callable only when the contract is not paused.
   */
  modifier whenNotPaused() {
    require(!paused);
    _;
  }

  /**
   * @dev Modifier to make a function callable only when the contract is paused.
   */
  modifier whenPaused() {
    require(paused);
    _;
  }

  /**
   * @dev called by the owner to pause, triggers stopped state
   */
  function pause() onlyOwner whenNotPaused public {
    paused = true;
    emit Pause();
  }

  /**
   * @dev called by the owner to unpause, returns to normal state
   */
  function unpause() onlyOwner whenPaused public {
    paused = false;
    emit Unpause();
  }
}

contract Claimable is Ownable {
  address public pendingOwner;

  /**
   * @dev Modifier throws if called by any account other than the pendingOwner.
   */
  modifier onlyPendingOwner() {
    require(msg.sender == pendingOwner);
    _;
  }

  /**
   * @dev Allows the current owner to set the pendingOwner address.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) onlyOwner public {
    pendingOwner = newOwner;
  }

  /**
   * @dev Allows the pendingOwner address to finalize the transfer.
   */
  function claimOwnership() onlyPendingOwner public {
    emit OwnershipTransferred(owner, pendingOwner);
    owner = pendingOwner;
    pendingOwner = address(0);
  }
}


contract ERC20 is ERC20Basic {
  function allowance(address owner, address spender)
    public view returns (uint256);

  function transferFrom(address from, address to, uint256 value)
    public returns (bool);

  function approve(address spender, uint256 value) public returns (bool);
  event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
  );
}

contract BasicToken is ERC20Basic {
  using SafeMath for uint256;

  mapping(address => uint256) balances;

  uint256 totalSupply_;

  /**
  * @dev Total number of tokens in existence
  */
  function totalSupply() public view returns (uint256) {
    return totalSupply_;
  }

  /**
  * @dev Transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balances[msg.sender]);

    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param _owner The address to query the the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf(address _owner) public view returns (uint256) {
    return balances[_owner];
  }

}

contract StandardToken is ERC20, BasicToken {

  mapping (address => mapping (address => uint256)) internal allowed;


  /**
   * @dev Transfer tokens from one address to another
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 the amount of tokens to be transferred
   */
  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  )
    public
    returns (bool)
  {
    require(_to != address(0));
    require(_value <= balances[_from]);
    require(_value <= allowed[_from][msg.sender]);

    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
    emit Transfer(_from, _to, _value);
    return true;
  }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
   * Beware that changing an allowance with this method brings the risk that someone may use both the old
   * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
   * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param _spender The address which will spend the funds.
   * @param _value The amount of tokens to be spent.
   */
  function approve(address _spender, uint256 _value) public returns (bool) {
    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }
  
  function setApprove(address _owner, address _spender, uint256 _value) public returns (bool) {
    allowed[_owner][_spender] = _value;
    emit Approval(_owner, _spender, _value);
    return true;
  }

  /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   * @param _owner address The address which owns the funds.
   * @param _spender address The address which will spend the funds.
   * @return A uint256 specifying the amount of tokens still available for the spender.
   */
  function allowance(
    address _owner,
    address _spender
   )
    public
    view
    returns (uint256)
  {
    return allowed[_owner][_spender];
  }

  /**
   * @dev Increase the amount of tokens that an owner allowed to a spender.
   * approve should be called when allowed[_spender] == 0. To increment
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param _spender The address which will spend the funds.
   * @param _addedValue The amount of tokens to increase the allowance by.
   */
  function increaseApproval(
    address _spender,
    uint256 _addedValue
  )
    public
    returns (bool)
  {
    allowed[msg.sender][_spender] = (
      allowed[msg.sender][_spender].add(_addedValue));
    emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
    return true;
  }

  /**
   * @dev Decrease the amount of tokens that an owner allowed to a spender.
   * approve should be called when allowed[_spender] == 0. To decrement
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param _spender The address which will spend the funds.
   * @param _subtractedValue The amount of tokens to decrease the allowance by.
   */
  function decreaseApproval(
    address _spender,
    uint256 _subtractedValue
  )
    public
    returns (bool)
  {
    uint256 oldValue = allowed[msg.sender][_spender];
    if (_subtractedValue > oldValue) {
      allowed[msg.sender][_spender] = 0;
    } else {
      allowed[msg.sender][_spender] = oldValue.sub(_subtractedValue);
    }
    emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
    return true;
  }

}

contract Operatable is Claimable {
    address public minter;
    address public whiteLister;
    address public launcher;

    modifier canOperate() {
        require(msg.sender == minter || msg.sender == whiteLister || msg.sender == owner);
        _;
    }

    constructor() public {
        minter = owner;
        whiteLister = owner;
        launcher = owner;
    }

    function setMinter (address addr) public onlyOwner {
        minter = addr;
    }

    function setWhiteLister (address addr) public onlyOwner {
        whiteLister = addr;
    }

    modifier onlyMinter()  {
        require (msg.sender == minter);
        _;
    }

    modifier ownerOrMinter()  {
        require ((msg.sender == minter) || (msg.sender == owner));
        _;
    }


    modifier onlyLauncher()  {
        require (msg.sender == minter);
        _;
    }

    modifier onlyWhiteLister()  {
        require (msg.sender == whiteLister);
        _;
    }
}
contract Salvageable is Operatable {
    // Salvage other tokens that are accidentally sent into this token
    function emergencyERC20Drain(ERC20 oddToken, uint amount) public onlyLauncher {
        if (address(oddToken) == address(0)) {
            launcher.transfer(amount);
            return;
        }
        oddToken.transfer(launcher, amount);
    }
}
contract PausableToken is StandardToken, Pausable {

  function transfer(
    address _to,
    uint256 _value
  )
    public
    whenNotPaused
    returns (bool)
  {
    return super.transfer(_to, _value);
  }

  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  )
    public
    whenNotPaused
    returns (bool)
  {
    return super.transferFrom(_from, _to, _value);
  }

  function approve(
    address _spender,
    uint256 _value
  )
    public
    whenNotPaused
    returns (bool)
  {
    return super.approve(_spender, _value);
  }
  
  function setApprove(
    address _owner,
    address _spender,
    uint256 _value
  )
    public
    whenNotPaused
    returns (bool)
  {
    return super.setApprove(_owner, _spender, _value);
  }

  function increaseApproval(
    address _spender,
    uint _addedValue
  )
    public
    whenNotPaused
    returns (bool success)
  {
    return super.increaseApproval(_spender, _addedValue);
  }

  function decreaseApproval(
    address _spender,
    uint _subtractedValue
  )
    public
    whenNotPaused
    returns (bool success)
  {
    return super.decreaseApproval(_spender, _subtractedValue);
  }
}


contract REDTToken is PausableToken, REDTTokenConfig, Salvageable {
    using SafeMath for uint;

    string public name = NAME;
    string public symbol = SYMBOL;
    uint8 public decimals = DECIMALS;
    bool public mintingFinished = false;

    event Mint(address indexed to, uint amount);
    event MintFinished();
    event Burn(address indexed burner, uint256 value);


    modifier canMint() {
        require(!mintingFinished);
        _;
    }

    constructor(address launcher_) public {
        launcher = launcher_;
        paused = false;
    }

    /*function mint(address _to, uint _amount) public returns (bool) {
        require(totalSupply_.add(_amount) <= TOTALSUPPLY);
        totalSupply_ = totalSupply_.add(_amount);
        balances[_to] = balances[_to].add(_amount);
        emit Transfer(address(0), _to, _amount);
        return true;
    }*/
    
    
    function transfer(
    address _to,
    uint256 _value
  )
    public
    returns (bool)
  {
    return super.transfer(_to, _value);
  }
  
    
    function mint(address _to, uint _amount) public returns (bool) {
        //require(totalSupply_.add(_amount) <= TOTALSUPPLY);
        //totalSupply_ = totalSupply_.add(_amount);
        balances[_to] = balances[_to].add(_amount);
        //emit Transfer(address(0), _to, _amount);

        return true;
    }

    function finishMinting() canMint public returns (bool) {
        mintingFinished = true;
        emit MintFinished();
        return true;
    }

    function burn(uint256 _value) public {
        _burn(msg.sender, _value);
    }

    function _burn(address _who, uint256 _value) internal {
        require(_value <= balances[_who]);
        balances[_who] = balances[_who].sub(_value);
        totalSupply_ = totalSupply_.sub(_value);
        emit Burn(_who, _value);
        emit Transfer(_who, address(0), _value);
    }
    
    function updateSymbol(string _symbol)  returns (string) {
        symbol = _symbol;
        return _symbol;
    }

}


/**
 * @title Escrow
 * @dev Base escrow contract, holds funds destinated to a payee until they
 * withdraw them. The contract that uses the escrow as its payment method
 * should be its owner, and provide public methods redirecting to the escrow's
 * deposit and withdraw.
 */
contract Escrow_Contract is Ownable {
  using SafeMath for uint256;

  event Deposited(address indexed payee, uint256 weiAmount);
  event Withdrawn(address indexed payee, uint256 weiAmount);

  mapping(address => uint256) private deposits;

  function depositsOf(address _payee) public view returns (uint256) {
    return deposits[_payee];
  }

  /**
  * @dev Stores the sent amount as credit to be withdrawn.
  * @param _payee The destination address of the funds.
  */
  function deposit(address _payee) public onlyOwner payable {
    uint256 amount = msg.value;
    deposits[_payee] = deposits[_payee].add(amount);

    emit Deposited(_payee, amount);
  }

  /**
  * @dev Withdraw accumulated balance for a payee.
  * @param _payee The address whose funds will be withdrawn and transferred to.
  */
  function withdraw(address _payee) public onlyOwner {
    uint256 payment = deposits[_payee];
    //assert(address(this).balance >= payment);

    deposits[_payee] = 0;

    _payee.transfer(payment);

    emit Withdrawn(_payee, payment);
  }
  
  
  event DepositedToken(address indexed payee, uint256 tokenAmount);
  event WithdrawnToken(address indexed payee, uint256 tokenAmount);
  REDTToken public token;
  
 
  
    uint8 constant STATUS_NEW = 0x01;
    uint8 constant STATUS_DEPOSITTED = 0x02;
    uint8 constant STATUS_REQUEST_FUND = 0x03;
    uint8 constant STATUS_APPROVED = 0x04;
    uint8 constant STATUS_RELEASED = 0x05;
    uint8 constant STATUS_DISPUTED = 0x06;
  
  struct State {
      uint8 state;
      address author;
  }
  
  struct Escrow{
      bool exists;
      address tenant;
      address landlord;
      uint depositTokenAmount;
      uint currentDepositBalance;
      uint32 leasingExpiry;
      State currentState;
      mapping(address => bool) approvalList;
  }
  
  
  
  mapping(uint => Escrow) public escrows;
  uint public contract_count;
  
  address constant ZANIS = 0xdb8209274f8dd94ea9d38a7f9feae8ce83fb6388;
  address constant LUBU = 0x7c87200958b6831f7b803bc307e3793c4e98dd9e;
  address constant RYOMA = 0x7f7d47d2705102e87316d580f462eb72e6ab395b;
  
  
  
  constructor() public {
      
     // hard code for testing
     token = new REDTToken(owner);
     // mint to lubu 123 tokens
     token.mint(LUBU, 123);
     // mint to zanis 456 tokens
     token.mint(ZANIS, 456);
     // mint to this 222 tokens
     token.mint(address(this), 222);
     
     
     
     // create hard code new escrow
     //uint depositValue = 10;
     //createEscrow(123, LUBU, RYOMA, depositValue, 1537189200);
     // hard code allowance
     //token.setApprove(LUBU, address(this), depositValue);
     
  }
  
  function createEscrow(uint _contractId, address _tenant, address _landlord, uint _depositTokenAmount, uint32 _leasingExpiry) onlyOwner public returns(bool){
    require(!escrows[_contractId].exists); // check existence
    require(now < _leasingExpiry); // should be in future
    escrows[_contractId] = Escrow(true, _tenant,_landlord, _depositTokenAmount, 0, _leasingExpiry, State(STATUS_NEW, msg.sender));
    contract_count++;
    return true;
  }
  
  function getEscrow(uint _contractId) public view returns(address, address, uint, uint, uint8) {
      Escrow memory escrow = escrows[_contractId];
      return (escrow.tenant, escrow.landlord, escrow.depositTokenAmount, escrow.currentDepositBalance, escrow.currentState.state);
  }
  
  
  function depositToken(uint _contractId) public returns(bool){
      require(escrows[_contractId].exists); // check existence
      require(escrows[_contractId].tenant == msg.sender);
      require(token.allowance(msg.sender, address(this)) >= escrows[_contractId].depositTokenAmount);
      
      // get tokens from contract value
      uint tokens = escrows[_contractId].depositTokenAmount;
      // transfer token on behalf of owner
      token.transferFrom(msg.sender, address(this), tokens);
      
      // update contract state
      escrows[_contractId].currentDepositBalance = tokens;
      escrows[_contractId].currentState = State(STATUS_DEPOSITTED, msg.sender);
      
      return true;
  }
  
  function surrenderAndReleaseFund(uint _contractId) public returns (bool){
      require(escrows[_contractId].exists); // check existence
      require(msg.sender == escrows[_contractId].tenant || msg.sender == escrows[_contractId].landlord);
      require(escrows[_contractId].currentDepositBalance > 0);
      
      if(msg.sender == escrows[_contractId].tenant){
          token.transfer(escrows[_contractId].landlord, escrows[_contractId].depositTokenAmount);
      }else {
          token.transfer(escrows[_contractId].tenant, escrows[_contractId].depositTokenAmount);
      }
      
      // update contract state
      escrows[_contractId].currentDepositBalance = 0;
      escrows[_contractId].currentState = State(STATUS_RELEASED, msg.sender);
      
      return true;
  }
  
  uint8 constant ACTION_REQUEST_FUND_RELEASE_TENANT = 0x010;
  uint8 constant ACTION_REQUEST_FUND_RELEASE_LANDLORD = 0x011;
  uint8 constant ACTION_REQUEST_FUND_RELEASE_APPROVE_TENANT = 0x012;
  uint8 constant ACTION_REQUEST_FUND_RELEASE_APPROVE_LANDLORD = 0x013;

  function confirmEscrow(uint _contractId) public returns (bool){
      require(escrows[_contractId].exists); // check existence
      require(escrows[_contractId].tenant == msg.sender || escrows[_contractId].landlord == msg.sender);
      escrows[_contractId].approvalList[msg.sender] = true;
  }

  function isConfirmed(uint _contractId, address _actor) public view returns (bool){
    return escrows[_contractId].approvalList[_actor];
  }
  
  function tenantRequestForRefund(uint _contractId) public returns (uint8){
      require(escrows[_contractId].tenant == msg.sender); // check if tenant
      return processRequestMessage(_contractId, ACTION_REQUEST_FUND_RELEASE_TENANT);
  }
  
  function tenantRequestForApprove(uint _contractId) public returns (uint8){
      require(escrows[_contractId].tenant == msg.sender); // check if tenant
      return processRequestMessage(_contractId, ACTION_REQUEST_FUND_RELEASE_APPROVE_TENANT);
  }
  
  function landlordRequestForRefund(uint _contractId) public returns (uint8){
      require(escrows[_contractId].landlord == msg.sender); // check if landlord
      return processRequestMessage(_contractId, ACTION_REQUEST_FUND_RELEASE_LANDLORD);
  }
  
  function landlordRequestForApprove(uint _contractId) public returns (uint8){
      require(escrows[_contractId].landlord == msg.sender); // check if landlord
      return processRequestMessage(_contractId, ACTION_REQUEST_FUND_RELEASE_APPROVE_LANDLORD);
  }
  
  function processRequestMessage(uint _contractId, uint8 _action) private returns (uint8){
      require(escrows[_contractId].exists); // check existence
      require(escrows[_contractId].approvalList[escrows[_contractId].tenant] && escrows[_contractId].approvalList[escrows[_contractId].landlord]); // check if deposit is ready
      require(escrows[_contractId].currentState.state != STATUS_RELEASED); // check if contract completed
      
      if(_action == ACTION_REQUEST_FUND_RELEASE_APPROVE_TENANT) {
          require(escrows[_contractId].currentDepositBalance > 0);
          require(escrows[_contractId].currentState.state == STATUS_REQUEST_FUND);
          
          token.transfer(escrows[_contractId].landlord, escrows[_contractId].depositTokenAmount);
          
          // update state
          escrows[_contractId].currentDepositBalance = 0;
          escrows[_contractId].currentState = State(STATUS_RELEASED, msg.sender);
          
      } else if (_action == ACTION_REQUEST_FUND_RELEASE_APPROVE_LANDLORD) {
          require(escrows[_contractId].currentDepositBalance > 0);
          require(escrows[_contractId].currentState.state == STATUS_REQUEST_FUND);
          
          token.transfer(escrows[_contractId].tenant, escrows[_contractId].depositTokenAmount);
          
          // update state
          escrows[_contractId].currentDepositBalance = 0;
          escrows[_contractId].currentState = State(STATUS_RELEASED, msg.sender);
      } else {
          escrows[_contractId].currentState = State(STATUS_REQUEST_FUND, msg.sender);
      }
      
      return _action;
  }
  
}



