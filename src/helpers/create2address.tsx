import {
  utils,
} from 'ethers5'


const {
  keccak256,
  toUtf8Bytes,
  concat,
  getAddress,
  hexZeroPad
} = utils

const create2Address = (
  sender: string,
  bytecode: string,
  salt: string,
  constructorArgs: any
) => {
  // Step 1: Define the zkSync prefix for `CREATE2`
  const prefix = utils.keccak256(toUtf8Bytes("zksyncCreate2"));

  // Step 2: Compute the bytecode and input hashes
  const bytecodeHash = bytecode;
  const inputHash = keccak256(constructorArgs);

  // Step 3: Concatenate and hash these components
  const addressBytes = keccak256(
    concat([
        prefix,
        hexZeroPad(sender, 32), // Pads the sender to 32 bytes
        salt,
        bytecodeHash,
        inputHash
    ])
  ).slice(26); // The `.slice(26)` keeps the last 20 bytes, which forms the address

  // Step 4: Return the address
  return getAddress(addressBytes);
}

export default create2Address