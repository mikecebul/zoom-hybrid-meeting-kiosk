import axios from "axios";
import fs from "fs";
import type { ZoomToken } from "../../utils/types";
import { getISODate } from "electron/utils/getISODate";

export async function getMeetingZoomToken(): Promise<ZoomToken> {
  const accountId = import.meta.env.VITE_S2S_MEETING_ACCOUNT_ID;
  const clientId = import.meta.env.VITE_S2S_MEETING_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_S2S_MEETING_CLIENT_SECRET;

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
      console.log("Token", response.data);
      return {success: true, access_token: response.data}
    }
  } catch (error) {
    console.error("Error fetching data:", error);

    if (process.platform === "darwin") {
      fs.writeFileSync(
        `/home/Shared/error-logs/get-meeting-zoom-token-error-log-${getISODate()}.txt`,
        `Axios Error during getZoomToken: ${error}\n`
      );
    }
    return {success: false, error: `Error getting meeting Zoom auth token.`}
  }
}
