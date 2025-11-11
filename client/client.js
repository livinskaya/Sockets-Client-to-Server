const net = require("net");

const host = "127.0.0.1";
const port = 4000;

const client = new net.Socket();

client.connect(port, host, () => {
  console.log("Conncted");
  client.write("From Client: Hellllooooooo_test");
});

client.on("data", (data) => {
  console.log(data.toString());
  client.end();
});

client.on("close", () => {
  console.log("Connection closed");
});

client.on("error", (err) => {
  console.error(err.message);
});
