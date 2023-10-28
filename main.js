const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Flag to track if it's the first window load
let firstLoad = true;
let mainWindow;

// Function to create and configure the main window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false, // Remove window frame
    show: true,
    backgroundColor: '#202124',
    webPreferences: {
      nodeIntegration: true, // Allow Node.js integration
      webviewTag: true,
      plugins: true,
      additionalArguments: ['filePath'],
      preload: path.join(__dirname, 'preload.js'), // Path to preload script
    }
  });

  mainWindow.loadURL('https://app.flutterflow.io/');
}

// Event handler for when Electron is ready
app.on("ready", () => {
  createMainWindow();
});

// Event handler for when a new browser window is created
app.on("browser-window-created", function (event, window) {
  // Configure new windows
  if (!firstLoad) {
    window.setMenu(null); // Remove the menu
    window.removeMenu();
    window.setMenuBarVisibility(false);
    window.menuBarVisible = false;
    window.autoHideMenuBar = true;
    window.flashFrame(false);

    window.webContents.on('dom-ready', () => {
      // Handle new windows, such as setting custom headers
      // You might want to set the preload for all new windows here.
    });
  }
  firstLoad = false;
});

// Event handlers for window control
ipcMain.on('move-window', (event, deltaX, deltaY) => {
  const currentWindow = BrowserWindow.getFocusedWindow();
  if (currentWindow) {
    const { x, y } = currentWindow.getBounds();
    const newX = x + deltaX;
    const newY = y + deltaY;
    currentWindow.setPosition(newX, newY);
  }
});

ipcMain.on('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});


ipcMain.on('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('maximize-window', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});
