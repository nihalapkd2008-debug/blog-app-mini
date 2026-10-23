
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { BlogContext } from "./BlogContext";

const API = "http://localhost:3000/blogs";

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState([]);

  // READ: Fetch all blogs
  const fetchBlogs = useCallback(async () => {
    try {
      const response = await axios.get(API);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  }, []);

  // Fetch blogs when the provider loads
 
useEffect(() => {
  let ignore = false;

  const loadBlogs = async () => {
    try {
      const response = await axios.get(API);

      if (!ignore) {
        setBlogs(response.data);
      }
    } catch (error) {
      if (!ignore) {
        console.error("Error fetching blogs:", error);
      }
    }
  };

  loadBlogs();

  return () => {
    ignore = true;
  };
}, []);


  // CREATE: Add a new blog
  const addBlog = async (newBlog) => {
    try {
      const response = await axios.post(API, newBlog);

      setBlogs((previousBlogs) => [
        ...previousBlogs,
        response.data,
      ]);

      return response.data;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  };

  // UPDATE: Edit an existing blog
  const updateBlog = async (id, updatedBlog) => {
    try {
      const response = await axios.put(
        `${API}/${id}`,
        updatedBlog
      );

      setBlogs((previousBlogs) =>
        previousBlogs.map((blog) =>
          String(blog.id) === String(id)
            ? response.data
            : blog
        )
      );

      return response.data;
    } catch (error) {
      console.error("Error updating blog:", error);
      throw error;
    }
  };

  // DELETE: Remove a blog
  const deleteBlog = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);

      setBlogs((previousBlogs) =>
        previousBlogs.filter(
          (blog) => String(blog.id) !== String(id)
        )
      );
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw error;
    }
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        setBlogs,
        fetchBlogs,
        addBlog,
        updateBlog,
        deleteBlog,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}
