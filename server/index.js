const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "025315327a7a12fc03d6635aea3b0b6f65c89e8bc8ec611d0a4199eb55cfe78d55": 100, // ben 
  "02e1bcf381e2b1a2e361e5ed768395c93cf26cdd2238766b19b54b1cafdd02c5b8": 50,  // tom
  "02878e5963c2f5c4723f11b502c19c78f5cfa7c0da274f2380e99166650de31ab0": 75,  // jan 
};

/*
privateKeys: 
ben = 71c2d4e3afe5384ade33410cd9d9ed1ee2c69da2809159c2b68c9985261fa9fb
tom = 01520faa5a5420812d87b4576c6b6de620a8a7d0fa3e3d0e917259da5ee57f81
jan = 1c2a0141549e30ac576aa6ca8c0b05874682ea624d1fada0f2fda3d9eebbaf25 
*/



app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from tje client-side application
  // recover the public address from the signature

  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
