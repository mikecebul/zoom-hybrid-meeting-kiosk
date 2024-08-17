import axios from "axios";
import fs from "fs";
import type { ZoomToken } from "../../utils/types";
import { exec } from "child_process";
import { getISODate } from "electron/utils/getISODate";

export async function launchZoomMeeting(token: ZoomToken) {
  const meetingId = import.meta.env.VITE_MEETING_MEETING_ID;
  const bearerToken = token ? token.access_token : ""

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
      openUrlInSafari(startUrl)
    }
    return true;
  } catch (error) {
    console.error("Error starting the meeting:", error);

    if (process.platform === "darwin") {
      fs.writeFileSync(
        `/Users/Shared/error-logs/launch-zoom-meeting-error-log--${getISODate()}.txt`,
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
    }
  });
}