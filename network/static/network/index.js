function Navbar({user})
{
  return (
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="/">Network</a>
    <div>
      <ul class="navbar-nav mr-auto">
        {user &&
        <li class="nav-item">
          <a class="nav-link" href="/profile"><strong id="username">{user}</strong></a>
        </li>
        }
        <li class="nav-item">
          <a class="nav-link" href="/">All Posts</a>
        </li>
        {user &&
        <li class="nav-item">
          <a class="nav-link" href="">Following</a>
        </li>
        }
        {user &&
        <li class="nav-item">
          <a class="nav-link" href="/logout">Log Out</a>
        </li>
        }
        {!user &&
        <li class="nav-item">
          <a class="nav-link" href="/login">Log In</a>
        </li>
        }
        {!user &&
        <li class="nav-item">
          <a class="nav-link" href="/register">Register</a>
        </li>
        }
      </ul>        
    </div>
  </nav>            
  );
}

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

function Post({id, author, text, date, likes, click})
{
  return (
    <div className="p-3" style={{border: "1px solid black", margin: "2rem"}}>
      <h2>{author}</h2>
      <a>Edit</a>
      <p style={{fontWeight: "bold"}}>{text}</p>
      <p>{date}</p>
      <div>
        <button id={id} onClick={click} className="btn btn-link text-decoration-none text-danger p-0 mt-2"><i id={id} className="fas fa-heart"></i><span>{likes}</span></button>
      </div>
    </div>
  ); 
}


function Page({data, f})
{

  if (data)
  {
  return (
    <div>
      {data.map(({id, author, text, date, likes}, index) => {
        return (
          <Post id={id} click={f} author={author} text={text} date={date} likes={likes} key={index}/>
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
    user: "",
    text: "",
    posts: [], 
    current: 1,
    numOfPages: 0,
    prev: false,
    next: false,
    currentView: "All Posts"
    });

  const handleLike = (e) => {
    console.log(e.target.id)
    fetch(`/like/${e.target.id}`).then(r => r.json()).then(_d => loadPosts(state.current)).catch(e => console.log(e));
  };
  const loadPosts = (p) => {
    fetch(`/posts/${p}`)
    .then(r => r.json())
    .then(d => {
      console.log(d);
      setState({...state, posts: d.posts, text: "", current: d.current, numOfPages: d.num, prev: d.prev, next: d.next, user: d.user})});
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
      <Navbar user={state.user}/>
      <h1 style={{margin: "2rem"}}>{state.currentView}</h1>
      <Form value={state.text} onChange={handleChange} onSubmit={handleSubmit}/>
      <Page data={state.posts}  f={handleLike}/>
      
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
