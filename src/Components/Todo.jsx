import React from "react";

const Todo = () => {
  const [inputvalue, setInputvalue] = React.useState("");
  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total,setTotal] = React.useState(0);

  const fetchAndUpdateData = () => {
    setLoading(true);
    fetch(`http://localhost:3004/tasks?_page=${page}&_limit=3`)
      .then( (res) => {
        let t = res.headers.get("X-Total-Count");
        setTotal(+t);
        return res.json();
      })
      .then((res) => setTodos(res))
      .catch((error) => setError(true))
      .finally(() => setLoading(false));
  };

  const addTodo = () => {
    const payload = {
      title: inputvalue,
      status: false,
    };

    const dataToPost = JSON.stringify(payload);
    //console.log(dataToPost);
    fetch(`http://localhost:3004/tasks`, {
      method: "POST",
      body: dataToPost,
      headers: {
        "content-Type": "application/json",
      },
    }).then(() => {
      fetchAndUpdateData();
      setInputvalue("");
    });
  };

  React.useEffect(() => {
    fetchAndUpdateData();
  }, [page]);

  return (
    <div>
      <h1>Todo using JSON server</h1>
      <input
        type="text"
        placeholder="Add something"
        onChange={(e) => setInputvalue(e.target.value)}
        value={inputvalue}
      />
      <button onClick={addTodo}>Add</button>
      <hr />
      {loading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <h3>Something Went Wrong</h3>
      ) : (
        todos.map((todo) => <h1 key={todo.id}>{todo.title}</h1>)
      )}
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Prev
      </button>
      <button
        onClick={() => setPage(page + 1)}
        disabled={ page== Math.ceil(total/3)}
        
      >
        Next
      </button>
    </div>
  );
};

export default Todo;
