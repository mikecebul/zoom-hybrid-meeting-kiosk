import { BrowserWindow } from "electron";
import { killApplications } from "../../utils/kill-applications";
import { getMeetingZoomToken } from "./get-meeting-zoom-token";
import { launchZoomMeeting } from "./launch-zoom-meeting";

export async function startZoomMeeting(win: BrowserWindow) {
  killApplications(["Google Chrome", "zoom.us", "Safari"]);

  const token = await getMeetingZoomToken();
  if (token?.success === false) return {meetingLaunched: false, activeMeeting: false, errorMsg: token.error}
  if (token?.success === true) {
    if (typeof token?.access_token === "string") {
      const success = await launchZoomMeeting(token);
      if (success) {
        win?.minimize();
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {meetingLaunched: true, activeMeeting: true}
      } else {
        return {meetingLaunched: false, activeMeeting: false, errorMsg: token?.error}
      }
    }
  }
  return {meetingLaunched: false, activeMeeting: false, errorMsg: token?.error}
}
