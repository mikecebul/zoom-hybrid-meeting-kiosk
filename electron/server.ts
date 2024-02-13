import express from "express";
import cors from "cors";
import crypto from "crypto";
import { ipcMain } from "electron";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/meeting-ended", (req, res) => {
  let response;

  const message = `v0:${req.headers["x-zm-request-timestamp"]}:${JSON.stringify(
    req.body
  )}`;
  const hashForVerify = crypto
    .createHmac("sha256", import.meta.env.VITE_MEETING_FEATURE_SECRET_TOKEN)
    .update(message)
    .digest("hex");
  const signature = `v0=${hashForVerify}`;

  if (req.headers["x-zm-signature"] === signature) {
    if (req.body.event === "endpoint.url_validation") {
      const hashForValidate = crypto
        .createHmac("sha256", import.meta.env.VITE_MEETING_FEATURE_SECRET_TOKEN)
        .update(req.body.payload.plainToken)
        .digest("hex");

      response = {
        message: {
          plainToken: req.body.payload.plainToken,
          encryptedToken: hashForValidate,
        },
        status: 200,
      };

      res.status(response.status).json(response.message);
    } else {
      response = {
        message: "Authorized request to Zoom Meeting Webhook.",
        status: 200,
      };

      res.status(response.status).json(response);

      // Business logic here, e.g., make API request to Zoom or 3rd party
      ipcMain.emit("meeting-ended");
    }
  } else {
    response = {
      message: "Unauthorized request to Zoom Meeting Webhook.",
      status: 401,
    };

    res.status(response.status).json(response);
  }
});

app.post("/bod-meeting-ended", (req, res) => {
  let response;

  const message = `v0:${req.headers["x-zm-request-timestamp"]}:${JSON.stringify(
    req.body
  )}`;
  const hashForVerify = crypto
    .createHmac("sha256", import.meta.env.VITE_BOD_FEATURE_SECRET_TOKEN)
    .update(message)
    .digest("hex");
  const signature = `v0=${hashForVerify}`;

  if (req.headers["x-zm-signature"] === signature) {
    if (req.body.event === "endpoint.url_validation") {
      const hashForValidate = crypto
        .createHmac("sha256", import.meta.env.VITE_BOD_FEATURE_SECRET_TOKEN)
        .update(req.body.payload.plainToken)
        .digest("hex");

      response = {
        message: {
          plainToken: req.body.payload.plainToken,
          encryptedToken: hashForValidate,
        },
        status: 200,
      };

      res.status(response.status).json(response.message);
    } else {
      response = {
        message: "Authorized request to Zoom BOD webhook.",
        status: 200,
      };

      res.status(response.status).json(response);

      // Business logic here, e.g., make API request to Zoom or 3rd party
      ipcMain.emit("bod-meeting-ended");
    }
  } else {
    response = {
      message: "Unauthorized request to Zoom BOD Webhook.",
      status: 401,
    };

    res.status(response.status).json(response);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
