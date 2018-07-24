
$('.alert').hide();

$(document).ready(function () {

});


function deployContract() {
  compileAndDeployContract();
  
  showAlertSuccessAndClose();
}


function showAlertSuccessAndClose() {
  var txtHash = 'txtHash';
  var contractAddress = 'contract Adddress';
  $('.alert').text(`Weldone, you have deployed succesfully smart contract. txtHash = ${txtHash}. Smart Contract Address = ${contractAddress}`);
  $('.alert').show();

  setTimeout(function () {
    $('.alert').hide();
  }, 25000);
}

function compileAndDeployContract() {
  //$.ajax('url:');
}

function deployContractOnBlockchain() {

}