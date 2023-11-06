import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import axios from "axios";

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
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos/")).data,
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
