import { BrowserWindow } from "electron";
import { killApplications } from "../../utils/kill-applications";
import { getBODZoomToken } from "./get-bod-zoom-token";
import { launchBODZoomMeeting } from "./launch-bod-zoom-meeting";

export async function startBODZoomMeeting(win: BrowserWindow) {
  killApplications(["Google Chrome", "zoom.us"]);

  const token = await getBODZoomToken();
  if (typeof token?.access_token === "string") {
    const success = await launchBODZoomMeeting(token);
    if (success) {
      win?.minimize();
      await new Promise(resolve => setTimeout(resolve, 800));
      return { meetingLaunched: true, activeBODMeeting: true };
    }
  }
  return { meetingLaunched: false, activeBODMeeting: false };
}
