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
    <div className="p-3" style={{border: "1px solid black", margin: "2rem"}}>
      <h2>{author}</h2>
      <a>Edit</a>
      <p style={{fontWeight: "bold"}}>{text}</p>
      <p>{date}</p>
      <div>
        <button className="btn btn-link text-decoration-none text-danger p-0 mt-2"><i className="fas fa-heart"></i></button><span>{likes}</span>
      </div>
    </div>
  ); 
}


function Page({data})
{

  if (data)
  {
  return (
    <div>
      {data.map(({author, text, date, likes}, index) => {
        return (
          <Post author={author} text={text} date={date} likes={likes} key={index}/>
        )
      })}

      
    </div>
  );
} else {
  return (
    <div>
      <h2>No Posts available</h2>
    </div>
  );
  }
}

function App()
{
  const [state, setState] = React.useState({
    text: "",
    posts: [], 
    current: 1,
    numOfPages: 0,
    prev: false,
    next: false,
    currentView: "All Posts"
    });

  const loadPosts = (p) => {
    fetch(`/posts/${p}`)
    .then(r => r.json())
    .then(d => {
      console.log(d);
      setState({...state, posts: d.posts, text: "", current: d.current, numOfPages: d.num, prev: d.prev, next: d.next})});
  };

  const handlePageChange = (e) => {
    loadPosts(parseInt(e.target.id));
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
      loadPosts(state.current);
      setState({
        ...state,
        text: ""
      });
    })
    .catch(e => console.log(e));

  };
  React.useEffect(() => loadPosts(state.current), []);
  return (
    <>
      <h1 style={{margin: "2rem"}}>{state.currentView}</h1>
      <Form value={state.text} onChange={handleChange} onSubmit={handleSubmit}/>
      <Page data={state.posts} />
      
      {state.numOfPages && 
      <nav aria-label="...">
        <ul class="pagination justify-content-center">
          <li class={state.prev ? "page-item" : "page-item disabled"}>
            <span  onClick={handlePageChange} id={String(state.current - 1)} class="page-link">Previous</span>
          </li>
           {[...Array(state.numOfPages).keys().map(n => {
            return (
            <li class={state.current === n + 1 ? "page-item active" : "page-item"}>
              <span id={String(n + 1)} onClick={handlePageChange} class="page-link">{n + 1}</span>
            </li>
            )
          })]}
          <li class={state.next ? "page-item" : "page-item disabled"}>
            <span onClick={handlePageChange} id={String(state.current + 1)} class="page-link">Next</span>
          </li>
        </ul>
      </nav>
      }   
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
