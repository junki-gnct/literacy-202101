const ws_clients = [];
const received_data = {};

setInterval(() => {
  const remove_data = [];
  Object.keys(received_data).forEach((key) => {
    const data = received_data[key];
    if (data.time < getUnixTime() - 60) {
      remove_data.push(key);
    }
  });

  remove_data.forEach((key) => {
    delete received_data[key];
    console.log(`Remove ${key}'s data.`);
  });
}, 1000);

function recv_data(name, value) {
  received_data[name] = {
    name: name,
    value: value,
    time: getUnixTime(),
  };
}

function getUnixTime() {
  return Math.floor(new Date().getTime() / 1000);
}

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
  recv_data: recv_data,
};
