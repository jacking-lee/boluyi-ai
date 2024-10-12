// animeVirtualCharacter.js

// 点击按钮以显示弹窗
const button = document.createElement('button');
button.textContent = '点击我弹出窗口';
button.style.margin = '20px';
button.style.padding = '10px';
button.style.borderRadius = '5px';
button.style.backgroundColor = '#007bff';
button.style.color = '#fff';
button.style.border = 'none';
button.style.cursor = 'pointer';

document.body.appendChild(button);

button.addEventListener('click', () => {
  const dialog = document.createElement('div');
  dialog.classList.add('dialog');
  dialog.setAttribute('tabindex', '0'); // 使弹窗可通过键盘访问
  dialog.innerHTML = `
    <h3>这是一个弹窗</h3>
    <p>点击按钮后弹出的示例窗口。</p>
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
});

// 样式部分
const styles = document.createElement('style');
styles.textContent = `
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
