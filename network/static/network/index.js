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


function Page({data, page})
{

  if (data.posts)
  {
    const {posts, num, current, prev, next} = data;
    console.log([...Array(num).keys()])
  return (
    <div>
      {posts.map(({author, text, date, likes}, index) => {
        return (
          <Post author={author} text={text} date={date} likes={likes} key={index}/>
        )
      })}

      <nav aria-label="...">
        <ul class="pagination justify-content-center">
          <li onClick={page} id={String(current - 1)} class={prev ? "page-item" : "page-item disabled"}>
            <span class="page-link">Previous</span>
          </li>
          {num > 1 && [...Array(num).keys().map(n => {
            return (
            <li onClick={page} id={String(n + 1)} class={current === n + 1 ? "page-item active" : "page-item"}>
              <span class="page-link">{n + 1}</span>
            </li>
            )
          })]}
          <li class={next ? "page-item" : "page-item disabled"}>
            <span onClick={page} id={String(current + 1)} class="page-link">Next</span>
          </li>
        </ul>
      </nav>
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
    currentPage: 1
  });

  const handlePosts = () => {
    fetch(`/posts/${state.currentPage}`)
    .then(r => r.json())
    .then(d => {
      console.log(d);
      setState({...state, posts: d, text: ""})});
  };

  const handlePageChange = (e) => {
    console.log(e.target.id)
    setState({...state, currentPage: parseInt(e.target.value) });
    console.log(state)
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
      handlePosts();
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
      <Page data={state.posts} page={handlePageChange}/>   
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
