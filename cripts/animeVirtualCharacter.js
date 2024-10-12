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
    // 这里可以调用角色的详细展示页面
    navigateToPage('characterDetails');
  });
});

// 角色定制功能
const customizeButtons = document.querySelectorAll('.customize-button');
customizeButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (!checkCredentials()) return;
    const characterName = button.parentNode.querySelector('p').textContent;
    console.log(`开始定制角色: ${characterName}`);
    // 这里调用角色定制的界面逻辑
    navigateToPage('characterCustomization');
  });
});

// 角色定制参数
const characterVoiceSelect = document.getElementById('character-voice');
characterVoiceSelect.addEventListener('change', (event) => {
  if (!checkCredentials()) return;
  console.log(`选择了声音风格: ${event.target.value}`);
});

const characterOutfitSelect = document.getElementById('character-outfit');
characterOutfitSelect.addEventListener('change', (event) => {
  if (!checkCredentials()) return;
  console.log(`选择了服装风格: ${event.target.value}`);
});

// 产品定制功能
const productTypeSelect = document.getElementById('product-type');
productTypeSelect.addEventListener('change', (event) => {
  if (!checkCredentials()) return;
  console.log(`选择了产品类型: ${event.target.value}`);
});

const productSizeInput = document.getElementById('product-size');
productSizeInput.addEventListener('input', (event) => {
  if (!checkCredentials()) return;
  console.log(`输入的产品尺寸: ${event.target.value}`);
});

// 数字互动与视频生成
const createVideoButton = document.getElementById('create-video');
createVideoButton.addEventListener('click', () => {
  if (!checkCredentials()) return;
  console.log('生成互动视频');
  // 这里调用生成视频的相关接口或功能
  navigateToPage('videoCreation');
});

const startInteractionButton = document.getElementById('start-interaction');
startInteractionButton.addEventListener('click', () => {
  if (!checkCredentials()) return;
  console.log('开始数字互动');
  // 这里调用开始互动的相关逻辑
  navigateToPage('interaction');
});

// 生成二维码与分享
const generateQrButton = document.getElementById('generate-qr');
generateQrButton.addEventListener('click', () => {
  if (!checkCredentials()) return;
  console.log('生成二维码');
  // 这里调用二维码生成的逻辑，展示在 qr-code 区域
  document.getElementById('qr-code').textContent = '二维码生成成功';
  navigateToPage('qrCodeGeneration');
});

// 页面跳转功能
const navigateToPage = (pageId) => {
  console.log(`跳转到页面: ${pageId}`);
  // 这里实现页面之间的跳转逻辑
  document.getElementById(pageId).scrollIntoView({ behavior: 'smooth' });
};

// 样式部分
const styles = document.createElement('style');
styles.textContent = `
  .character-card, .customize-button, #character-voice, #character-outfit, #product-type, #product-size, #create-video, #start-interaction, #generate-qr {
    margin: 10px;
    padding: 10px;
    border-radius: 5px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
  }

  .character-card:hover, .customize-button:hover, #create-video:hover, #start-interaction:hover, #generate-qr:hover {
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
`;
document.head.appendChild(styles);
