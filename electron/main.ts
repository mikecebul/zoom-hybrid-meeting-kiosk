import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import open from "open";
import axios from "axios";
import fs from "fs";
import "./server"

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

interface IZoomToken {
  access_token: string;
}

ipcMain.on("start-zoom-meeting", async () => {
  const token = await getZoomToken();
  if (token) {
    await startZoomMeeting(token);
  }
});

async function getZoomToken<T extends IZoomToken>(): Promise<T | undefined> {
  const accountId = import.meta.env.VITE_S2S_ACCOUNT_ID;
  const clientId = import.meta.env.VITE_S2S_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_S2S_CLIENT_SECRET;

  const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );
  const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`;

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Host: "zoom.us",
          Authorization: `Basic ${base64Credentials}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(`Failed to fetch, status: ${response.status}`);
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    fs.writeFileSync(
      "/home/mike/Documents/error-logs/start-meeting-error-log.txt",
      `Axios Error during getZoomToken: ${error}\n`
    );
    return undefined;
  }
}

async function startZoomMeeting<T extends IZoomToken>(token: T) {
  const meetingId = import.meta.env.VITE_MEETING_ID;
  const bearerToken = token.access_token;

  const url = `https://api.zoom.us/v2/meetings/${meetingId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    if (response.status === 200) {
      const startUrl = response.data["start_url"];
      console.log("Start Url:", startUrl);
      open(startUrl);
    }
  } catch (error) {
    console.error("Error starting the meeting:", error);
    fs.writeFileSync(
      "/home/mike/Documents/error-logs/start-meeting-error-log.txt",
      `Caught exception in startZoomMeeting: ${error}\n`
    );
  }
}

app.whenReady().then(createWindow);
