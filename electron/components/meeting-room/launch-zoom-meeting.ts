import axios from "axios";
import type { ZoomToken } from "../../utils/types";
import { exec } from "child_process";
import { logErrorToFile } from "../../utils/logErrorToFile";

export async function launchZoomMeeting(token: ZoomToken) {
  const meetingId = import.meta.env.VITE_MEETING_MEETING_ID;
  const bearerToken = token?.access_token ? token.access_token : ""

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

    if (process.platform === "darwin") {
      logErrorToFile("launchZoomMeeting", error)
    }
    return false;
  }
}

function openUrlInSafari(url: string) {
  exec(`open -a Safari "${url}"`, (error) => {
    if (error) {
      
      logErrorToFile("openUrlInSafari", error)
    }
  });
}