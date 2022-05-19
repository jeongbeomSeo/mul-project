import {
  Block,
  BlockBody,
  createGenesisBlock,
  findBlock,
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
    return res.render(404, {
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
  const products = await Product.find({});
  if (!products) {
    return res.render("list", {
      pageTitle: "Product List",
      empty: "Empty",
    });
  }
  return res.render("list", { pageTitle: "Product List", products });
};

export const getDetail = (req, res) => {
  return res.render("detail", { pageTitle: "Product Detail" });
};
