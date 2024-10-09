// Enhanced functionality for the Floating Digital Human
export class FloatingDigitalHuman {
  constructor(apiEndpoints, apiKeys) {
    this.apiEndpoints = apiEndpoints;
    this.apiKeys = apiKeys;
    this.synth = window.speechSynthesis;
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.lang = 'zh-CN';
    this.recognition.interimResults = false;
    this.isVoiceOn = false;
    this.isMuted = false;
    this.initEvents();
  }

  initEvents() {
    document.getElementById('voice-button').addEventListener('click', () => this.toggleVoice());
    document.getElementById('speaker-icon').addEventListener('click', () => this.toggleMute());
    document.getElementById('digital-human').addEventListener('mousedown', (e) => this.onDragStart(e));
    this.recognition.addEventListener('result', (event) => {
      const userText = event.results[0][0].transcript;
      this.handleCommand(userText);
    });
  }

  toggleVoice() {
    if (this.isVoiceOn) {
      this.recognition.stop();
      document.getElementById('voice-button').src = "microphone-off.png";
    } else {
      this.recognition.start();
      document.getElementById('voice-button').src = "microphone-on.png";
    }
    this.isVoiceOn = !this.isVoiceOn;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    document.getElementById('speaker-icon').classList.toggle('muted', this.isMuted);
  }

  onDragStart(e) {
    const digitalHuman = document.getElementById('digital-human');
    const offsetX = e.clientX - digitalHuman.getBoundingClientRect().left;
    const offsetY = e.clientY - digitalHuman.getBoundingClientRect().top;
    const onMouseMove = (e) => {
      digitalHuman.style.left = `${e.clientX - offsetX}px`;
      digitalHuman.style.top = `${e.clientY - offsetY}px`;
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  async handleCommand(command) {
    let response = "抱歉，我不太理解你说的是什么。";
    try {
      const privateModelResponse = await this.callApi(this.apiEndpoints.private, command, this.apiKeys.private);
      if (privateModelResponse) {
        response = privateModelResponse;
      } else {
        const backupModelResponse = await this.callApi(this.apiEndpoints.backup, command, this.apiKeys.backup);
        response = backupModelResponse || "哎呀，我现在脑子丢了，无法理解你说的。";
      }
    } catch (error) {
      console.error('Error:', error);
      response = "哎呀，我现在脑子丢了，无法理解你说的。";
    }
    this.updateChatBox(response, 'response');
    if (!this.isMuted) {
      this.speakText(response);
    }
  }

  async callApi(endpoint, command, apiKey) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'model',
          prompt: command,
          max_tokens: 150
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.choices[0].text.trim();
      } else {
        console.error('API response error:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  updateChatBox(text, type) {
    const chatBox = document.getElementById('chat-box');
    if (type === 'response') {
      chatBox.innerHTML = `<p id="output-text">${text}</p>`;
      chatBox.style.right = '20px';
    } else if (type === 'user') {
      const userChatBox = document.getElementById('user-chat-box');
      userChatBox.innerHTML = `<p id="user-text">${text}</p>`;
    }
  }

  speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    this.synth.speak(utterance);
  }
}

// HTML Update: Add user chat box above the digital human's chat box
const userChatBoxHTML = `<div id="user-chat-box" style="position: absolute; top: -120px; left: 50%; transform: translateX(-50%); background: #fff3e0; padding: 10px; border-radius: 10px;">
  <p id="user-text"></p>
</div>`;
document.addEventListener("DOMContentLoaded", () => {
  const digitalHuman = document.getElementById('digital-human');
  const chatBox = document.getElementById('chat-box');
  chatBox.style.right = '40px'; // Move the chat box to the right to avoid blocking the character
  digitalHuman.insertAdjacentHTML('afterbegin', userChatBoxHTML);
});
