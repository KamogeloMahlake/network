function Navbar({user, profile, home, logout})
{
  return (
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" onClick={home}>Network</a>
    <div>
      <ul class="navbar-nav mr-auto">
        {user &&
        <li class="nav-item">
          <a onClick={profile} class="nav-link"><strong id="username">{user.username}</strong></a>
        </li>
        }
        <li class="nav-item">
          <a class="nav-link" onClick={home}>All Posts</a>
        </li>
        {user &&
        <li class="nav-item">
          <a class="nav-link" href="">Following</a>
        </li>
        }
        {user &&
        <li class="nav-item">
          <a onClick={logout} class="nav-link" href="/logout">Log Out</a>
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

function Post({id, author, authorId, text, date, likes, following, isAuthor, click, follow, liked})
{
  return (
    <div className="p-3" style={{border: "1px solid black", margin: "2rem"}}>
      <div class="r">
        <h2>{author}</h2>
        <button class={following ? "btn btn-danger" : "btn btn-primary"} id={authorId} onClick={follow} disabled={isAuthor ? true : false}>{following ? "Unfollow": "Follow"}</button>
      </div>
      <a>Edit</a>
      <p style={{fontWeight: "bold"}}>{text}</p>
      <p>{date}</p>
      <div>
        <button id={id} onClick={click} className="btn btn-link text-decoration-none text-danger p-0 mt-2"><i id={id} className={liked ? "fas fa-heart" : "far fa-heart"}></i><span>{likes}</span></button>
      </div>
    </div>
  ); 
}


function Page({data, f, follow})
{

  if (data)
  {
  return (
    <div>
      {data.map(({id, author, authorId, text, date, likes, following, isAuthor, liked}, index) => {
        return (
          <Post liked={liked} authorId={authorId} follow={follow} id={id} click={f} author={author} text={text} date={date} likes={likes} key={index} following={following} isAuthor={isAuthor}/>
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

function Profile({user})
{
  return (
    <div style={{margin: "2rem"}}>
      <h1>Profile: {user.username}</h1>
      <p>Follower: {user.followers}</p>
      <p>Following: {user.following.length}</p>
    </div>
  )
}

function App()
{
  const [state, setState] = React.useState({
    user: [],
    text: "",
    posts: [], 
    current: 1,
    numOfPages: 0,
    prev: false,
    next: false,
    currentView: "allposts"
    });

  const handleFollow = (e) => {
    fetch(`/follow/${parseInt(e.target.id)}`).then(r => r.json()).then(d => {
      console.log(d);
      loadPosts(state.currentView, state.current);})
      .catch(e => console.log(e));
  };
  const handleLogout = () => {
    fetch('/logout').then(r => r.json).then(_d => loadPosts('allpost', 1));
  };
  const handleProfile = () => {
    loadPosts("profile", 1);
  };

  const handleAllPost = () => {
    loadPosts('allposts', 1);
  };

  const handleLike = (e) => {
    console.log(e.target.id)
    fetch(`/like/${e.target.id}`).then(r => r.json()).then(_d => loadPosts(state.currentView, state.current)).catch(e => console.log(e));
  };
  const loadPosts = (c, p) => {
    fetch(`/posts/${c}/${p}`)
    .then(r => r.json())
    .then(d => {
      console.log(d);
      setState({...state, posts: d.posts, text: "", current: d.current, numOfPages: d.num, prev: d.prev, next: d.next, user: d.user, currentView: c})});
  };

  const handlePageChange = (e) => {
    loadPosts(state.currentView, parseInt(e.target.id));
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
      loadPosts(state.currentView, state.current);
      setState({
        ...state,
        text: ""
      });
    })
    .catch(e => console.log(e));

  };

  React.useEffect(() => loadPosts(state.currentView, state.current), []);
  return (
    <>
      <Navbar user={state.user} home={handleAllPost} profile={handleProfile} logout={handleLogout}/>
      {state.currentView === 'allposts' && <Form value={state.text} onChange={handleChange} onSubmit={handleSubmit}/>}
      {state.currentView === 'profile' && <Profile user={state.user}/>}
      <Page data={state.posts}  f={handleLike} follow={handleFollow}/>
      
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
