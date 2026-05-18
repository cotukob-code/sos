const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

wss.on("connection", ws => {
  console.log("Client connected");

  ws.on("message", msg => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  ws.on("close", () => console.log("Client disconnected"));
});

console.log("WS running on port", PORT);
