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

function Post({author, text, date, likes})
{
  return (
    <div style={{border: "1px solid black", margin: "2rem"}}>
      <h2>{author}</h2>
      <a>Edit</a>
      <p style={{fontWeight: "bold"}}>{text}</p>
      <p>{date}</p>
      <div>
        <button></button><span>{likes}</span>
      </div>
    </div>
  ); 
}

function Page({data})
{
  console.log(data.posts)
  if (data.posts)
  {
  return (
    <>
      {data.posts.map(({author, text, date, likes}, index) => {
        return (
          <Post author={author} text={text} date={data} likes={likes} key={index}/>
        )
      })}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li>Tisi</li>
        </ul>
      </nav>
    </>
  );
} else {
  return (
    <>
    </>
  )
}

}

function App()
{
  const [state, setState] = React.useState({
    text: "",
    posts: []
  });

  const handlePosts = () => {
    fetch('/posts/1')
    .then(r => r.json())
    .then(d => {
      console.log(d);
      setState({...state, posts: d})});
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
  React.useEffect(() => handlePosts(), [Page]);
  return (
    <>
      <Form value={state.text} onChange={handleChange} onSubmit={handleSubmit}/>
      <Page data={state.posts} />   

    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
