// animeVirtualCharacter.js

// 初始化项目ID和密钥
let projectId = '687b4e56-86ec-11ef-8b59-e98c31ebf072';  // 项目ID
let signature = '8a7f57fc48f847c2af8d9b3bb690d6ec';  // 密钥

// 检查项目ID和密钥是否可用
const checkCredentials = () => {
  if (!projectId || !signature) {
    console.error('项目ID或密钥缺失，请确保正确配置项目ID和密钥');
    return false;
  }
  return true;
};

// 虚拟角色选择
const characterCards = document.querySelectorAll('.character-card');
characterCards.forEach(card => {
  card.addEventListener('click', () => {
    if (!checkCredentials()) return;
    console.log(`选择了角色: ${card.querySelector('p').textContent}`);
    // 显示角色详细信息弹窗
    showCharacterDetails(card.querySelector('p').textContent);
  });
});

// 显示角色详细信息弹窗
const showCharacterDetails = (characterName) => {
  const dialog = document.createElement('div');
  dialog.classList.add('dialog');
  dialog.setAttribute('tabindex', '0'); // 使弹窗可通过键盘访问
  dialog.innerHTML = `
    <h3>角色详情</h3>
    <p>角色名称: ${characterName}</p>
    <button id="close-dialog">关闭</button>
  `;
  document.body.appendChild(dialog);
  dialog.focus();

  document.getElementById('close-dialog').addEventListener('click', () => {
    document.body.removeChild(dialog);
  });

  // 按下 Esc 键时关闭弹窗
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.body.removeChild(dialog);
    }
  });
};

// 角色定制功能
const customizeButtons = document.querySelectorAll('.customize-button');
customizeButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (!checkCredentials()) return;
    const characterName = button.parentNode.querySelector('p').textContent;
    console.log(`开始定制角色: ${characterName}`);
    // 显示角色定制界面
    navigateToPage('characterCustomization');
  });
});

// 角色定制参数
const characterVoiceSelect = document.getElementById('character-voice');
characterVoiceSelect?.addEventListener('change', (event) => {
  if (!checkCredentials()) return;
  console.log(`选择了声音风格: ${event.target.value}`);
});

const characterOutfitSelect = document.getElementById('character-outfit');
characterOutfitSelect?.addEventListener('change', (event) => {
  if (!checkCredentials()) return;
  console.log(`选择了服装风格: ${event.target.value}`);
});

// 产品定制功能
const productTypeSelect = document.getElementById('product-type');
productTypeSelect?.addEventListener('change', (event) => {
  if (!checkCredentials()) return;
  console.log(`选择了产品类型: ${event.target.value}`);
});

const productSizeInput = document.getElementById('product-size');
productSizeInput?.addEventListener('input', (event) => {
  if (!checkCredentials()) return;
  console.log(`输入的产品尺寸: ${event.target.value}`);
});

// 数字互动与视频生成
const createVideoButton = document.getElementById('create-video');
createVideoButton?.addEventListener('click', () => {
  if (!checkCredentials()) return;
  console.log('生成互动视频');
  // 显示生成视频界面
  navigateToPage('videoCreation');
});

const startInteractionButton = document.getElementById('start-interaction');
startInteractionButton?.addEventListener('click', () => {
  if (!checkCredentials()) return;
  console.log('开始数字互动');
  // 显示互动界面
  navigateToPage('interaction');
});

// 生成二维码与分享
const generateQrButton = document.getElementById('generate-qr');
generateQrButton?.addEventListener('click', () => {
  if (!checkCredentials()) return;
  console.log('生成二维码');
  // 显示二维码生成界面
  document.getElementById('qr-code').textContent = '二维码生成成功';
  navigateToPage('qrCodeGeneration');
});

// 拨号与挂断功能
const dialButton = document.getElementById('dial-button');
dialButton?.addEventListener('click', () => {
  if (!checkCredentials()) return;
  console.log('开始拨号');
  // 显示拨号界面
  navigateToPage('calling');
  setupAudioVideoElements();
});

const hangUpButton = document.getElementById('hang-up-button');
hangUpButton?.addEventListener('click', () => {
  if (!checkCredentials()) return;
  console.log('挂断通话');
  // 返回到互动界面
  navigateToPage('interaction');
});

// 页面跳转功能
const navigateToPage = (pageId) => {
  console.log(`跳转到页面: ${pageId}`);
  // 使用 display 样式控制页面跳转逻辑
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.style.display = 'block';
  }
};

// 设置拨号页面音频/视频组件
const setupAudioVideoElements = () => {
  console.log('设置音频/视频组件');
  // 这里添加设置音频/视频组件的逻辑，例如初始化音频和视频元素
};

// 样式部分
const styles = document.createElement('style');
styles.textContent = `
  .character-card, .customize-button, #character-voice, #character-outfit, #product-type, #product-size, #create-video, #start-interaction, #generate-qr, #dial-button, #hang-up-button {
    margin: 10px;
    padding: 10px;
    border-radius: 5px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
  }

  .character-card:hover, .customize-button:hover, #create-video:hover, #start-interaction:hover, #generate-qr:hover, #dial-button:hover, #hang-up-button:hover {
    background-color: #e0e0e0;
    cursor: pointer;
  }

  #qr-code {
    padding: 20px;
    margin-top: 10px;
    border: 1px dashed #aaa;
    background-color: #fff;
    text-align: center;
  }

  .page {
    display: none;
  }

  #character-selection, #characterDetails, #characterCustomization, #productCustomization, #videoCreation, #interaction, #qrCodeGeneration, #calling {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    border: 1px solid #ddd;
    margin: 20px;
  }

  #character-selection {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }

  .character-card {
    width: 150px;
    text-align: center;
    border: 2px solid #007bff;
    padding: 15px;
    transition: transform 0.3s;
  }

  .character-card:hover {
    transform: scale(1.05);
  }

  .customize-button {
    margin-top: 10px;
  }

  .dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px;
    background-color: #fff;
    border-radius: 10px;
    border: 1px solid #ddd;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }

  .dialog:focus {
    outline: none;
  }
`;
document.head.appendChild(styles);

// 默认显示角色选择页面
navigateToPage('character-selection');
