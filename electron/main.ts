import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "node:path";
import "./server";
import { killApplications } from "./utils/kill-applications";
import { startZoomMeeting } from "./components/meeting-room/startZoomMeeting";
import { startBODZoomMeeting } from "./components/BOD-room/startBODZoomMeeting";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
let activeMeeting = false;
let activeBODMeeting = false;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "icon.icns"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
  win.setFullScreen(true);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.whenReady().then(() => {
  createWindow();

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
      win = null;
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  ipcMain.handle("start-zoom-meeting", async () => {
    if (win) {
      const result = await startZoomMeeting(win);
      activeMeeting = result.activeMeeting;
      return result;
    }
  });

  ipcMain.handle("start-bod-zoom-meeting", async () => {
    if (win) {
      const result = await startBODZoomMeeting(win);
      activeBODMeeting = result.activeBODMeeting;
      return result;
    }
  });

  ipcMain.on("meeting-ended", () => {
  
    if (win && activeMeeting) {
      activeMeeting = false;
      win.restore();
      win.show();
      win.setFullScreen(true);
  
      killApplications(["Google Chrome", "zoom.us", "Safari"]);
    } else {
      console.log("No active meeting or window not initialized");
    }
  });

  ipcMain.on("bod-meeting-ended", () => {
    if (win && activeBODMeeting) {
      activeBODMeeting = false;
      win.restore();
      win.show();
      win.setFullScreen(true);
      killApplications(["Google Chrome", "zoom.us", "Safari"]);
    }
  });
  ipcMain.handle("open-na-readings", () => {
    const naReadingsURL = 'https://drive.google.com/file/d/1ufMklUrLiIZso3kLuP2mn_6zt8FE8RrF/view?usp=sharing'
    const naJFTURL = 'https://www.jftna.org/jft/'
    try {
      shell.openExternal(naJFTURL)
      shell.openExternal(naReadingsURL)
      return
  } catch {
    return false
  }
  })
});
