import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { UserResolver } from './resolver/UserResolver';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import router from './middleware/routes';
import cors from 'cors';
import { loadInitDbData } from './init-db-data';

const port = process.env.PORT || 9000;

(async () => {
  const connection = await createConnection();
  await loadInitDbData('auth', connection);

  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      credentials: true,
      origin: `http://localhost:19006`,
    })
  );
  app.use(cookieParser());
  app.use(router);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(port, () => console.log(`listenting at http://localhost:${port}`));
})();
