import React, { useState } from "react";

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);

  const viewDetails = () => {
    setVisible(!visible);
  };
  return (
    <div className="blog">
      {blog.title ? blog.title : "Unknown title"}{" "}
      {blog.author ? blog.author : "Unknown author"}
      <button onClick={viewDetails}> {visible ? "hide" : "show"}</button>
      <div className={visible ? "" : "hidden"}>
        {blog.url} <br />
        {blog.likes} likes <button>like</button> <br />
        {blog.user ? blog.user.name : "Unknown user"} <br />
      </div>
    </div>
  );
};
export default Blog;
