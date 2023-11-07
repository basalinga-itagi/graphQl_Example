import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import axios from "axios";

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: `
    type Users {
      id: ID
      name: String
      username: String
      email: String
      phone: String
      website: String
    }
    type Todo {
        id: ID
        title: String!
        completed: Boolean
        user: Users
      }
  
      type Query {
        getTodos: [Todo]
        getAllUsers: [Users]
        getUser(id:ID!):Users
      }`,
    resolvers: {
      Todo: {
        user: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.id}`
            )
          ).data,
      },
      Query: {
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos/")).data,
        getAllUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUser: async (parent, { id }) =>
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`))
            .data,
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
