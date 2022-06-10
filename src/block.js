const fs = require("fs");
const merkle = require("merkle");
const cryptojs = require("crypto-js");

export class Block {
  constructor(header, body) {
    this.header = header;
    this.body = body;
  }
}

// Header details
class BlockHeader {
  constructor(
    index,
    previousBlockHash,
    merkleRoot,
    timestamp,
    difficulty,
    nonce
  ) {
    this.index = index;
    this.previousBlockHash = previousBlockHash;
    this.merkleRoot = merkleRoot;
    this.timestamp = timestamp;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }
}

export class BlockBody {
  constructor(time, user, item, price) {
    this.time = time;
    this.user = user;
    this.item = item;
    this.price = price;
  }
}

function createHash(block) {
  const { index, previousBlockHash, merkleRoot, timestamp, difficulty, nonce } =
    block.header;
  const blockString =
    index + previousBlockHash + merkleRoot + timestamp + difficulty + nonce;
  const hash = cryptojs.SHA256(blockString).toString();
  return hash;
}

function calculateHash(
  index,
  previousBlockHash,
  merkleRoot,
  timestamp,
  difficulty,
  nonce
) {
  const blockString =
    index + previousBlockHash + merkleRoot + timestamp + difficulty + nonce;
  return cryptojs.SHA256(blockString).toString();
}

function hashMatchesDifficulty(hash, difficulty) {
  // check how many "0"s the hash starts with
  const requiredPrefix = "0".repeat(difficulty);
  return hash.startsWith(requiredPrefix);
}

export function findBlock(
  nextIndex,
  previousBlockHash,
  merkleRoot,
  nextTimestamp,
  difficulty
) {
  let nonce = 0;
  while (true) {
    let hash = calculateHash(
      nextIndex,
      previousBlockHash,
      merkleRoot,
      nextTimestamp,
      difficulty,
      nonce
    );
    if (hashMatchesDifficulty(hash, difficulty)) {
      return new BlockHeader(
        nextIndex,
        previousBlockHash,
        merkleRoot,
        nextTimestamp,
        difficulty,
        nonce
      );
    }
    nonce++;
  }
}

export function createGenesisBlock(user, item, price) {
  const index = 0;
  const previousBlockHash = "0".repeat(64);
  const timestamp = parseInt(Date.now() / 1000);
  const time = new Date();
  const bodyData = [timestamp + user + item + price];
  const tree = merkle("sha256").sync(bodyData);
  const merkleRoot = tree.root() || "0".repeat(64);
  const difficulty = 0;
  const nonce = 0;

  const header = new BlockHeader(
    index,
    previousBlockHash,
    merkleRoot,
    timestamp,
    difficulty,
    nonce
  );

  const body = new BlockBody(time, user, item, price);

  return new Block(header, body);
}

export function nextBlock(prevBlock, user, item, price) {
  const index = prevBlock.header.index + 1;
  const previousBlockHash = createHash(prevBlock);
  const timestamp = parseInt(Date.now() / 1000);
  const time = new Date();
  const bodyData = [timestamp + user + item + price];
  const tree = merkle("sha256").sync(bodyData);
  const merkleRoot = tree.root() || "0".repeat(64);
  const difficulty = 3;
  const nonce = 0;

  const header = findBlock(
    index,
    previousBlockHash,
    merkleRoot,
    timestamp,
    difficulty
  );

  const body = new BlockBody(time, user, item, price);

  return new Block(header, body);
}

export function isValidNewBlock(newBlock, prevBlock) {
  const bodyData = [
    newBlock.header.timestamp +
      newBlock.body.user +
      newBlock.body.item +
      newBlock.body.price,
  ];
  const merkleRoot = merkle("sha256").sync(bodyData).root();
  if (newBlock.header.index !== prevBlock.header.index + 1) {
    console.log("*** Invalid Index ***");
    return false;
  } else if (newBlock.header.previousBlockHash !== createHash(prevBlock)) {
    console.log("*** Invalid BlockStructure ***");
    return false;
  } else if (merkleRoot !== newBlock.header.merkleRoot) {
    console.log("*** Invalid MerkleRoot ***");
    return false;
  } else if (
    !hashMatchesDifficulty(createHash(newBlock), newBlock.header.difficulty)
  ) {
    console.log("*** Invalid Difficulty ***");
    return false;
  }
  return true;
}
