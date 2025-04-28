function Form({value, onSubmit, onChange})
{
  return (
    <div className="border-bottom p-3">
      <div className="lead mb-2">New Post</div>
      <form onSubmit={onSubmit}>
        <textarea
          className="form-control" 
          rows="2"
          value={value}
          onChange={onChange}
        >
        </textarea>
        <button type="submit" className="btn btn-primary d-flex ml-auto mt-2">Post</button>
      </form>
    </div>
  )
}

function Post()
{
  return;  
}

function App()
{
  const [text, setText] = React.useState("");

  const handleChange = e => {
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/compose', {
      method: 'POST',
      body: JSON.stringify({
        text: text
      })
    })
    .then(r => r.json())
    .then(d => {
      console.log(d);
      setText("");
    })
    .catch(e => console.log(e));

  };

  return (
    <>
      <Form value={text} onChange={handleChange} onSubmit={handleSubmit}/>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
