const { contextBridge, ipcRenderer } = require('electron');

// 安全桥接：渲染进程只能调用这里暴露的方法
contextBridge.exposeInMainWorld('xiaorAPI', {
  verifyPhone:    (phone) => ipcRenderer.invoke('verify-phone', phone),
  openTaobao:     (user)  => ipcRenderer.invoke('open-taobao', user),
  getCurrentUser: ()      => ipcRenderer.invoke('get-current-user'),
  onUserInfo:     (cb)    => ipcRenderer.on('user-info', (e, user) => cb(user)),
});
