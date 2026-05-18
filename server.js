const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 10000;

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ noServer: true });

// ХРАНИЛИЩЕ СООБЩЕНИЙ
let messages = [];

wss.on("connection", ws => {
    console.log("Client connected");

    // Отправляем историю новому клиенту
    ws.send(JSON.stringify({
        type: "history",
        messages
    }));

    ws.on("message", msg => {
        const text = msg.toString();
        let data;

        try {
            data = JSON.parse(text);
        } catch {
            return;
        }

        if (data.type === "chat") {
            // сохраняем сообщение
            messages.push({
                name: data.name,
                text: data.text
            });

            // рассылаем всем
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: "chat",
                        name: data.name,
                        text: data.text
                    }));
                }
            });
        }
    });

    ws.on("close", () => console.log("Client disconnected"));
});

server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, ws => {
        wss.emit("connection", ws, req);
    });
});

app.get("/", (req, res) => {
    res.send("WS server running");
});

server.listen(PORT, () => {
    console.log("WS running on port", PORT);
});
