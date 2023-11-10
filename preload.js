// preload.js
const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  // Css
  const style1 = document.createElement('style')
  style1.innerHTML = `body{margin-top: 30px !important;}#nav-body-ctrls,#nav-body-tabs{font-family:Lucida Grande,Arial,sans-serif}.nav-icons,.nav-icons-small{fill:#f1f3f4!important;transition:.3s;height:16px!important}#window-controls .button,body,html{width:100%;height:100%;display:flex}#window-controls{display:grid;grid-template-columns:repeat(3,46px);position:fixed;top:0;right:0;-webkit-app-region:no-drag;height:30px;line-height:30px}#window-controls .button{grid-row:1/span 1;justify-content:center;align-items:center;user-select:none}#min-button{grid-column:1}#max-button,#restore-button{grid-column:2}#close-button{grid-column:3}#window-controls .button:hover{background:rgba(255,255,255,.1)}#window-controls .button:active{background:rgba(255,255,255,.2)}#close-button:hover{background:#e81123!important}#close-button:active{background:#f1707a!important}#close-button:active .icon{filter:invert(1)}#restore-button{display:none!important}@media (-webkit-device-pixel-ratio:1.5),(device-pixel-ratio:1.5),(-webkit-device-pixel-ratio:2),(device-pixel-ratio:2),(-webkit-device-pixel-ratio:3),(device-pixel-ratio:3){#window-controls .icon{width:10px;height:10px}}.maximized #restore-button{display:flex!important}.maximized #max-button{display:none}#nav-body-ctrls{-webkit-app-region:no-drag;background-color:#35363a;padding:3px;border-bottom:1px solid #282828}#nav-body-tabs{-webkit-app-region:drag;-webkit-user-select:none;background:#202124;height:30px;font-size:12px;overflow:hidden!important;min-height:30px;display:flex;flex-direction:row;max-width:calc(100vw - 154px);padding-left:1rem;padding-top:0}#nav-tabs-add,.nav-tabs-close,.nav-tabs-tab{-webkit-app-region:no-drag}#nav-body-views{flex:1}.nav-icons{width:16px!important}.nav-icons-small:hover,.nav-icons:hover{fill:#f1f3f4!important;background-color:#454648}.nav-icons-small{width:22px!important}#nav-ctrls-back,#nav-ctrls-forward,#nav-ctrls-reload{height:20px;width:20px;padding:5px;margin-right:10px;border-radius:20px}#nav-ctrls-url{border:0;border-radius:50px;height:28px!important;margin-left:8px;font-size:11pt;outline:0;padding-left:18px;color:#fcfcfc;background-color:#202124;width:calc(100% - 180px);max-width:calc(100% - 180px)}#nav-ctrls-url:focus{box-shadow:0 0 2px 3px #285c82}#nav-tabs-add{margin:5px;fill:#0e8cd0!important}#nav-tabs-add:hover{fill:#0ba0f1!important}.nav-tabs-tab{border-radius:6px 6px 0 0;height:30px;display:flex;flex:1;max-width:200px}.nav-tabs-tab.active,.nav-tabs-tab.active:hover{background:#35363a}.nav-tabs-tab:hover{background:#292a2d}.nav-tabs-favicon{margin:6px}.nav-tabs-title{padding-left:5px;font-style:normal;color:#f1f3f4}.nav-tabs-close{width:15px!important;height:15px!important;margin:6px 6px 6px 2px;border-radius:10px}.nav-tabs-close:hover{fill:#dc143c!important}.vl{border-left:1px solid #505155;height:22px}body,html{margin:0;padding:0;flex-direction:column}#wrapper{display:flex;flex-direction:column;flex:1}#nav-body-view-wrapper{display:flex;flex:1}::-webkit-scrollbar{display:none;width:20px}*{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;line-height:1.5;box-sizing:border-box;color:#44585d}body{background:linear-gradient(45deg,#2c0071,#520098) !important;overflow:hidden}::-webkit-scrollbar-track{background-color:transparent}::-webkit-scrollbar-thumb{background-color:#d6dee1;border-radius:20px;border:6px solid transparent;background-clip:content-box}::-webkit-scrollbar-thumb:hover{background-color:#a8bbbf}.buttons-controls{position:fixed;display:none;right:2rem;flex-direction:column;bottom:3%}.buttons-controls>img{width:42px;border-radius:130px}.buttons-controls>img:hover{cursor:pointer}`
  document.body.appendChild(style1);

  const style2 = document.createElement('style')
  style2.innerHTML = `@media screen and (max-width:700px){body{padding:170px 0 0;width:100%}}.menu-item,.menu-open-button{  margin-left: 0px;background:#eee;border-radius:100%;width:35px;height:35px;margin-left:-40px;position:absolute;color:#fff;text-align:center;line-height:40px;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);-webkit-transition:-webkit-transform ease-out .2s;transition:-webkit-transform ease-out .2s;transition:transform ease-out .2s;transition:transform ease-out .2s,-webkit-transform ease-out .2s}.menu-open{display:none}.lines{width:25px;height:3px;background:#596778;display:block;position:absolute;top:50%;left:50%;margin-left:-12.5px;margin-top:-1.5px;-webkit-transition:-webkit-transform .2s;transition:-webkit-transform .2s;transition:transform .2s;transition:transform .2s,-webkit-transform .2s}.line-1{-webkit-transform:translate3d(0,-8px,0);transform:translate3d(0,-8px,0)}.line-2{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.line-3{-webkit-transform:translate3d(0,8px,0);transform:translate3d(0,8px,0)}
  .menu-open:checked+.menu-open-button .line-1{-webkit-transform:translate3d(0,0,0) rotate(45deg);transform:translate3d(0,0,0) rotate(45deg)}.menu-open:checked+.menu-open-button .line-2{-webkit-transform:translate3d(0,0,0) scale(.1,1);transform:translate3d(0,0,0) scale(.1,1)}.menu-open:checked+.menu-open-button .line-3{-webkit-transform:translate3d(0,0,0) rotate(-45deg);transform:translate3d(0,0,0) rotate(-45deg)}.menu{margin:auto;position:absolute;top:0;bottom:0;left:0;right:0;width:40px;height:40px;text-align:center;box-sizing:border-box;font-size:26px}.menu-item:hover{background:#eee;color:#3290b1}.menu-item:nth-child(3){-webkit-transition-duration:.18s;transition-duration:.18s}.menu-item:nth-child(4){-webkit-transition-duration:.18s;transition-duration:.18s}.menu-item:nth-child(5){-webkit-transition-duration:.18s;transition-duration:.18s}.menu-item:nth-child(6){-webkit-transition-duration:.18s;transition-duration:.18s}.menu-item:nth-child(7){-webkit-transition-duration:.18s;transition-duration:.18s}
  .menu-item:nth-child(8){-webkit-transition-duration:.18s;transition-duration:.18s}.menu-item:nth-child(9){-webkit-transition-duration:.18s;transition-duration:.18s}.menu-open-button{z-index:2;-webkit-transition-timing-function:cubic-bezier(.175,.885,.32,1.275);transition-timing-function:cubic-bezier(.175,.885,.32,1.275);-webkit-transition-duration:.4s;transition-duration:.4s;-webkit-transform:scale(1.1,1.1) translate3d(0,0,0);transform:scale(1.1,1.1) translate3d(0,0,0);cursor:pointer;box-shadow:3px 3px 0 0 rgba(0,0,0,.14)}.menu-open-button:hover{-webkit-transform:scale(1.2,1.2) translate3d(0,0,0);transform:scale(1.2,1.2) translate3d(0,0,0)}.menu-open:checked+.menu-open-button{-webkit-transition-timing-function:linear;transition-timing-function:linear;-webkit-transition-duration:.2s;transition-duration:.2s;-webkit-transform:scale(.8,.8) translate3d(0,0,0);transform:scale(.8,.8) translate3d(0,0,0)}.menu-open:checked~.menu-item{-webkit-transition-timing-function:cubic-bezier(.935,0,.34,1.33);transition-timing-function:cubic-bezier(.935,0,.34,1.33)}
  .menu-open:checked~.menu-item:nth-child(3){transition-duration:.18s;-webkit-transition-duration:.18s;-webkit-transform:translate3d(.08361px,-104.99997px,0);transform:translate3d(.08361px,-104.99997px,0)}.menu-open:checked~.menu-item:nth-child(4){transition-duration:.28s;-webkit-transition-duration:.28s;-webkit-transform:translate3d(90.9466px,-52.47586px,0);transform:translate3d(90.9466px,-52.47586px,0)}.menu-open:checked~.menu-item:nth-child(5){transition-duration:.38s;-webkit-transition-duration:.38s;-webkit-transform:translate3d(33.9466px,15.47586px,0);transform:translate3d(33.9466px,15.47586px,0)}.menu-open:checked~.menu-item:nth-child(6){transition-duration:.48s;-webkit-transition-duration:.48s;-webkit-transform:translate3d(0.08361px,30.99997px,0);transform:translate3d(0.08361px,30.99997px,0)}.menu-open:checked~.menu-item:nth-child(7){transition-duration:.58s;-webkit-transition-duration:.58s;-webkit-transform:translate3d(-31.86291px,15.62064px,0);transform:translate3d(-31.86291px,15.62064px,0)}
  .menu-open:checked~.menu-item:nth-child(8){transition-duration:.68s;-webkit-transition-duration:.68s;-webkit-transform:translate3d(-91.03006px,-52.33095px,0);transform:translate3d(-91.03006px,-52.33095px,0)}.menu-open:checked~.menu-item:nth-child(9){transition-duration:.78s;-webkit-transition-duration:.78s;-webkit-transform:translate3d(-.25084px,-104.9997px,0);transform:translate3d(-.25084px,-104.9997px,0)}.blue{background-color:#669ae1;box-shadow:3px 3px 0 0 rgba(0,0,0,.14);text-shadow:1px 1px 0 rgba(0,0,0,.12)}.blue:hover{color:#669ae1;text-shadow:none}.green{background-color:#70cc72;box-shadow:3px 3px 0 0 rgba(0,0,0,.14);text-shadow:1px 1px 0 rgba(0,0,0,.12)}.green:hover{color:#70cc72;text-shadow:none}.red{background-color:#fe4365;box-shadow:3px 3px 0 0 rgba(0,0,0,.14);text-shadow:1px 1px 0 rgba(0,0,0,.12)}.red:hover{color:#fe4365;text-shadow:none}.purple{background-color:#c49cde;box-shadow:3px 3px 0 0 rgba(0,0,0,.14);text-shadow:1px 1px 0 rgba(0,0,0,.12)}.purple:hover{color:#c49cde;text-shadow:none}
  .orange{background-color:#fc913a;box-shadow:3px 3px 0 0 rgba(0,0,0,.14);text-shadow:1px 1px 0 rgba(0,0,0,.12)}.orange:hover{color:#fc913a;text-shadow:none}.lightblue{background-color:#62c2e4;box-shadow:3px 3px 0 0 rgba(0,0,0,.14);text-shadow:1px 1px 0 rgba(0,0,0,.12)}.lightblue:hover{color:#62c2e4;text-shadow:none}.credit{margin:24px 20px 120px 0;text-align:right;color:#eee}.credit a{padding:8px 0;color:#c49cde;text-decoration:none;transition:all .3s ease 0s}.credit a:hover{text-decoration:underline}`
  document.body.appendChild(style2);

  const customTitleBar = document.createElement('div');
  customTitleBar.className = 'custom-title-bar';
  customTitleBar.style = 'margin-left: auto; z-index: 1; width: 100%; justify-content: right; background: linear-gradient(45deg,#2c0071,#520098) !important;'
  customTitleBar.id = 'window-controls'
  document.body.prepend(customTitleBar);

  // Adicione os botões de fechar, minimizar e expandir
  customTitleBar.innerHTML = `
  <nav class="menu" style="margin-top: 10px;width: 40px;height: 40px;">
<input type="checkbox" href="#" class="menu-open" name="menu-open" id="menu-open">
<label class="menu-open-button" for="menu-open" style="background: black;line-height: 0;">
 <img src="https://www.pngall.com/wp-content/uploads/4/Gear-PNG-Free-Download.png" style="width: 25px;height: auto;margin-top: 5px;filter: invert(1);">
</label>

<a href="#" class="menu-item blue" style="display: none;"> <i class="fa fa-anchor"></i> </a>
<a href="#" class="menu-item green" style="display: none;"> <i class="fa fa-coffee"></i> </a>

<a href="https://github.com/eduhcastro/flutterflow-windows" target="__blank" class="menu-item red" style="background: black;"> <img src="https://logos-world.net/wp-content/uploads/2020/11/GitHub-Symbol.png" style="width: 45px;filter: invert(1);color: white;margin-bottom: 0px;margin-left: -4px;height: auto;"> </a>

<a href="#" id="refresh-button" class="menu-item purple" style="background: black;"> <img src="https://www.pngarts.com/files/2/Refresh-Transparent-Background-PNG.png" style="width: 20px;filter: invert(86);color: white;margin-bottom: 5px;"> </a>

<a href="#" id="cleancache-button" class="menu-item orange" placeholder="teste" style="background: black;"> <img src="https://th.bing.com/th/id/R.1a43cce6173c2f2bd108d8c39f8cbf1e?rik=TXHp1dhFUzyCNg&amp;riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_142569.png&amp;ehk=fZQ7OmjDmyikNES%2btzCH%2b6lxutSwTmQ%2fRcSg8VjRY68%3d&amp;risl=&amp;pid=ImgRaw&amp;r=0" style="width: 27px;filter: invert(86);color: white;">
</a>

<a href="#" class="menu-item lightblue" style="display: none;"> <i class="fa fa-diamond"></i> </a>
</nav>
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

  const refreshButton = document.getElementById('refresh-button');
  refreshButton.addEventListener('click', (e) => {
    e.preventDefault();
    ipcRenderer.send('refresh-window');
  });

  const cleanCacheButton = document.getElementById('cleancache-button');
  cleanCacheButton.addEventListener('click', (e) => {
    e.preventDefault()
    const userConfirmed = window.confirm('Are you sure you want to clear all data?');

    if (userConfirmed) {
      alert("It may take a few minutes for the cleaning to be complete.")
      ipcRenderer.send('cleancache-all');
    }
  });

  //const githubButton = document.getElementById('github-button');
  //githubButton.addEventListener('click', (e) => {
  //  e.preventDefault();
  //
  //  let textoCopiado = document.getElementById("texto");
  //  textoCopiado.select();
  //  textoCopiado.setSelectionRange(0, 99999)
  //  document.execCommand("copy");
  //
  //});


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
  refreshWindow: () => ipcRenderer.send('refresh-window'),
  cleanCacheAll: () => ipcRenderer.send('cleancache-all')
});

