/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    DIST: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import("electron").IpcRenderer;
  electronAPI?: {
    startZoomMeeting: () => void;
    onZoomMeetingStarted: (callback: () => void) => void;
    startBODZoomMeeting: () => void;
    onBODZoomMeetingStarted: (callback: () => void) => void;
    onZoomMeetingFailed: (callback: () => void) => void;
    removeZoomMeetingStartedListener: (callback: () => void) => void;
    removeZoomMeetingFailedListener: (callback: () => void) => void;
    onBODZoomMeetingFailed: (callback: () => void) => void;
    removeBODZoomMeetingStartedListener: (callback: () => void) => void;
    removeBODZoomMeetingFailedListener: (callback: () => void) => void;
  };
}
