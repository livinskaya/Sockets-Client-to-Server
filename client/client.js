const net = require("net");
const readline = require("node:readline");

const username = process.argv[2] || "Unbekannt";
const host = "127.0.0.1";
const port = 4000;

const client = new net.Socket();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

client.connect(port, host, () => {
  console.log("Conncted");
  client.write(`user: ${username} hat sich verbunden`);
});

client.on("data", (data) => {
  console.log(data.toString());
  rl.prompt(true);
});

rl.on("line", (input) => {
  if (input.toLocaleLowerCase() === "/exit") {
    console.log("Verbindung geschlossen");
    client.end;
    rl.close();
  } else {
    client.write(`[${username}]: ${input}`);
  }
});

client.on("close", () => {
  console.log("Connection closed");
});

client.on("error", (err) => {
  console.error(err.message);
});
