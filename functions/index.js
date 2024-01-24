/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import path from "path";
import http from "http";
import fastify from "fastify";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let handleRequest = null;

const serverFactory = (handler, opts) => {
  handleRequest = handler;
  return http.createServer();
};

const server = fastify({ serverFactory });

server.register(import("@fastify/static"), {
  root: path.join(__dirname, "view"),
});

server.get("/", (req, reply) => {
  reply.sendFile("index.html");
});

export const app = onRequest((req, res) => {
  server.ready((err) => {
    if (err) throw err;
    handleRequest(req, res);
  });
});
