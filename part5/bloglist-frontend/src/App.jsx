import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
    const localStorageUser = window.localStorage.getItem("loggedInUser");

    if (localStorageUser) {
      const user = JSON.parse(localStorageUser);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
    } catch (exception) {
      console.log("[debug] exception", exception);
      // setErrorMessage("Wrong credentials");
      setTimeout(() => {
        // setErrorMessage(null);
      }, 5000);
    }
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedInUser");
  };

  const createBlog = async (e) => {
    e.preventDefault();

    const newBlog = {
      title: title,
      author: author,
      url: url,
    };

    const response = await blogService.create(newBlog);
    if (response != null) {
      await blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <h3>
          {user.name} logged in <button onClick={logout}>logout</button>
        </h3>
        <h2>Create new</h2>
        <form onSubmit={createBlog}>
          <div>
            Title:
            <input
              type="text"
              value={title}
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            Author:
            <input
              type="text"
              value={author}
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url:
            <input
              type="text"
              value={url}
              name="url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
        <br />
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    );
  }
};

export default App;
