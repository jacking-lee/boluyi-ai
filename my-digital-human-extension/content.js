
// content.js - Content Script to Insert Floating Digital Human
document.addEventListener("DOMContentLoaded", () => {
  // 创建数字人容器
  const digitalHumanContainer = document.createElement("div");
  digitalHumanContainer.id = "digital-human";

  digitalHumanContainer.innerHTML = `
    <img id="character-image" src="${chrome.runtime.getURL("bluey.png")}" alt="布鲁伊" />
    <div id="chat-box">
      <p id="output-text">你好，我是布鲁伊，可以帮你做什么呢？</p>
    </div>
    <button id="voice-button">🎙️ 语音输入</button>
  `;

  // 将数字人容器添加到页面上
  document.body.appendChild(digitalHumanContainer);

  // 处理语音按钮点击
  document.getElementById("voice-button").addEventListener("click", () => {
    let userText = prompt("请告诉布鲁伊你想做什么：");
    if (userText) {
      handleCommand(userText);
    }
  });

  // 命令处理函数
  function handleCommand(command) {
    let response = "抱歉，我不太理解你说的是什么。";

    if (command.includes("打开谷歌")) {
      response = "正在帮你打开谷歌。";
      window.open("https://www.google.com", "_blank");
    } else if (command.includes("告诉我关于布鲁伊的故事")) {
      response = "布鲁伊是一只六岁的蓝色澳大利亚牧牛犬，她喜欢冒险和和家人一起玩耍。";
    }

    document.getElementById("output-text").innerText = response;
  }
});
