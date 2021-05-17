import express from "express";
import WebSocket from "ws";
import path from "path"

const PORT = (process.env.PORT || 3001) as number;

const app = express();
const wss = new WebSocket.Server({noServer: true})

app.use(express.static(path.resolve(__dirname, '../client/build')))

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


type ServerMessage = {
  type:string,
  moveNumber?: number,
  action?: any,
  jump?:number,
  gameCode?: string,
  history?: any[],
}

type Game = {
  counter: number,
  history: any[],
  clients: WebSocket[],
}

let clientsToGameCode:Map<WebSocket, string> = new Map();

let games:Map<string, Game> = new Map();

const joinGame = (client: WebSocket, gameCode: string) => {
  //Remove player from other rooms
  games.forEach(({clients}) => {
    if (clients.includes(client)){
      clients.splice(clients.indexOf(client), 1)
    }
  })
  if(!games.get(gameCode)) {
    games.set(gameCode, {
      counter: 0,
      history: [],
      clients: [],
    })
  }
  //Add player to designated Room
  games.get(gameCode)?.clients.push(client);
  clientsToGameCode.set(client, gameCode);
  //Initialize client with game history
  client.send(JSON.stringify({type: "join", "history": games.get(gameCode)?.history}));
}

const broadcastToRoom = (gameCode: string, message:ServerMessage) => {
  let clients = games.get(gameCode)?.clients
  if(!clients) return;
  for (let client of clients){
    client.send(JSON.stringify(message))
  }
}

const disconnect = (client:WebSocket) => {
  games.forEach(({clients}, key) => {
    if (clients.includes(client)){
      clients.splice(clients.indexOf(client), 1)
    }
  })
  clientsToGameCode.delete(client);
}


server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit("connection", socket, request);
  })
})

const handleMove = (client: WebSocket, messageObj:ServerMessage) => {
  const gameCode = clientsToGameCode.get(client);
  if(!gameCode) return;
  const game = games.get(gameCode);
  if(!game) return;
  messageObj.moveNumber = game.counter; 
  game.counter++;
  game.history.push(messageObj);
  broadcastToRoom(gameCode, messageObj);
}

wss.on('connection', function connection(ws, req) {

  const ip = req.socket.remoteAddress;
  //On move received
  //  Increment move counter, and broadcast to all clients of the room
  ws.on('message', (message: string) => {
    console.log(`Recieved ${message}`);
    const messageObj = JSON.parse(message) as ServerMessage;
    switch(messageObj.type){
      case "join":
        joinGame(ws, messageObj.gameCode!)
        break
      case "move":
        handleMove(ws, messageObj);
        break;
    }
    if(messageObj.type === "join")
      ws.send(JSON.stringify(messageObj));

  });
  ws.send(JSON.stringify({"type": "connected"}));
});

wss.on('close', (ws: WebSocket) => {
  disconnect(ws);
})