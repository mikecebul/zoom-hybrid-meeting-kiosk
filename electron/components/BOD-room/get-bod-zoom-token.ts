import axios from "axios";
import fs from "fs";
import { getISODate } from "../../utils/getISODate";

export async function getBODZoomToken() {
  const accountId = import.meta.env.VITE_S2S_BOD_ACCOUNT_ID;
  const clientId = import.meta.env.VITE_S2S_BOD_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_S2S_BOD_CLIENT_SECRET;

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

    if (process.platform === "darwin") {
      fs.writeFileSync(
        `/home/Shared/error-logs/get-meeting-zoom-token-error-log-${getISODate()}.txt`,
        `Axios Error during getZoomToken: ${error}\n`
      );
      return undefined;
    }
  }
}
