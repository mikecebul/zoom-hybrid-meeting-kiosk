import { BrowserWindow } from "electron";
import { killApplications } from "../../utils/kill-applications";
import { getMeetingZoomToken } from "./get-meeting-zoom-token";
import { launchZoomMeeting } from "./launch-zoom-meeting";

export async function startZoomMeeting(win: BrowserWindow) {
  killApplications(["Google Chrome", "zoom.us"]);

  const token = await getMeetingZoomToken();
  if (typeof token?.access_token === "string") {
    const success = await launchZoomMeeting(token);
    if (success) {
      win?.minimize();
      await new Promise(resolve => setTimeout(resolve, 800));
      return {meetingLaunched: true, activeMeeting: true}
    }
  }
  return {meetingLaunched: false, activeMeeting: false}
}
