document.addEventListener("DOMContentLoaded", () => {
  const characterImage = document.getElementById("character-image");
  setElementStyles(characterImage, {
    width: '100px',
    height: 'auto',
    borderRadius: '0'
  });

  const digitalHuman = document.getElementById("digital-human");
  setElementStyles(digitalHuman, {
    width: 'fit-content',
    height: 'fit-content',
    padding: '0',
    background: 'transparent',
    border: 'none',
    cursor: 'grab',
    boxShadow: 'none',
    right: '20px',
    bottom: '20px',
    position: 'fixed'
  });

  const chatBox = document.getElementById("chat-box");
  setElementStyles(chatBox, {
    position: 'absolute',
    top: '-90px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#e3f2fd',
    padding: '5px 10px',
    borderRadius: '10px',
    fontSize: '12px',    
    maxWidth: '200px'
  });

  const voiceButton = document.getElementById("voice-button");
  setElementStyles(voiceButton, {
    width: '40px',
    height: '40px',
    position: 'absolute',
    bottom: '10px',
    left: '30%', // Updated to position microphone more accurately relative to character
    cursor: 'pointer'
  });

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
  const updateCharacterDirection = () => {
    const characterPosition = digitalHuman.getBoundingClientRect().left + digitalHuman.offsetWidth / 2;
    if (characterPosition < window.innerWidth / 2) {
      characterImage.style.transform = "scaleX(1)";
      setElementStyles(chatBox, {
        left: 'calc(50% + 40px)',
        transform: 'translateX(0)'
      });
      setElementStyles(voiceButton, {
        left: '10%'
      });
    } else {
      characterImage.style.transform = "scaleX(-1)";
      setElementStyles(chatBox, {
        left: 'calc(50% - 40px)',
        transform: 'translateX(-100%)'
      });
      setElementStyles(voiceButton, {
        left: '80%'
      });
    }
  };

  window.addEventListener("resize", updateCharacterDirection);
  window.addEventListener("mousemove", updateCharacterDirection);

  // Dragging functionality
  let offsetX, offsetY;

  function initializeDragEvents(element) {
    element.addEventListener("mousedown", (e) => {
      e.preventDefault();
      offsetX = e.clientX - digitalHuman.getBoundingClientRect().left;
      offsetY = e.clientY - digitalHuman.getBoundingClientRect().top;
      digitalHuman.style.cursor = 'grabbing';
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    element.addEventListener("touchstart", (e) => {
      e.preventDefault();
      offsetX = e.touches[0].clientX - digitalHuman.getBoundingClientRect().left;
      offsetY = e.touches[0].clientY - digitalHuman.getBoundingClientRect().top;
      digitalHuman.style.cursor = 'grabbing';
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", onTouchEnd);
    });
  }

  initializeDragEvents(digitalHuman);
  initializeDragEvents(characterImage);

  function onMouseMove(e) {
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;
    updateElementPositions(newX, newY);
  }

  function onTouchMove(e) {
    const newX = e.touches[0].clientX - offsetX;
    const newY = e.touches[0].clientY - offsetY;
    updateElementPositions(newX, newY);
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    digitalHuman.style.cursor = 'grab';
  }

  function onTouchEnd() {
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
    digitalHuman.style.cursor = 'grab';
  }

  function updateElementPositions(newX, newY) {
    digitalHuman.style.left = `${newX}px`;
    digitalHuman.style.top = `${newY}px`;
    updateCharacterDirection();
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
    const userChatBox = document.createElement('div');
    userChatBox.classList.add('user-chat-box');
    setElementStyles(userChatBox, {
      position: 'absolute',
      top: '-130px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#ffe4e1', // Changed to light pink for user chat box
      padding: '5px 10px',
      borderRadius: '10px',
      fontSize: '12px',
      maxWidth: '150px'
    });
    userChatBox.innerText = text;
    chatBox.parentNode.insertBefore(userChatBox, chatBox);
  }

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

  function setElementStyles(element, styles) {
    for (const property in styles) {
      element.style[property] = styles[property];
    }
  }
});
