const net = require("net");

const host = "127.0.0.1";
const port = 4000;

const client = new net.Socket();

client.connect(port, host, () => {
  console.log("Conncted");

  const request = `GET / HTTP/1.1\r\nHost: ${host}\r\nConnection: close\r\n\r\n`;

  client.write(request);
});

client.on("data", (data) => {
  console.log("Response:");
  console.log(data.toString());
  client.end();
});

client.on("close", () => {
  console.log("Connection closed");
});

client.on("error", (err) => {
  console.error(err.message);
});
