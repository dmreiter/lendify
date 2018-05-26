pragma solidity ^0.4.20;

contract SharedObjects {

    struct Exchange {
        address lender;
        address borrower;
        uint duration; // max time for lending item
        uint frozenAmount; // amount of money frozen for exchange
        uint startTime; // time exchange was made
        bool complete; // whether exchange is complete or not
    }

    mapping (uint => Exchange) private exchanges;

    uint private exchangeIndex = 0; // unique ID keeping count of number of exchanges

    // Create new exchange and borrower pays ether to borrow item
    function createNewExchange(address lenderAddress, address borrowerAddress, uint duration, uint frozenAmount) public payable returns (uint) {
        require(frozenAmount <= msg.value * 95 / 100);
        exchanges[exchangeIndex] = Exchange(lenderAddress, borrowerAddress, duration, frozenAmount, now, false);
        lenderAddress.transfer(msg.value - frozenAmount);
        exchangeIndex++;
        return exchangeIndex - 1;
    }

    // Lender requests money after time is up; send lender frozen amount of money
    function lenderRequestsMoney(uint exchangeId) public {
        if (now - exchanges[exchangeId].startTime > exchanges[exchangeId].duration) {
            address lenderAddress = exchanges[exchangeId].lender;
            uint frozenMoney = exchanges[exchangeId].frozenAmount;
            lenderAddress.transfer(frozenMoney); // transfer money to lender's address
        }
    }

    // Complete the exchange and transfer the frozen amount back to borrower
    function completeExchange(uint exchangeId) public {
        uint frozenMoney = exchanges[exchangeId].frozenAmount;
        assert(address(this).balance >= frozenMoney);
        exchanges[exchangeId].complete = true;
        address borrowerAddress = exchanges[exchangeId].borrower;
        exchanges[exchangeId].complete = true;
        borrowerAddress.transfer(frozenMoney); // transfer money to borrower's address
    }
}
