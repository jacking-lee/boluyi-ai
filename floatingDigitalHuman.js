document.addEventListener("DOMContentLoaded", () => {
  const characterImage = document.getElementById("character-image");
  const digitalHuman = document.getElementById("digital-human");
  const chatBox = document.getElementById("chat-box");
  const voiceButton = document.getElementById("voice-button");
  const speakerIcon = document.getElementById("speaker-icon");
  const callScreen = document.getElementById("call_screen");
  const callButton = document.getElementById("call_button");
  const callStatus = document.getElementById("call_status");
  const videoScreen = document.getElementById("video_screen");
  const rtcMediaPlayer = document.getElementById("rtc_media_player");
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

  // Call screen logic
  characterImage.addEventListener("click", () => {
    callScreen.style.display = "flex";
  });

  callButton.addEventListener("click", () => {
    callButton.disabled = true;
    callStatus.style.display = "block";

    // Simulate dialing, enter video screen after 3 seconds
    setTimeout(() => {
      callScreen.style.display = "none";
      videoScreen.style.display = "block";
      startVideoStream();
    }, 3000);
  });

  // Start video stream
  function startVideoStream() {
    const url = "https://metahuman.assion.cn/rtc/v1/whep/?app=live&stream=livestream";
    rtcMediaPlayer.src = url;
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
