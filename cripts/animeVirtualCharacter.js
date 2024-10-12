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
    showCharacterCustomization(characterName);
  });
});

// 显示角色定制界面
const showCharacterCustomization = (characterName) => {
  const customizationDialog = document.createElement('div');
  customizationDialog.classList.add('dialog');
  customizationDialog.setAttribute('tabindex', '0');
  customizationDialog.innerHTML = `
    <h3>定制角色: ${characterName}</h3>
    <label for="character-voice">声音风格:</label>
    <select id="character-voice">
      <option value="温柔">温柔</option>
      <option value="严肃">严肃</option>
      <option value="活泼">活泼</option>
    </select>
    <br>
    <label for="character-outfit">服装风格:</label>
    <select id="character-outfit">
      <option value="现代">现代</option>
      <option value="古典">古典</option>
      <option value="运动">运动</option>
    </select>
    <br>
    <button id="save-customization">保存定制</button>
    <button id="close-customization-dialog">关闭</button>
  `;
  document.body.appendChild(customizationDialog);
  customizationDialog.focus();

  document.getElementById('close-customization-dialog').addEventListener('click', () => {
    document.body.removeChild(customizationDialog);
  });

  document.getElementById('save-customization').addEventListener('click', () => {
    const voice = document.getElementById('character-voice').value;
    const outfit = document.getElementById('character-outfit').value;
    console.log(`保存定制: 角色名称: ${characterName}, 声音风格: ${voice}, 服装风格: ${outfit}`);
    document.body.removeChild(customizationDialog);
  });

  // 按下 Esc 键时关闭弹窗
  customizationDialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.body.removeChild(customizationDialog);
    }
  });
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

  .page {
    display: none;
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
document.getElementById('character-selection').style.display = 'block';
