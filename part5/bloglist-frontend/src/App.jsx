import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./Components/Notification";
import CreateBlog from "./components/CreateBlog";
import Togglable from "./components/Togglable";
import "./App.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState([null, ""]);

  useEffect(() => {
    refreshBlogs();
    const localStorageUser = window.localStorage.getItem("loggedInUser");

    if (localStorageUser) {
      const user = JSON.parse(localStorageUser);
      setUser(user);
    }
  }, []);

  const refreshBlogs = () => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      blogService.setToken(user.token);
      setUser(user);
      showNotification(`${user.name} logged in`, "green");
      setUsername("");
      setPassword("");
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
    } catch (exception) {
      showNotification(`Wrong username or password`, "red");
      console.log("[debug] exception", exception);
    }
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedInUser");
  };

  const showNotification = (message, color) => {
    setNotification([message, color]);
    setTimeout(() => {
      setNotification([null, ""]);
    }, 5000);
  };

  if (user === null) {
    return (
      <div>
        <Notification message={notification} />

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
        <Notification message={notification} />
        <h3>
          {user.name} logged in <button onClick={logout}>logout</button>
        </h3>

        <Togglable buttonLabel="Create new blog">
          <CreateBlog
            refreshBlogs={refreshBlogs}
            showNotification={showNotification}
            logout={logout}
          />
        </Togglable>
        <br />
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} refreshBlogs={refreshBlogs} />
        ))}
      </div>
    );
  }
};

export default App;
