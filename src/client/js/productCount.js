const counts = document.getElementsByClassName("item-count");
const item = document.getElementsByClassName("item");

const sold = (index) => {
  const soldItemId = item[index].dataset.id;
  fetch(`/api/${soldItemId}/sold`, {
    method: "POST",
  });
  // fetch 이용해서 User DB에 해당 Product 넣어주기.
  // Product넣어주면서 sold는 true로 바꿔주기.
  // Product sold값이 ture인 것은 경매 기록에서 Rendering
  // 경매 기록 페이지에선 누구의 userId가 경매에 성공했는지 보여주기. (entrant 객체의 id값 이용).
  // Product sold값이 false인 것은 list page에서 Rendering
};

const countDown = () => {
  for (let index = 0; index < counts.length; index++) {
    const createdAt = counts[index].dataset.time;
    const date = new Date(createdAt);
    const currentTime = new Date();
    const deadLine = new Date(date.getTime() + 1000 * 60 * 60 * 48);
    if (deadLine.getTime() - currentTime.getTime() == 0) {
      sold(index);
    }
    const diffSecond = `${Math.floor(
      ((deadLine.getTime() - currentTime.getTime()) / 1000) % 60
    )}`.padStart(2, "0");
    const diffMinute = `${Math.floor(
      ((deadLine.getTime() - currentTime.getTime()) / (1000 * 60)) % 60
    )}`.padStart(2, "0");
    const diffHour = `${Math.floor(
      (deadLine.getTime() - currentTime.getTime()) / (1000 * 60 * 60)
    )}`.padStart(2, "0");
    counts[
      index
    ].innerHTML = `경매 마감 시간: ${diffHour} : ${diffMinute} : ${diffSecond}`;
  }
};

countDown();

setInterval(countDown, 1000);
