const { app, BrowserWindow, BrowserView, ipcMain, session } = require('electron');
const path = require('path');

const API_BASE = 'https://api.rcnh-global.org';
const TAOBAO_URL = 'https://m.taobao.com';  // 手机版，支持代付功能

let mainWindow = null;
let currentUser = null;  // { phone, name }

// ==================== 创建登录窗口 ====================
function createLoginWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    resizable: false,
    autoHideMenuBar: true,
    title: 'XiaoR-Shopping',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });
  mainWindow.loadFile('login.html');
  mainWindow.setMenuBarVisibility(false);
}

// ==================== 创建主窗口（嵌入淘宝）====================
function createMainWindow(user) {
  currentUser = user;

  // 关闭登录窗口，打开主窗口
  if (mainWindow) mainWindow.close();

  mainWindow = new BrowserWindow({
    width: 440,
    height: 820,
    title: `XiaoR-Shopping - ${user.name || user.phone}`,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('app.html');

  // 窗口加载完后告知用户信息
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('user-info', user);
  });
}

// ==================== IPC: 扫码登录（主进程发HTTP，绕过CORS）====================
ipcMain.handle('create-scan-login', async () => {
  try {
    const r = await fetch(`${API_BASE}/api/v1/taobao/scan-login/create`, { method: 'POST' });
    return await r.json();
  } catch(e) { return { success: false, message: e.message }; }
});

ipcMain.handle('poll-scan-login', async (event, sessionId) => {
  try {
    const r = await fetch(`${API_BASE}/api/v1/taobao/scan-login/status?session_id=${sessionId}`);
    return await r.json();
  } catch(e) { return { status: 'error', message: e.message }; }
});

// ==================== IPC: 登录验证 ====================
ipcMain.handle('verify-phone', async (event, phone) => {
  try {
    const resp = await fetch(
      `${API_BASE}/api/v1/shopping/pickup/magic-link/check-phone?phone=${encodeURIComponent(phone)}`
    );
    const d = await resp.json();
    return d;
  } catch(e) {
    return { success: false, message: '网络错误，请检查连接' };
  }
});

// ==================== IPC: 打开淘宝 ====================
ipcMain.handle('open-taobao', async (event, user) => {
  createMainWindow(user);
  return { success: true };
});

// ==================== IPC: 获取当前用户 ====================
ipcMain.handle('get-current-user', () => currentUser);

// ==================== 启动 ====================
app.whenReady().then(() => {
  createLoginWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
