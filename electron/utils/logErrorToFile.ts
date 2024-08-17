import { getISODate } from "./getISODate";
import fs from "fs";

export function logErrorToFile(functionName: string, error: any) {
    const timestamp = getISODate()
    const logFilename = `/Users/Shared/error-logs/${functionName}-error-log--${timestamp}.json`;
  
    const errorLog = {
      timestamp: new Date().toISOString(),
      error
      // functionName,
      // status: error.status,
      // response: error.response
    };
  
    fs.writeFileSync(logFilename, JSON.stringify(errorLog, null, 2));
  }