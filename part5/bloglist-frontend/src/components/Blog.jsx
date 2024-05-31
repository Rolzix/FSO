import React, { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, refreshBlogs }) => {
  const [visible, setVisible] = useState(false);

  const viewDetails = () => {
    setVisible(!visible);
  };

  const addLike = async () => {
    const updatedBlog = {
      _id: blog.id,
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };

    // console.log("[debug] updatedBlog", updatedBlog);

    try {
      const response = await blogService.update(blog.id, updatedBlog);
      console.log("[debug] response", response);
      if (response) {
        refreshBlogs();
      }
    } catch (error) {
      console.log("[debug] trying to update blog error", error);
    }
  };

  return (
    <div className="blog">
      {blog.title ? blog.title : "Unknown title"}{" "}
      {blog.author ? blog.author : "Unknown author"}
      <button onClick={viewDetails}> {visible ? "hide" : "show"}</button>
      <div className={visible ? "" : "hidden"}>
        {blog.url} <br />
        {blog.likes} likes <button onClick={addLike}>like</button> <br />
        {blog.user ? blog.user.name : "Unknown user"} <br />
      </div>
    </div>
  );
};
export default Blog;
