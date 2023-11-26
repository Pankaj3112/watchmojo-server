import express from "express";
import { AccessToken } from "livekit-server-sdk";
import Cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const createToken = (participantName, roomName) => {
  const at = new AccessToken(process.env.API_KEY, process.env.API_SECRET, {
    identity: participantName,
  });
  at.addGrant({ roomJoin: true, room: roomName });

  return at.toJwt();
};

const checkRoomName = (roomName) => {
  const roomnameRegex = /^[a-z0-9]{4}-[a-z0-9]{4}$/;
  return roomnameRegex.test(roomName);
};

const app = express();
app.use(Cors());
const port = process.env.port || 8000;

app.get("/getToken", (req, res) => {
  const { name, roomName } = req.query;
  if (!name || !roomName) {
    res.status(400).json({ error: "name and roomName are required" });
    return;
  }
  if (!checkRoomName(roomName)) {
    res.status(400).json({ error: "roomName is invalid" });
    return;
  }

  const token = createToken(name, roomName);
  res.json({ token });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
