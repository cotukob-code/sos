const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 10000;

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", ws => {
    console.log("Client connected");

    ws.on("message", msg => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }
        });
    });

    ws.on("close", () => console.log("Client disconnected"));
});

server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, ws => {
        wss.emit("connection", ws, req);
    });
});

app.get("/", (req, res) => {
    res.send("WebSocket server is running");
});

server.listen(PORT, () => {
    console.log("WS running on port", PORT);
});
