# Lendify

EngHack @ UWaterloo 2018. Winner of Best Hack.

# Inspiration
We were inspired by companies like Uber and Airbnb who found ways to connect product owners and service providers with people who needed such products or services. We wanted to generalize this idea of lenders and borrowers of goods/services and apply it to anything we could thing of, not just bnbs and transportation. We also wanted to make this system self sustainable and decentralized, so we decided to use an ethereum blockchain and smart contract service to completely automate the exchange of assets and collateral in a very secure, self-validating way.

# What it does
We set up a demo web application where users have accounts and act as lenders or borrowers for any item or service they choose. Items are listed by lenders, and a borrower can choose to rent the item for a specified amount of time. Each account 'balance' is represented in our ethereum network as a node.

'Borrowing an item' can be anything. It could be renting a car or even a service like landscaping. It is an agreement between both parties.

Upon borrowing an item or providing a service, our smart contract service is activated to hold an amount equal to the value of the item/service as collateral from the borrower's wallet. If the item is returned before the agreed hold time and both parties accept, 95% of the collateral is returned to the borrower, and 5% is kept by the lender. If the item is not returned by the agreed period, the collateral is paid entirely to the lenders wallet. This is an anti-theft measure.

# How we built it
We used Node.js and MongoDB to create an MVC web application which allows users to list items and other users to borrow them for a specified time. Here's the cool part:

We made controllers in javascript composed of our service functions which are used to contact our smart contract service and transact on our test ethereum netwrok. Our smart contract service is made in solidity. This way, our application is very light weight, modularized, and of course, decentralized.

# Challenges we ran into and how we overcame them
It was hard to connect our backend to our test ethereum blockchain at first because it was messy and required other modules. We solved this problem by modularizing these procedures as service functions, which allowed us to communicate with our ethereum network anywhere in the project. For example, a service function could be initializing a contract with a time period, value, and addresses of both parties.

This was also our first time hosting our test ethereum network. We had to do a lot of research with networking and a node module called Web3 to configure it so it would work with our code hosted on AWS.
