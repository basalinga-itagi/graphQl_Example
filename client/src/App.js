import logo from "./logo.svg";
import "./App.css";
import { useQuery, gql } from "@apollo/client";

const query = gql`
  query GetAllTodosWithUser {
    getTodos {
      title
      completed
      user {
        id
        name
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(query);
  console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {JSON.stringify(error)}</p>;
  return (
    <div className="App">
      <table>
        <tbody>
          {data.getTodos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.title}</td>
              <td>{todo?.user?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
