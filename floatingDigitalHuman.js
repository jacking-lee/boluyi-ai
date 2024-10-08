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
    padding: '15px 30px',
    borderRadius: '10px',
    fontSize: '14px',    
    maxWidth: '800px', // Updated to significantly increase chat box width to accommodate more text
    minWidth: '300px'  // Set minimum width for consistency
  });

  const voiceButton = document.getElementById("voice-button");
  setElementStyles(voiceButton, {
    width: '50px',
    height: '50px',
    position: 'absolute',
    bottom: '20px',
    left: '40%', // Updated to position microphone more accurately relative to character
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
    const characterWidth = digitalHuman.offsetWidth;
    const characterOffset = window.innerWidth / 2;
    const offsetAdjustment = characterWidth; // Adjust by character width for accurate positioning
    if (characterPosition < characterOffset) {
      characterImage.style.transform = "scaleX(1)";
      setElementStyles(chatBox, {
        left: `${characterWidth + 50}px`, // Adjusted to ensure chat box is positioned to the right of character
        transform: 'translateX(0)',
        maxWidth: '800px', // Ensure chat box width is consistent
        minWidth: '300px'
      });
      setElementStyles(voiceButton, {
        left: `${characterWidth * 0.5}px` // Position microphone in front of character
      });
    } else {
      characterImage.style.transform = "scaleX(-1)";
      setElementStyles(chatBox, {
        right: `${characterWidth + 50}px`, // Adjusted to ensure chat box is positioned to the left of character
        left: 'auto',
        transform: 'translateX(0)',
        maxWidth: '800px', // Ensure chat box width is consistent
        minWidth: '300px'
      });
      setElementStyles(voiceButton, {
        right: `${characterWidth * 0.5}px`, // Position microphone in front of character
        left: 'auto'
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
      padding: '15px 30px',
      borderRadius: '10px',
      fontSize: '14px',
      maxWidth: '800px', // Updated to significantly increase chat box width
      minWidth: '300px'
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

  // New section for version v1.20: virtual human library and customization
  const virtualHumanSelection = document.getElementById("virtual-human-selection");
  setElementStyles(virtualHumanSelection, {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px'
  });

  // Allow users to select virtual humans and customize
  const availableCharacters = ["character1.png", "character2.png", "character3.png"];
  availableCharacters.forEach(characterSrc => {
    const characterOption = document.createElement('img');
    characterOption.src = characterSrc;
    characterOption.classList.add('character-option');
    setElementStyles(characterOption, {
      width: '80px',
      height: 'auto',
      cursor: 'pointer'
    });
    virtualHumanSelection.appendChild(characterOption);

    characterOption.addEventListener('click', () => {
      characterImage.src = characterSrc;
    });
  });

  // Add voice selection feature
  const voiceOptions = [
    { name: "Voice 1", lang: "en-US" },
    { name: "Voice 2", lang: "zh-CN" },
    { name: "Voice 3", lang: "fr-FR" }
  ];

  const voiceSelect = document.createElement('select');
  voiceOptions.forEach(voiceOption => {
    const option = document.createElement('option');
    option.value = voiceOption.lang;
    option.innerText = voiceOption.name;
    voiceSelect.appendChild(option);
  });
  virtualHumanSelection.appendChild(voiceSelect);

  voiceSelect.addEventListener('change', (e) => {
    recognition.lang = e.target.value;
  });

  // Share QR code feature
  const shareButton = document.createElement('button');
  shareButton.innerText = "分享二维码";
  setElementStyles(shareButton, {
    padding: '10px 20px',
    fontSize: '14px',
    borderRadius: '5px',
    cursor: 'pointer'
  });
  virtualHumanSelection.appendChild(shareButton);

  shareButton.addEventListener('click', () => {
    const qrCodeImage = document.createElement('img');
    qrCodeImage.src = "qrcode.png"; // This should be replaced with a real QR code generation process
    setElementStyles(qrCodeImage, {
      width: '150px',
      height: '150px'
    });
    virtualHumanSelection.appendChild(qrCodeImage);
  });

  // Add functionality to share the digital human to WeChat Mini Program
  const wechatButton = document.createElement('button');
  wechatButton.innerText = "微信小程序增加数字形象";
  setElementStyles(wechatButton, {
    padding: '10px 20px',
    fontSize: '14px',
    borderRadius: '5px',
    cursor: 'pointer'
  });
  virtualHumanSelection.appendChild(wechatButton);

  wechatButton.addEventListener('click', () => {
    alert('数字形象已添加到微信小程序中。');
  });
});
