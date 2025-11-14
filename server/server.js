const net = require("net");

const host = "127.0.0.1";
const port = 4000;

const clients = [];

const server = net.createServer((socket) => {
  socket.write("Welcome to the Server!");
  clients.push(socket);

  socket.on("data", (data) => {
    const message = data.toString().trim();
    console.log("Recieved Message");

    if (!socket.username) {
      if (
        message.startsWith("user: ") &&
        message.includes("hat sich verbunden")
      ) {
        socket.username = message.split(" ")[1];
      }
    }

    if (message.includes("/list")) {
      const ulist = clients.map((c) => c.username || "Unbekannt").join(", ");
      socket.write(`Connected Users: ${ulist}`);
      return;
    }

    if (message.includes("/msg")) {
      const user = message.split(" ")[2];
      const privatmessage = message.slice(15 + user.length);

      const target = clients.find((c) => c.username === user);

      if (!target) {
        socket.write("Der User konnte nicht gefunden werden");
      }

      target.write(`[PRIVATE von ${socket.username}]: ${privatmessage}`);
      socket.write(`[PRIVATE an ${user}]`);
      return;
    }
    for (const client of clients) {
      if (client !== socket) {
        client.write(message);
      }
    }
  });

  socket.on("end", () => {
    console.log("Disconnected");
    const index = clients.indexOf(socket);
    if (index !== 1) clients.splice(index, 1);
  });

  socket.on("error", (err) => {
    console.error(err.message);
  });
});

server.listen(port, host, () => {
  console.log(`Sever run ons: ${host}:${port}`);
});
