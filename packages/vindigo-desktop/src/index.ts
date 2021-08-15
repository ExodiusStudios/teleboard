import { join } from 'path';
import { app, BrowserWindow } from 'electron';

// TODO Implement an initial window in which you connect to a vindigo installation
// with localhost being one of the options.

function createWindow() {
	const window = new BrowserWindow({
		autoHideMenuBar: true,
		width: 1400,
		height: 800,
		show: false,
		icon: join(__dirname, '../resources/favicon.ico')
	});

	window.loadURL('http://localhost:8085');

	window.once('ready-to-show', () => {
		window.show();
		window.focus();
	});
}

app.whenReady().then(() => {
	createWindow();
});
