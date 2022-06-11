import {
  Block,
  BlockBody,
  createGenesisBlock,
  findBlock,
  isValidNewBlock,
  nextBlock,
} from "../block";
import Product from "../models/Product";

const makingBlock = (products) => {
  return products.map((product) => {
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
};

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
  const products = await Product.find({ sold: false });
  // find의 경우 여러개를 찾는 거라서 !product가 작동하지 않는다. object형태이기 때문이다.
  // findOnde의 경우는 하나늘 찾는 것이고 없으면 !product가 적용된다. null이기 때문이다.
  // 참고: https://velog.io/@soyi47/Javascript-%EB%B9%88-%EA%B0%9D%EC%B2%B4-%ED%99%95%EC%9D%B8%ED%95%98%EA%B8%B0
  // 참고: https://haenny.tistory.com/136
  if (Object.keys(products).length === 0) {
    return res.render("list", {
      pageTitle: "Product List",
      empty: "Empty",
    });
  }
  blocks = makingBlock(products);
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

export const getHistory = async (req, res) => {
  let blocks = [];
  // 팔린 상품만 불러오기.
  const products = await Product.find({ sold: true }).populate("user");
  if (Object.keys(products).length === 0) {
    return res.render("list", {
      pageTitle: "Product List",
      empty: "Empty",
    });
  }
  blocks = makingBlock(products);
  products[0].valid = true;
  for (let i = 1; i < blocks.length; i++) {
    products[i].valid = isValidNewBlock(blocks[i], blocks[i - 1]);
  }
  return res.render("history", { pageTitle: "Product List", products });
};
