/* eslint-disable object-curly-spacing */
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as express from "express";

// The Firebase Admin SDK to access Firestore.
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";
import * as cors from "cors";
const discordApiKey = defineSecret("API_KEY");
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
initializeApp();
const app = express();
app.use(express.json());
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.post("/", async (req, res) => {
  const user = req.body;
  try {
    const documentResult = await getFirestore()
      .collection("UsersCollection")
      .add({
        name: user.name,
        id: user.id,
        pass: user.pass,
      });
    res.status(200).send(`user added. ID: ${documentResult.id}`);
  } catch (error) {
    res.status(400).send("failed user add.");
  }
});

app.get("/:id", async (req, res) => {
  const clientKey = req.headers.authorization;
  if (clientKey === discordApiKey.value()) {
    try {
      const documentResult = await getFirestore()
        .collection("UsersCollection")
        .doc(req.params.id)
        .get();

      res.status(200).send(documentResult.data());
    } catch (error) {
      res.status(400).send("failed user get.");
    }
  }
  res.status(400).send(`invalid API key.clientKey:${clientKey},
  discordApiKey:${discordApiKey.value()}`);
});
app.delete("/:id", async (req, res) => {
  try {
    await getFirestore()
      .collection("UsersCollection")
      .doc(req.params.id)
      .delete();

    res.status(200).send(`user deleted. ${req.params.id}`);
  } catch (error) {
    res.status(400).send("failed user delete.");
  }
});
app.put("/:id", async (req, res) => {
  const user = req.body;
  try {
    await getFirestore()
      .collection("UsersCollection")
      .doc(req.params.id)
      .update({
        name: user.name,
        id: user.id,
        pass: user.pass,
      });

    res.status(200).send(`user updated. ${req.params.id}`);
  } catch (error) {
    res.status(400).send("failed user update.");
  }
});
export const userApi = onRequest({ secrets: [discordApiKey] }, app);
export const test = onRequest({ secrets: [discordApiKey] }, (req, res) => {
  const clientKey = req.headers.authorization;
  if (clientKey === discordApiKey.value()) {
    res.status(200).send(
      `SUCSESS,clientKey:${clientKey},
        discordApiKey.value():${discordApiKey.value()}`
    );
  }
  res.status(400).send(
    `api key invalid,clientKey:${clientKey},
      discordApiKey.value():${discordApiKey.value()}`
  );
});
// curl https://userapi-zxd32l4aia-uc.a.run.app/RTGSTB1lFprPS3AjN3HU
