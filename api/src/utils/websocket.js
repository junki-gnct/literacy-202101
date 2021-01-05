let ws_clients = [];

function broadcast(message) {
  ws_clients.forEach((ws) => {
    if (ws.readyState == 1) {
      ws.send(message);
    }
  });
}

module.exports = {
  ws_clients: ws_clients,
  broadcast: broadcast,
};
