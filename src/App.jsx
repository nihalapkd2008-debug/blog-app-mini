
import { useContext, useState } from "react";
import {
  Link,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";
import { BlogContext } from "./context/BlogContext";

function Blogs() {
  const { blogs, deleteBlog } = useContext(BlogContext);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (confirmDelete) {
      try {
        await deleteBlog(id);
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Could not delete the blog.");
      }
    }
  };

  return (
    <div className="container">
      <h2>All Blogs</h2>

      {blogs.length === 0 ? (
        <p>No blogs yet. Create your first blog!</p>
      ) : (
        blogs.map((blog) => (
          <div className="blog-card" key={blog.id}>
            <h3>{blog.title}</h3>
            <p>{blog.body}</p>

            <div className="actions">
              <Link to={`/blogs/${blog.id}`}>Read More</Link>

              <Link to={`/blogs/${blog.id}`}>Edit</Link>

              <button
                className="delete-button"
                onClick={() => handleDelete(blog.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function CreateBlog() {
  const { addBlog } = useContext(BlogContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !body.trim()) {
      alert("Please enter both title and body.");
      return;
    }

    try {
      await addBlog({
        title: title.trim(),
        body: body.trim(),
      });

      navigate("/blogs");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Could not create the blog.");
    }
  };

  return (
    <div className="container">
      <h2>Create Blog</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter blog title"
          required
        />

        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write your blog here"
          rows="6"
          required
        />

        <button type="submit">Create Blog</button>
      </form>
    </div>
  );
}

function BlogDetails() {
  const { id } = useParams();
  const { blogs, updateBlog } = useContext(BlogContext);

  const blog = blogs.find(
    (item) => String(item.id) === id
  );

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  if (!blog) {
    return (
      <div className="container">
        <p>Blog not found.</p>
        <Link to="/blogs">Back to Blogs</Link>
      </div>
    );
  }

  const startEditing = () => {
    setTitle(blog.title);
    setBody(blog.body);
    setIsEditing(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!title.trim() || !body.trim()) {
      alert("Please enter both title and body.");
      return;
    }

    try {
      await updateBlog(blog.id, {
        title: title.trim(),
        body: body.trim(),
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Could not update the blog.");
    }
  };

  return (
    <div className="container">
      {isEditing ? (
        <>
          <h2>Edit Blog</h2>

          <form onSubmit={handleUpdate}>
            <label htmlFor="edit-title">Title</label>
            <input
              id="edit-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />

            <label htmlFor="edit-body">Body</label>
            <textarea
              id="edit-body"
              rows="6"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              required
            />

            <button type="submit">Save Changes</button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        </>
      ) : (
        <>
          <h2>{blog.title}</h2>
          <p>{blog.body}</p>

          <div className="actions">
            <button onClick={startEditing}>Edit Blog</button>
            <Link to="/blogs">Back to Blogs</Link>
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <header className="header">
        <h1>My Blog App</h1>

        <nav>
          <Link to="/blogs">All Blogs</Link>
          <Link to="/createblog">Create Blog</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/createblog" element={<CreateBlog />} />
      </Routes>
    </div>
  );
}

export default App;
