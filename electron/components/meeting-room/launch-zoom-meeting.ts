import axios from "axios";
import fs from "fs";
import type { IZoomToken } from "../../utils/types";
//import { shell } from "electron";
import { exec } from "child_process";
// import open from "open";

export async function launchZoomMeeting<T extends IZoomToken>(token: T) {
  const meetingId = import.meta.env.VITE_MEETING_MEETING_ID;
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
      // console.log("Start Url:", startUrl);
      // open(startUrl);
      // shell.openExternal(startUrl, { activate: false, })
      openUrlInSafari(startUrl)
    }
    return true;
  } catch (error) {
    console.error("Error starting the meeting:", error);

    if (process.platform === "darwin") {
      fs.writeFileSync(
        "/Users/Shared/error-logs/start-meeting-error-log.txt",
        `Caught exception in startZoomMeeting: ${error}\n`
      );
    }
    return false;
  }
}

function openUrlInSafari(url: string) {
  exec(`open -a Safari "${url}"`, (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
  });
}