import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: `type Todo {
        id: ID
        title: String!
        completed: Boolean
      }
  
      type Query {
        getTodos: [Todo]
      }`,
    resolvers: {
      Query: {
        getTodos: () => [
          { id: "1", title: "First Todo", completed: false },
          { id: "2", title: "Second Todo", completed: true },
        ],
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();
  app.use("/graphql", expressMiddleware(server));
  app.listen(8080, () => console.log("Server started on port 8080"));
}

startServer();
