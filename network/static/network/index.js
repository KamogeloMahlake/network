function Navbar({user, profile, home, logout, following})
{
  return (
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" onClick={home}>Network</a>
    <div>
      <ul class="navbar-nav mr-auto">
        {user &&
        <li class="nav-item">
          <a onClick={profile} class="nav-link"><strong id={user.id}>{user.username}</strong></a>
        </li>
        }
        <li class="nav-item">
          <a class="nav-link" onClick={home}>All Posts</a>
        </li>
        {user &&
        <li class="nav-item">
          <a class="nav-link" onClick={following}>Following</a>
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

function Post({id, author, authorId, text, date, likes, click, liked, profile, posts, isAuthor})
{
  const [s, setS] = React.useState({
    text: text,
    mode: false
  });

  const submit = (e) => {
    e.preventDefault();
    fetch(`/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        text: s.text
      })
    }).then(r => r.json())
    .then(d => {
      console.log(e);
      setS({...s, mode: false});
      posts();
    }).catch(e => console.log(e));

  };
  const change = (e) => {
    setS({...s, text: e.target.value});
  };
  const handleEdit = () => {
    setS({...s, mode: true})
  };

  return (
    <div className="p-3" style={{border: "1px solid black", margin: "2rem"}}>
        <a><h2 onClick={profile} id={authorId}>{author}</h2></a>
      {s.mode ?
       <>
        <textarea className="form-control" rows="2" value={s.text} onChange={change}>    
        </textarea>
        <button onClick={submit} type="submit" className="btn btn-primary d-flex mt-2">Save</button>
       </>
       :
       <> 
        {isAuthor && <a data-id={id} onClick={handleEdit}>Edit</a>}
        <p style={{fontWeight: "bold"}}>{text}</p>
      </>}
      
      <p>{date}</p>
      <div>
        <button id={id} onClick={click} className="btn btn-link text-decoration-none text-danger p-0 mt-2"><i id={id} className={liked ? "fas fa-heart" : "far fa-heart"}></i> {likes}</button>
      </div>
    </div>
  ); 
}


function Page({data, f, profile, posts, title})
{
  let t = ''
  switch (title) {
    case 'allposts':
      t = 'All Posts';
      break;
    case 'following':
      t = 'Following';
    default:
      break;
  }
  if (data)
  {
  return (
    <div>
      {t && <h1 style={{margin: "2rem"}}>{t}</h1>}
      {data.map(({id, author, authorId, text, date, likes, liked, isAuthor}, index) => {
        return (
          <Post posts={posts} profile={profile} liked={liked} isAuthor={isAuthor} authorId={authorId}  id={id} click={f} author={author} text={text} date={date} likes={likes} key={index} />
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

function Profile({user, username, follow})
{
  return (
    <div style={{margin: "2rem"}}>
      <h1>Profile: {user.username}</h1>
      <p>Followers: {user.followers}</p>
      <p>Following: {user.following.length}</p>

      {username && 
      <button className={user.isFollowing ? "btn btn-danger" : "btn btn-primary"} id={user.id} onClick={follow} disabled={user.username === username.username ? true : false}>{user.isFollowing ? "Unfollow": "Follow"}</button>}
    </div>
  )
}

function App()
{
  const [state, setState] = React.useState({
    user: null,
    profileUser: null,
    text: "",
    posts: null, 
    current: 1,
    numOfPages: 0,
    prev: false,
    next: false,
    currentView: "allposts"
    });

  const handleFollowing = () => {
    loadPosts("following", 0, 1);
  };

  const handleFollow = (e) => {
    fetch(`/follow/${parseInt(e.target.id)}`).then(r => r.json()).then(d => {
      console.log(d);
      loadPosts(state.currentView, state.profileUser ? state.profileUser.id : 0, state.current);})
      .catch(e => console.log(e));
  };
  const handleLogout = () => {
    fetch('/logout').then(r => r.json).then(_d => loadPosts('allpost', 0, 1));
  };
  const handleProfile = (e) => {
    loadPosts("profile", e.target.id, 1);
  };

  const handleAllPost = () => {
    loadPosts('allposts', 0, 1);
  };

  const handleLike = (e) => {
    console.log(e.target.id)
    fetch(`/like/${e.target.id}`).then(r => r.json()).then(_d => loadPosts(state.currentView,  state.profileUser ? state.profileUser.id : 0, state.current)).catch(e => console.log(e));
  };
  const loadPosts = (c, id, p) => {
    fetch(`/posts/${c}/${id}/${p}`)
    .then(r => r.json())
    .then(d => {
      console.log(d);
      setState({...state, profileUser: d.profileUser,  posts: d.posts, text: "", current: d.current, numOfPages: d.num, prev: d.prev, next: d.next, user: d.user, currentView: c})});
  };

  const handlePageChange = (e) => {
    loadPosts(state.currentView, state.profileUser ? state.profileUser.id : 0, parseInt(e.target.id));
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
      loadPosts(state.currentView,  0, state.current);
      setState({
        ...state,
        text: ""
      });
    })
    .catch(e => console.log(e));

  };

  React.useEffect(() => loadPosts(state.currentView, state.profileUser ? state.profileUser.id : 0, state.current), []);
  return (
    <>
      <Navbar following={handleFollowing} user={state.user} home={handleAllPost} profile={handleProfile} logout={handleLogout}/>
      {(state.currentView === 'allposts' && state.user) && <Form value={state.text} onChange={handleChange} onSubmit={handleSubmit}/>}
      {state.currentView === 'profile' && <Profile follow={handleFollow} user={state.profileUser} username={state.user}/>}
      <Page posts={() => loadPosts(state.currentView, state.profileUser ? state.profileUser.id : 0, state.current)} data={state.posts} title={state.currentView}  f={handleLike} profile={handleProfile}/>
      
      {state.numOfPages > 1 && 
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
