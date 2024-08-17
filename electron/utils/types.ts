export type ZoomToken = {
  access_token?: string;
  success: boolean;
  error?: string | undefined
} | undefined

export type StartZoomMeetingReturn = {
  meetingLaunched: boolean;
  activeMeeting: boolean;
  errorMsg?: string | undefined;
} | undefined