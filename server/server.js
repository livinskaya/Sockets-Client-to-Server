const net = require("net");

const host = "127.0.0.1";
const port = 4000;

const server = net.createServer((socket) => {
  console.log("Connected");

  socket.on("data", (data) => {
    console.log(data.toString());
    socket.write(data.toString());
  });

  socket.on("end", () => {
    console.log("Disconnected");
  });

  socket.on("error", (err) => {
    console.error(err.message);
  });
});

server.listen(port, host, () => {
  console.log(`Sever run ons: ${host}:${port}`);
});
