import app from './app';

const port = process.env.port || 3333;

const server = app.listen(port, () => {
  console.log(__dirname);
  console.log(`Listening at http://localhost:${port}/`);
});

// const io = new Server(server, {});

server.on('error', console.error);

export default app;
