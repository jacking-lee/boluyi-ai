document.addEventListener("DOMContentLoaded", () => {
  const characterImage = document.getElementById("character-image");
  characterImage.style.width = '100%';
  characterImage.style.borderRadius = '50%';
      characterImage.style.borderRadius = '50%';
  const digitalHuman = document.getElementById("digital-human");
  digitalHuman.style.width = 'auto';
  digitalHuman.style.height = 'auto';
  digitalHuman.style.padding = '0';
  digitalHuman.style.boxShadow = 'none';
  digitalHuman.style.borderRadius = '50%';
  digitalHuman.style.cursor = 'move';
      digitalHuman.style.padding = '10px';
      digitalHuman.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
      digitalHuman.style.right = '20px';
      digitalHuman.style.bottom = '20px';
  const chatBox = document.getElementById("chat-box");
  chatBox.style.position = 'absolute';
  chatBox.style.top = '-50px';
  chatBox.style.left = '100%';
  chatBox.style.transform = 'translateX(10px)';
  chatBox.style.background = '#e3f2fd';
  chatBox.style.padding = '5px 10px';
  chatBox.style.borderRadius = '10px';
  chatBox.style.fontSize = '14px';
  chatBox.style.maxWidth = '150px';
      chatBox.style.top = '-30px';
      chatBox.style.left = '110%';
      chatBox.style.background = '#e3f2fd';
      chatBox.style.padding = '5px 10px';
      chatBox.style.borderRadius = '10px';
      chatBox.style.fontSize = '12px';
      chatBox.style.maxWidth = '200px';
  const voiceButton = document.getElementById("voice-button");
  voiceButton.style.width = '30px';
  voiceButton.style.height = '30px';
  voiceButton.style.position = 'absolute';
  voiceButton.style.top = '0';
  voiceButton.style.left = '100%';
  voiceButton.style.transform = 'translateX(20%)';
  voiceButton.style.cursor = 'pointer';
      voiceButton.style.height = '40px';
      voiceButton.style.marginTop = '10px';
  const speakerIcon = document.getElementById("speaker-icon");
  speakerIcon.remove();
      speakerIcon.style.height = '30px';
      speakerIcon.style.marginTop = '5px';
  let isActive = false;
  let isVoiceOn = false;
  let isMuted = false;
  const synth = window.speechSynthesis;
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'zh-CN';
  recognition.interimResults = false;

  setInterval(() => {
    isActive = !isActive;
    characterImage.src = isActive ? "boluyi-1.png" : "boluyi.png";
  }, 1000);

  // Update character direction based on screen center
  const screenCenterX = window.innerWidth / 2;
  const updateCharacterDirection = () => {
    const characterPosition = digitalHuman.getBoundingClientRect().left + digitalHuman.offsetWidth / 2;
    if (characterPosition < screenCenterX) {
      characterImage.style.transform = "scaleX(1)";
      chatBox.style.left = "110%";
      chatBox.style.right = "auto";
    } else {
      characterImage.style.transform = "scaleX(-1)";
      chatBox.style.left = "auto";
      chatBox.style.right = "110%";
    }
  };

  window.addEventListener("resize", updateCharacterDirection);
  window.addEventListener("mousemove", updateCharacterDirection);

  // Dragging functionality
  let offsetX, offsetY;
  digitalHuman.addEventListener("mousedown", (e) => {
    offsetX = e.clientX - digitalHuman.getBoundingClientRect().left;
    offsetY = e.clientY - digitalHuman.getBoundingClientRect().top;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function onMouseMove(e) {
    digitalHuman.style.left = `${e.clientX - offsetX}px`;
    digitalHuman.style.top = `${e.clientY - offsetY}px`;
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  // Handle voice button click
  voiceButton.addEventListener("click", () => {
    if (isVoiceOn) {
      recognition.stop();
      voiceButton.src = "microphone-off.png";
    } else {
      recognition.start();
      voiceButton.src = "microphone-on.png";
    }
    isVoiceOn = !isVoiceOn;
  });

  recognition.addEventListener('result', (event) => {
    const userText = event.results[0][0].transcript;
    appendUserText(userText);
    handleCommand(userText);
  });

  // Append user input to chat box
  function appendUserText(text) {
    chatBox.innerText = text;
  }

  // Handle speaker icon click
  speakerIcon.addEventListener("click", () => {
    isMuted = !isMuted;
    speakerIcon.classList.toggle("muted", isMuted);
  });

  // Command handling
  async function handleCommand(command) {
    let response = "抱歉，我不太理解你说的是什么。";

    if (command.includes("打开谷歌")) {
      response = "正在帮你打开谷歌。";
      window.open("https://www.google.com", "_blank");
    } else if (command.includes("告诉我关于布鲁伊的故事")) {
      response = "布鲁伊是一只六岁的蓝色澳大利亚牧牛犬，她喜欢冒险和和家人一起玩耍。";
    } else {
      // Call private LLM API
      const openaiResponse = await getOpenAIResponse(command);
      response = openaiResponse || response;
    }

    document.getElementById("output-text").innerText = response;
    if (!isMuted) {
      speakText(response);
    }
  }

  // Private LLM API call
  async function getOpenAIResponse(command) {
    try {
      const response = await fetch('http://langflow.assion.cn/api/v1/run/5e5275fe-9b5b-47cf-9798-46ab83df9216?stream=false', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "input_value": command,
          "output_type": "chat",
          "input_type": "chat",
          "tweaks": {
            "ChatInput-wyLTJ": {},
            "ChatOutput-IE8Ts": {},
            "OllamaModel-Fq1gy": {},
            "APIRequest-sQkPR": {},
            "TextOutput-hiW2h": {},
            "ParseData-xSVJH": {},
            "Prompt-oV3rX": {}
          }
        })
      });

      const data = await response.json();
      return data.outputs[0].outputs[0].results.message.text;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  // Text to Speech (TTS)
  function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  }

  // Random animations for attention
  const randomActions = [
    "打哈欠",
    "眨眼",
    "伸懒腰",
    "头微微一侧",
    "身体轻轻摇晃",
    "手指轻敲",
    "开心地哼歌",
    "手指比心",
    "脸上露出困惑的表情",
    "悄悄地朝一侧偷看"
  ];
  const randomSounds = [
    "嗯...",
    "啊哈！",
    "噗嗤",
    "嘿嘿",
    "唔？",
    "咦...",
    "哦哦！",
    "哈哈哈",
    "哇哦",
    "嘿呀"
  ];

  function performRandomAction() {
    const actionIndex = Math.floor(Math.random() * randomActions.length);
    const soundIndex = Math.floor(Math.random() * randomSounds.length);
    const randomAction = randomActions[actionIndex];
    const randomSound = randomSounds[soundIndex];

    chatBox.innerText = `${randomSound} ${randomAction}`;
  }

  setInterval(() => {
    if (!isVoiceOn) {
      performRandomAction();
    }
  }, 10000);
});
