import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import "./server";
import { killApplications } from "./utils/kill-applications";
import { getMeetingZoomToken } from "./utils/meeting-room/get-meeting-zoom-token";
import { startMeetingZoomMeeting } from "./utils/meeting-room/get-meeting-zoom-meeting";
import { getBODZoomToken } from "./utils/BOD-room/get-bod-zoom-token";
import { startBODZoomMeeting } from "./utils/BOD-room/get-bod-zoom-meeting";

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

type ActiveMeeting = "meeting" | "bod" | "none" | "both";

let activeMeeting: ActiveMeeting = "none";

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
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

ipcMain.on("start-zoom-meeting", async () => {
  if (activeMeeting === "none") activeMeeting = "meeting";
  if (activeMeeting === "bod") activeMeeting = "both";

  killApplications(["Google Chrome", "zoom.us"]);

  const token = await getMeetingZoomToken();
  if (token) {
    await startMeetingZoomMeeting(token);
    win?.minimize();
  }
});

ipcMain.on("meeting-ended", () => {
  if (activeMeeting === "meeting") {
    activeMeeting = "none";

    if (win) {
      win.restore();
      win.show();
      win.setFullScreen(true);
    }
    killApplications(["Google Chrome", "zoom.us"]);
  }
  if (activeMeeting === "both") activeMeeting = "bod";
});

// BOD Zoom Meeting Logic
ipcMain.on("start-bod-zoom-meeting", async () => {
  if (activeMeeting === "none") activeMeeting = "bod";
  if (activeMeeting === "meeting") activeMeeting = "both";

  killApplications(["Google Chrome", "zoom.us"]);

  const token = await getBODZoomToken();
  if (token) {
    await startBODZoomMeeting(token);
    win?.minimize();
  }
});

ipcMain.on("bod-meeting-ended", () => {
  if (activeMeeting === "meeting") {
    activeMeeting = "none";
    if (win) {
      win.restore();
      win.show();
      win.setFullScreen(true);
    }
    killApplications(["Google Chrome", "zoom.us"]);
  }  
  if (activeMeeting === "both") activeMeeting = "meeting";
});

app.whenReady().then(createWindow);
