// preload.js
const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  // Css
  const style1 = document.createElement('style')
  style1.innerHTML = `body{margin-top: 30px !important;}#nav-body-ctrls,#nav-body-tabs{font-family:Lucida Grande,Arial,sans-serif}.nav-icons,.nav-icons-small{fill:#f1f3f4!important;transition:.3s;height:16px!important}#window-controls .button,body,html{width:100%;height:100%;display:flex}#window-controls{display:grid;grid-template-columns:repeat(3,46px);position:fixed;top:0;right:0;-webkit-app-region:no-drag;height:30px;line-height:30px}#window-controls .button{grid-row:1/span 1;justify-content:center;align-items:center;user-select:none}#min-button{grid-column:1}#max-button,#restore-button{grid-column:2}#close-button{grid-column:3}#window-controls .button:hover{background:rgba(255,255,255,.1)}#window-controls .button:active{background:rgba(255,255,255,.2)}#close-button:hover{background:#e81123!important}#close-button:active{background:#f1707a!important}#close-button:active .icon{filter:invert(1)}#restore-button{display:none!important}@media (-webkit-device-pixel-ratio:1.5),(device-pixel-ratio:1.5),(-webkit-device-pixel-ratio:2),(device-pixel-ratio:2),(-webkit-device-pixel-ratio:3),(device-pixel-ratio:3){#window-controls .icon{width:10px;height:10px}}.maximized #restore-button{display:flex!important}.maximized #max-button{display:none}#nav-body-ctrls{-webkit-app-region:no-drag;background-color:#35363a;padding:3px;border-bottom:1px solid #282828}#nav-body-tabs{-webkit-app-region:drag;-webkit-user-select:none;background:#202124;height:30px;font-size:12px;overflow:hidden!important;min-height:30px;display:flex;flex-direction:row;max-width:calc(100vw - 154px);padding-left:1rem;padding-top:0}#nav-tabs-add,.nav-tabs-close,.nav-tabs-tab{-webkit-app-region:no-drag}#nav-body-views{flex:1}.nav-icons{width:16px!important}.nav-icons-small:hover,.nav-icons:hover{fill:#f1f3f4!important;background-color:#454648}.nav-icons-small{width:22px!important}#nav-ctrls-back,#nav-ctrls-forward,#nav-ctrls-reload{height:20px;width:20px;padding:5px;margin-right:10px;border-radius:20px}#nav-ctrls-url{border:0;border-radius:50px;height:28px!important;margin-left:8px;font-size:11pt;outline:0;padding-left:18px;color:#fcfcfc;background-color:#202124;width:calc(100% - 180px);max-width:calc(100% - 180px)}#nav-ctrls-url:focus{box-shadow:0 0 2px 3px #285c82}#nav-tabs-add{margin:5px;fill:#0e8cd0!important}#nav-tabs-add:hover{fill:#0ba0f1!important}.nav-tabs-tab{border-radius:6px 6px 0 0;height:30px;display:flex;flex:1;max-width:200px}.nav-tabs-tab.active,.nav-tabs-tab.active:hover{background:#35363a}.nav-tabs-tab:hover{background:#292a2d}.nav-tabs-favicon{margin:6px}.nav-tabs-title{padding-left:5px;font-style:normal;color:#f1f3f4}.nav-tabs-close{width:15px!important;height:15px!important;margin:6px 6px 6px 2px;border-radius:10px}.nav-tabs-close:hover{fill:#dc143c!important}.vl{border-left:1px solid #505155;height:22px}body,html{margin:0;padding:0;flex-direction:column}#wrapper{display:flex;flex-direction:column;flex:1}#nav-body-view-wrapper{display:flex;flex:1}::-webkit-scrollbar{display:none;width:20px}*{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;line-height:1.5;box-sizing:border-box;color:#44585d}body{background:linear-gradient(45deg,#2c0071,#520098) !important;overflow:hidden}::-webkit-scrollbar-track{background-color:transparent}::-webkit-scrollbar-thumb{background-color:#d6dee1;border-radius:20px;border:6px solid transparent;background-clip:content-box}::-webkit-scrollbar-thumb:hover{background-color:#a8bbbf}.buttons-controls{position:fixed;display:none;right:2rem;flex-direction:column;bottom:3%}.buttons-controls>img{width:42px;border-radius:130px}.buttons-controls>img:hover{cursor:pointer}`
  document.body.appendChild(style1);

  const customTitleBar = document.createElement('div');
  customTitleBar.className = 'custom-title-bar';
  customTitleBar.style = 'margin-left: auto; z-index: 1; width: 100%; justify-content: right; background: linear-gradient(45deg,#2c0071,#520098) !important;'
  customTitleBar.id = 'window-controls'
  document.body.prepend(customTitleBar);

  // Adicione os botões de fechar, minimizar e expandir
  customTitleBar.innerHTML = `
  <div class="button" id="min-button">
    <img class="icon"
      srcset="https://i.ibb.co/Wg0rYmf/min-k-10.png 1x, https://i.ibb.co/RDNhj2p/min-k-12.png 1.25x, https://i.ibb.co/D53WRRd/min-k-15.png 1.5x, https://i.ibb.co/D53WRRd/min-k-15.png 1.75x, https://i.ibb.co/gTLJJKz/min-k-20.png 2x, https://i.ibb.co/gTLJJKz/min-k-20.png 2.25x, https://i.ibb.co/qNSSKjv/min-k-24.png 2.5x, https://i.ibb.co/6YB01nj/min-k-30.png 3x, https://i.ibb.co/6YB01nj/min-k-30.png 3.5x"
      draggable="false" />
  </div>
  <div class="button" id="max-button">
    <img class="icon"
      srcset="https://i.ibb.co/pd7gBm0/max-k-10.png 1x, https://i.ibb.co/QmDZYsp/max-k-12.png 1.25x, https://i.ibb.co/bN8Sx5r/max-k-15.png 1.5x, https://i.ibb.co/bN8Sx5r/max-k-15.png 1.75x, https://i.ibb.co/Ms8gP3k/max-k-20.png 2x, https://i.ibb.co/Ms8gP3k/max-k-20.png 2.25x, https://i.ibb.co/jz2nPb7/max-k-24.png, https://i.ibb.co/jMsbg6T/max-k-30.png 3x, https://i.ibb.co/jMsbg6T/max-k-30.png 3.5x"
      draggable="false" />
  </div>
  <div class="button" id="restore-button">
    <img class="icon"
      srcset="../assets/app/icons/restore-w-10.png 1x, ../assets/app/icons/restore-w-12.png 1.25x, ../assets/app/icons/restore-w-15.png 1.5x, ../assets/app/icons/restore-w-15.png 1.75x, ../assets/app/icons/restore-w-20.png 2x, ../assets/app/icons/restore-w-20.png 2.25x, ../assets/app/icons/restore-w-24.png 2.5x, ../assets/app/icons/restore-w-30.png 3x, ../assets/app/icons/restore-w-30.png 3.5x"
      draggable="false" />
  </div>
  <div class="button" id="close-button">
    <img class="icon"
      srcset="https://i.ibb.co/3MyN62g/close-k-10.png 1x, https://i.ibb.co/bg54mz3/close-k-12.png 1.25x, https://i.ibb.co/djZ9XNW/close-k-15.png 1.5x, https://i.ibb.co/djZ9XNW/close-k-15.png 1.75x, https://i.ibb.co/qk5hnWY/close-k-20.png 2x, https://i.ibb.co/qk5hnWY/close-k-20.png 2.25x, https://i.ibb.co/YLmJHt2/close-k-24.png 2.5x, https://i.ibb.co/stMZB6q/close-k-30.png 3x, https://i.ibb.co/stMZB6q/close-k-30.png 3.5x"
      draggable="false" />
  </div>`;



  // Defina eventos para os botões
  const closeButton = document.getElementById('close-button');
  closeButton.addEventListener('click', () => {
    ipcRenderer.send('close-window');
  });

  const minimizeButton = document.getElementById('min-button');
  minimizeButton.addEventListener('click', () => {
    ipcRenderer.send('minimize-window');
  });

  const expandButton = document.getElementById('max-button');
  expandButton.addEventListener('click', () => {
    ipcRenderer.send('maximize-window');
  });

  //document.body.addEventListener('click', (event) => {
  //  if (event.target.tagName === 'A' && event.target.getAttribute('href')) {
  //    const target = event.target.getAttribute('target');
  //    if (target === '_blank') {
  //      alert("é branci")
  //      // Se o link tiver target="_blank", abra em uma nova janela
  //      event.preventDefault();
  //      const url = event.target.getAttribute('href');
  //
  //      createCustomWindow(url);
  //      // Você pode adicionar mais lógica aqui, se necessário
  //
  //    }
  //  }
  //});

  let isDragging = false;
  let initialX, initialY;

  customTitleBar.addEventListener('mousedown', (e) => {
    isDragging = true;

    initialX = e.clientX;
    initialY = e.clientY;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {

      const deltaX = e.clientX - initialX;
      const deltaY = e.clientY - initialY;

      ipcRenderer.send('move-window', deltaX, deltaY);
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

});

contextBridge.exposeInMainWorld('electron', {
  moveWindow: () => ipcRenderer.send('move-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
});

