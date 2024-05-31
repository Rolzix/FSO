import blogService from "../services/blogs";
import { useState } from "react";

const CreateBlog = ({ setBlogs, showNotification, logout }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const handleCreateBlog = async (e) => {
    e.preventDefault();

    const newBlog = {
      title: title,
      author: author,
      url: url,
    };

    try {
      const response = await blogService.create(newBlog);
      console.log("[debug] response", response);
      if (response) {
        const allBlogs = await blogService.getAll();
        console.log("[debug] updating all blogs");
        setBlogs(allBlogs);
        showNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`,
          "green"
        );
      }
    } catch (error) {
      console.log("[debug] error", error);
      if (error.status === 401) {
        logout();
        showNotification(`Unauthorized, Please log in`, "red");
      }
      if (error.response.data) {
        showNotification(`${error.response.data["error"]}`, "red");
      }
    }
  };
  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          Title:
          <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <br />
        <div>
          Author:
          <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <br />
        <div>
          url:
          <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <br />
        <button type="submit">post new blog entry</button>
        <br />
      </form>
      <br />
    </div>
  );
};

export default CreateBlog;
