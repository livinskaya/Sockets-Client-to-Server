const net = require("net");

const host = "127.0.0.1";
const port = 4000;

const server = net.createServer((socket) => {
  console.log("Connected");

  const htmlBody = `
  <ul>
    <li>hi</li>
    <li>from</li>
    <li>htlm</li>
  </ul>
  `;

  socket.on("data", (data) => {
    console.log(data.toString());

    const response =
      "HTTP/1.1 200 OK\r\n" +
      "Content-Type: text/html\r\n" +
      "Connection: close\r\n" +
      "\r\n" +
      htmlBody;

    socket.write(response);
    socket.end();
  });

  socket.on("end", () => {
    console.log("Disconnected");
  });

  socket.on("error", (err) => {
    console.error(err.message);
  });
});

server.listen(port, host, () => {
  console.log(`Sever run ons: http://${host}:${port}`);
});
