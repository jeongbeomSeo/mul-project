import Product from "../models/Product";

export const postSoldItem = async (req, res) => {
  const {
    params: { id },
  } = req;

  const product = await Product.findById({ _id: id });
  if (!product) {
    return res.sendStatus(404);
  }

  return res.sendStatus(200);
};

export const postBuyItem = async (req, res) => {
  const {
    body: { entry_money, lower_price },
    session: { user },
    params: { id },
  } = req;
  const entrant = {
    entry_money: entry_money,
    id: user._id,
  };

  // session user가 가지고 있는 돈과 entry_money비교하기.
  // session user가 가지고 있는 돈과 최소 금액과 비교하기.
  if (user.money < entry_money || user.money < lower_price) {
    return res.status(400).json({ message: "돈이 부족합니다." });
    // sendStatus와 json을 같이 쓰면 오류가 난다.
    // sendStatus로 보냈는데 json을 또 보낼려고 해서 나오는 오류다.
  }

  // DB에 입찰자인지 체크하고 입찰자이면 새로운 입력값 넣어주기.
  // DB에 user의 id와 가격을 object형태로 넣어줌.

  const product = await Product.findById({ _id: id });
  const findEntrant = (person) => person.id == user._id;
  const alreadyEntrantIndex = product.entrant.findIndex(findEntrant);
  if (alreadyEntrantIndex) {
    product.entrant.splice(alreadyEntrantIndex, 1, entrant);
  } else {
    product.entrant.push(entrant);
  }
  await product.save();

  return res.sendStatus(201);
};
