import Product from "../models/Product";
import User from "../models/User";

export const postSoldItem = async (req, res) => {
  const {
    params: { id },
  } = req;

  const product = await Product.findById({ _id: id });
  if (!product) {
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }

  // 팔리지 않은 상품
  if (!product.sold) {
    // Product 중에서 가장 entry_money가 높은 entrant뽑아내기.
    const maxEntryMoney = Math.max(
      ...product.entrants.map((entrant) => entrant.entry_money, 0)
    );
    const bidder = product.entrants.find(
      (entrant) => entrant.entry_money === maxEntryMoney
    );
    if (!bidder) {
      return res.status(404).json({ message: "아무도 사지 않았습니다." });
    }
    // 해당 Product의 sold를 true로 바꿔주고, entrant에 product넣어주기(push), soldPrice도 넣어주기.
    await Product.findByIdAndUpdate(id, {
      sold: true,
      bidderId: bidder.id,
      soldPrice: maxEntryMoney,
    });
    // 해당 Product에 누가 샀는지도 넣어주기.
    const buyer = await User.findById(bidder.id);
    buyer.buyItems.push(product._id);
    await buyer.save();

    // 해당 Product의 모든 입찰자들 돈 Pacback처리.
    const notEntrants = product.entrants.filter(
      (entrant) => entrant !== bidder
    );
    for (const person of notEntrants) {
      const user = await User.findById(person.id);
      user.money += person.entry_money;
      await user.save();
    }
    return res.sendStatus(200);
  }
  //팔린 상품
  else {
    return res.sendStatus(400);
  }
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
  const alreadyEntrantIndex = product.entrants.findIndex(findEntrant);
  const bidder = await User.findById(entrant.id);
  if (!bidder) {
    return res.sendStatus(400);
  }
  // alreadyEntrantIndex가 -1이 아니라는 것은 Index가 있다는 것 즉, 이미 Entrant에 등록되어 있는 사람.
  if (alreadyEntrantIndex !== -1) {
    // 성공적으로 재 입찰 시 (유저의 Money Payback)
    bidder.money += product.entrants[alreadyEntrantIndex].entry_money;
    product.entrants.splice(alreadyEntrantIndex, 1, entrant);
  } else {
    // 성공적으로 처음 입찰 했을 때
    product.entrants.push(entrant);
  }
  await product.save();

  bidder.money -= entry_money;
  await bidder.save();
  req.session.user = bidder;

  return res.sendStatus(201);
};
