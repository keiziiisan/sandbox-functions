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
import * as cors from "cors";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
initializeApp();
const app = express();
app.use(express.json());
const corsOptions = {
  origin: "http://example.com",
  credentials: true,
  optionsSuccessStatus: 200,
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
  try {
    const documentResult = await getFirestore()
      .collection("UsersCollection")
      .doc(req.params.id)
      .get();

    res.status(200).send(documentResult.data());
  } catch (error) {
    res.status(400).send("failed user get.");
  }
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
export const userApi = onRequest(app);
