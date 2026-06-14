const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('xiaorAPI', {
  verifyPhone:      (phone)   => ipcRenderer.invoke('verify-phone', phone),
  openTaobao:       (user)    => ipcRenderer.invoke('open-taobao', user),
  getCurrentUser:   ()        => ipcRenderer.invoke('get-current-user'),
  onUserInfo:       (cb)      => ipcRenderer.on('user-info', (e, user) => cb(user)),
  // ⭐ 主进程发起HTTP请求，绕过CORS限制
  createScanLogin:  ()        => ipcRenderer.invoke('create-scan-login'),
  pollScanLogin:    (sid)     => ipcRenderer.invoke('poll-scan-login', sid),
});
