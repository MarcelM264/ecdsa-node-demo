const { randomBytes } = require('crypto')
const secp2 = require("ethereum-cryptography/secp256k1-compat")
const {toHex} = require("ethereum-cryptography/utils")

// Generate private key
let privateKey
do {
privateKey = randomBytes(32)
}while (!secp2.privateKeyVerify(privateKey))
console.log("Private key:", toHex(privateKey))

// Derive public key in a compressed format
let publicKey = secp2.publicKeyCreate(privateKey)
console.log("Public key:", toHex(publicKey))