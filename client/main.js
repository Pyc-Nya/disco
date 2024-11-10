const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const startUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'build', 'index.html')}`;

  mainWindow.loadURL(startUrl);

  if (process.env.NODE_ENV === 'development') {
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.setMenu(null);
  }
});

// Обработчик записи в файл
ipcMain.on('save-count', (event, count) => {
  const filePath = path.join(app.getPath('userData'), 'button-count.txt');
  fs.writeFile(filePath, `${count}`, (err) => {
    if (err) {
      console.error('Failed to write to file:', err);
    } else {
      console.log(`Count saved to ${filePath}`);
    }
  });
});

// Обработчик чтения из файла
ipcMain.handle('read-count', async () => {
  const filePath = path.join(app.getPath('userData'), 'button-count.txt');
  try {
    const data = fs.readFileSync(filePath, 'utf-8'); // Чтение файла
    return data; // Отправляем данные в рендерер
  } catch (err) {
    console.error('Failed to read from file:', err);
    return null; // Возвращаем null в случае ошибки
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
