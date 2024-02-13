const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");


app.use(cors());
app.use(express.json());

const balances = {
  "0x759eaf454fe26d54c0bc5cb61c62cccb7b8c2aa4": 100,
  "0x01f8f91fe525c2bff1b0d29d1bd09b1c8ffba615": 50,
  "0xf02ca7739e8d37935381e08f6b2973738fa910ec": 75,
};

//Because of this app is not connecting to a wallet, create an object with public key/private key pairs.
const privateKeys = {
  "0x759eaf454fe26d54c0bc5cb61c62cccb7b8c2aa4": "0694a228f93426d956fd20b3f307ac49bb9bd582fb864b7b1658ff929263947b",
  "0x01f8f91fe525c2bff1b0d29d1bd09b1c8ffba615": "9107b5cd3f8f428ca1438e8d204c7930c86e891a7d8dbdec984f52ae98d13def",
  "0xf02ca7739e8d37935381e08f6b2973738fa910ec": "1f97cf0e57b0387b86592f21a29fedd487c566994e5bcf499a9ba369c9fde8dd"
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  const privateKey = privateKeys[address];
  res.send({ balance, privateKey });
});

app.post("/send", async (req, res) => {

  try {

  const { signature, hexMessage, recoveryBit, sender, recipient, amount } = req.body;

  // get signature, hash and recovery bit from client-sideand recover the address from signature

  const recoveredPublicKey = secp.recoverPublicKey(hexMessage, signature, recoveryBit);
  const signatureAddressNotHex = keccak256(recoveredPublicKey).slice(-20);
  const signatureAddress = "0x" + toHex(signatureAddressNotHex);
  

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } 
  else if (signatureAddress !== sender) {
    res.status(400).send({message: "You are not the person!"})
  }
  else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
} catch(error){
  console.log(error);
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