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

    for (const client of clients) {
      if (client !== socket) {
        client.write(message);
      }
    }
    console.log(message);
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
