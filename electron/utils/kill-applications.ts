
import { exec } from 'child_process';

export function killApplications(appNames: string[]) {
    appNames.forEach((appName) => {
      // CHeck if application is running
      exec(`pgrep -i "${appName}"`, (error) => {
        if (error) {
          console.log(`${appName} is not running or an error occurred: ${error}`)
        } else {
          // Process found, kill it
          exec(`killall "${appName}"`, (killError) => {
            if (killError) {
              console.log(`Failed to kill ${appName}: ${killError}`)
            } else {
              console.log(`${appName} has been killed successfully.`)
            }
          })
        }
      })
    });
  }