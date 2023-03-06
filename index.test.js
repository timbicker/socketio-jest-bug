const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("my awesome project", () => {
  let serverSocket, clientSocket, socket;

  beforeAll((done) => {
    const httpServer = createServer();
    serverSocket = new Server(httpServer);
    httpServer.listen(() => {
      const address = httpServer.address()
      const port = address.port;
      clientSocket = Client(`http://localhost:${port}`)
      serverSocket.on("connection", (_socket) => {
        socket = _socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    serverSocket.close();
    clientSocket.close();
  });

  test("should work server emit", (done) => {
    clientSocket.on("hello", (arg) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  test("should work client emit", (done) => {
    serverSocket.on("hi", (data) => {
      expect(data).toBe("data")
      done()
    });
    clientSocket.emit("hi", "data");
  });
});
