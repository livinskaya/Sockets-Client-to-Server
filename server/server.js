const net = require("net");

const host = "127.0.0.1";
const port = 4000;

const clients = [];
const groups = {};

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
      const parts = message.split(" ");
      const grName = parts[1];
      if (!grName) {
        socket.write("Schreibweise: /group [gruppenname]");
        return;
      }
      if (!groups[grName]) {
        groups[grName] = new Set();
      }
      groups[grName].add(socket);
      socket.currentGroup = grName;

      socket.write(`Du bist jetzt in Gruppe: ${grName}`);
      return;
    }
    if (message.includes("/add")) {
      if (!socket.currentGroup) {
        socket.write("du bist in keine gruppe");
        return;
      }
      const targetName = message.split(" ")[1];
      if (!targetName) {
        socket.write("Schreibweise: /add [username]");
      }
      const target = clients.find((c) => c.username === targetName);
      if (!target) {
        socket.write("user gibts nicht");
        return;
      }
      const group = socket.currentGroup;
      if (!groups[group]) groups[group] = new Set();
      groups[group].add(target);
      target.currentGroup = group;
      target.write(`Du bist nun in der Gruppe ${group} drin`);
      socket.write(`${targetName} ist nun teil der gruppe`);
      return;
    }
    if (message.includes("leave")) {
      if (!socket.currentGroup) {
        socket.write("Du bist in keiner gruppe");
        return;
      }
      const g = socket.currentGroup;
      if (groups[group]) groups[group].delete(scoket);
      socket.currentGroup = null;
      socket.wirte("du hast die gruppe verlassen");
      if (groups[group] && groups[group].size === 0) delete groups[group];
      return;
    }
    if (message.includes("/member")) {
      if (!socket.currentGroup) {
        socket.write("du bist in kiner gruppe");
        return;
      }
      const grSet = groups[socket.currentGroup];
      if (!grSet) {
        socket.write("gruppe gibt es nicht");
        return;
      }

      const members = [...groups[socket.currentGroup]]
        .map((s) => s.username)
        .join(", ");
      socket.write(`Members: ${socket.currentGroup}: ${members}`);
      return;
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

    if (socket.currentGroup) {
      const group = socket.currentGroup;
      for (const member of groups[group]) {
        if (member !== socket) {
          member.write(`[${group}] [${socket.username}]: ${message}`);
        }
      }
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
    for (const name of Object.keys(groups)) {
      groups[name].delete(socket);
      if (groups[name].size === 0) delete groups[name];
    }
  });

  socket.on("error", (err) => {
    console.error(err.message);
  });
});

server.listen(port, host, () => {
  console.log(`Sever run ons: ${host}:${port}`);
});
