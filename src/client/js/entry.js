// import { response } from "express"; 이렇게 한다면 오류가 난다.

const input = document.getElementById("entry_money");
const btn = document.getElementById("entry");
const item = document.getElementsByClassName("item");
const product_detail = document.getElementById("product-detail");

let message, timerId;

const blankEnter = () => {
  message = document.createElement("span");
  message.id = "message";
  message.innerHTML = "숫자를 입력하세요";
  product_detail.appendChild(message);
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => {
    message.remove();
  }, 3000);
  return message;
};

const lowMoney = () => {
  message = document.createElement("span");
  message.id = "message";
  message.innerHTML = "최소 가격 보다 높게 입력하세요.";
  product_detail.appendChild(message);
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => {
    message.remove();
  }, 3000);
  return message;
};

const entry = async () => {
  const entry_money = Number(input.value);
  const lowerPrice = Number(
    document.getElementsByClassName("item-price")[0].dataset.price
  );
  const itmeId = item[0].dataset.id;
  // validation
  if (message) {
    message.remove();
  }
  if (input.value == "") {
    message = blankEnter();
    return;
  }
  if (entry_money < lowerPrice) {
    message = lowMoney();
    return;
  }
  // fetch 이용해서 처리하기
  const response = await fetch(`/api/${itmeId}/buy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ entry_money: entry_money, lowerPrice: lowerPrice }),
  });
  console.log(response);
  if (response.status === 400) {
    const { message } = await response.json();
    alert(message);
    window.location.reload();
  }
  if (response.status === 201) {
    alert("성공적으로 입찰되었습니다.");
    window.location.reload();
  }
};

const enter = (e) => {
  if (e.keyCode === 13) {
    entry();
  }
};

btn.addEventListener("click", entry);
input.addEventListener("keypress", enter);
