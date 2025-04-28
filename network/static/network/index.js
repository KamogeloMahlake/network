function Form({value, onSubmit, onChange})
{
  return (
  <div style={{border: "1px solid black", margin: "2rem"}}>
    <div className="border-bottom p-3">
      <h2>New Post</h2>
      <form onSubmit={onSubmit}>
        <textarea
          className="form-control" 
          rows="2"
          value={value}
          onChange={onChange}
        >
        </textarea>
        <button type="submit" className="btn btn-primary d-flex mt-2">Post</button>
      </form>
    </div>
  </div>
  );
}

function Post({author})
{
  return (
    <div style={{border: "1px solid black", margin: "2rem"}}>
      <h2>{author}</h2>
      <a>Edit</a>
      <p></p>
    </div>
  ); 
}

function App()
{
  const [state, setState] = React.useState({
    text: "",
    posts: []
  });

  const handlePosts = () => {
    fetch('/posts')
    .then(r => r.json())
    .then(d => setState({...state, posts: d.posts}));
  };


  const handleChange = e => {
    setState({
      ...state,
      text: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/compose', {
      method: 'POST',
      body: JSON.stringify({
        text: state.text
      })
    })
    .then(r => r.json())
    .then(d => {
      console.log(d);
      setState({
        ...state,
        text: ""
      });
    })
    .catch(e => console.log(e));

  };
  React.useEffect(() => handlePosts(), []);
  return (
    <>
      <Form value={state.text} onChange={handleChange} onSubmit={handleSubmit}/>
      {state.posts.map(({author, text, date}, index) => {
        return (
          <Post
          author={author} 
          />
        )
      })}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
