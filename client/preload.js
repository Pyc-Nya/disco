const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Отправка данных
  send: (channel, data) => {
    const validChannels = ['save-count']; // Указываем разрешённые каналы для отправки
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  // Асинхронное выполнение с использованием invoke
  invoke: (channel, data) => {
    const validInvokeChannels = ['read-count']; // Указываем разрешённые каналы для invoke
    if (validInvokeChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
    return Promise.reject(`Channel "${channel}" is not allowed.`);
  },
});
