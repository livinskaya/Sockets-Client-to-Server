const net = require("net");

const host = "127.0.0.1";
const port = 4000;

const clients = [];

function uniqueName(standardName) {
  const tag = Math.floor(1000 + Math.random() * 9000);
  return `${standardName}#${tag}`;
}

const server = net.createServer((socket) => {
  socket.write("Welcome to the Server!");

  socket.on("data", (data) => {
    const message = data.toString().trim();
    console.log("Recieved Message");

    if (!socket.username) {
      if (
        message.startsWith("user: ") &&
        message.includes("hat sich verbunden")
      ) {
        const reqname = message.split(" ")[1];
        socket.username = uniqueName(reqname);
        clients.push(socket);
        socket.write(`Dein Name lautet: ${socket.username}`);
        return;
      }
    }

    if (message.includes("/list")) {
      const ulist = clients.map((c) => c.username || "Unbekannt").join(", ");
      socket.write(`Connected Users: ${ulist}`);
      return;
    }

    if (message.includes("/group")) {
      if (message.includes("/add")) {
      }
      if (message.includes("/leave")) {
      }
      if (message.includes("/member")) {
      }
    }

    if (message.includes("/msg")) {
      const parts = message.split(" ");
      const user = parts[1];
      const privatmessage = parts.slice(2).join(" ");

      const target = clients.find((c) => c.username === user);

      if (!target) {
        socket.write("Der User konnte nicht gefunden werden");
        return;
      }

      target.write(`[PRIVATE von ${socket.username}]: ${privatmessage}`);
      socket.write(`[PRIVATE an ${user}]`);
      return;
    }
    for (const client of clients) {
      if (client !== socket) {
        client.write(`[${socket.username}]: ${message}`);
      }
    }
  });

  socket.on("end", () => {
    console.log("Disconnected");
    const index = clients.indexOf(socket);
    if (index !== -1) clients.splice(index, 1);
  });

  socket.on("error", (err) => {
    console.error(err.message);
  });
});

server.listen(port, host, () => {
  console.log(`Sever run ons: ${host}:${port}`);
});
