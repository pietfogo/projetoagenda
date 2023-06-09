import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const response = await axios.get("http://localhost:5000/todos");
        setTodos(response.data);
      } catch (error) {
        console.error("Ocorreu um erro ao carregar os dados:", error);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    try {
      const response = await axios.post("http://localhost:5000/todos", todo);

      if (response.status === 201) {
        console.log("Dados enviados com sucesso para o servidor.");
        setTitle("");
        setTime("");
      } else {
        console.error("Falha ao enviar os dados para o servidor.");
      }
    } catch (error) {
      console.error("Ocorreu um erro ao enviar os dados:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${taskId}`);
      const updatedTodos = todos.filter((todo) => todo.id !== taskId);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Ocorreu um erro ao excluir a tarefa:", error);
    }
  };

  return (
    <div className="App">
      <div id="todo-header">
        <h1>React Todo</h1>
      </div>
      <div id="form-todo">
        <h2>Insira sua próxima tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div id="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input
              type="text"
              placeholder="Titulo da tarefa"
              name="title"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              value={title}
              required
            />
          </div>
          <div id="form-control">
            <label htmlFor="time">Duração</label>
            <input
              type="text"
              placeholder="Tempo estimado (em horas)"
              name="time"
              onChange={(e) => {
                setTime(e.target.value);
              }}
              value={time}
              required
            />
          </div>
          <input type="submit" value="Criar tarefa" />
        </form>
      </div>
      <div id="list-todo">
        <h2>Lista de tarefas:</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : todos.length === 0 ? (
          <p id="paragnht">Não há tarefas</p>
        ) : (
          todos.map((todo) => (
            <div id="todo" key={todo.id}>
              <div id="credenciais">
                <p>Nome da tarefa: {todo.title}</p>
                <p>Duração: {todo.time} horas</p>
                {!todo.done && (
                  <button
                    id="botao-finalizar"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Finalizar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
