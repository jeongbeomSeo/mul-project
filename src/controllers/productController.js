import {
  Block,
  BlockBody,
  createGenesisBlock,
  findBlock,
  isValidNewBlock,
  nextBlock,
} from "../block";
import Product from "../models/Product";

export const getRegist = (req, res) => {
  return res.render("regist", { pageTitle: "Register Page" });
};

export const postRegist = async (req, res) => {
  const {
    body: { productName: name, description, price },
    session: { user },
    file,
  } = req;
  if (!user) {
    return res.render("404", {
      pageTitle: "Not User",
      errorMessage: "Login Frist",
    });
  }
  let block;
  const exists = await Product.exists({});
  if (exists === null) {
    block = createGenesisBlock(user._id, name, price);
  } else {
    const preProduct = await Product.findOne().sort({ index: -1 });
    const header = new findBlock(
      preProduct.index,
      preProduct.previousBlockHash,
      preProduct.merkleRoot,
      preProduct.timestamp,
      preProduct.difficulty
    );
    const body = new BlockBody(
      preProduct.time,
      preProduct.user,
      preProduct.item,
      preProduct.price
    );
    const preBlock = new Block(header, body);
    block = nextBlock(preBlock, user._id, name, price);
    console.log(block);
  }
  await Product.create({
    index: block.header.index,
    previousBlockHash: block.header.previousBlockHash,
    merkleRoot: block.header.merkleRoot,
    timestamp: block.header.timestamp,
    difficulty: block.header.difficulty,
    nonce: block.header.nonce,
    time: block.body.time,
    user: block.body.user,
    item: block.body.item,
    price: block.body.price,
    description,
    image: file ? file.path : null,
  });
  return res.redirect("/");
};

export const getList = async (req, res) => {
  let blocks = [];
  const products = await Product.find({});
  if (!products) {
    return res.render("list", {
      pageTitle: "Product List",
      empty: "Empty",
    });
  }
  blocks = products.map((product) => {
    const header = new findBlock(
      product.index,
      product.previousBlockHash,
      product.merkleRoot,
      product.timestamp,
      product.difficulty
    );
    const body = new BlockBody(
      product.time,
      product.user,
      product.item,
      product.price
    );
    const block = new Block(header, body);
    return block;
  });
  products[0].valid = true;
  for (let i = 1; i < blocks.length; i++) {
    products[i].valid = isValidNewBlock(blocks[i], blocks[i - 1]);
  }
  return res.render("list", { pageTitle: "Product List", products });
};

export const getDetail = async (req, res) => {
  const {
    params: { id },
  } = req;

  const product = await Product.findById({ _id: id });
  if (!product) {
    return res
      .status(404)
      .render("detail", { pageTitle: "Erorr", errorMessage: "Erorr Error !" });
  }
  return res
    .status(200)
    .render("detail", { pageTitle: "Product Detail", product });
};
