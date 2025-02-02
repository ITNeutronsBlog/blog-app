import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPosts();
    const token = localStorage.getItem('token');
    if (token) setUser(true);
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get('/api/posts');
    setPosts(res.data);
  };

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        {user ? (
          <Link to="/create">Create Post</Link>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>

      <Route path="/" exact render={() => (
        <div>
          {posts.map(post => (
            <div key={post._id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <small>{new Date(post.date).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )} />

      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/create" component={CreatePost} />
    </Router>
  );
};

const Login = ({ history }) => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', form);
      localStorage.setItem('token', res.data);
      history.push('/');
      window.location.reload();
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  );
};

const Register = ({ history }) => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/register', form);
      history.push('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Register</button>
    </form>
  );
};

const CreatePost = ({ history }) => {
  const [form, setForm] = useState({ title: '', content: '' });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/posts', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      history.push('/');
    } catch (err) {
      alert('Post creation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        onChange={e => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        placeholder="Content"
        onChange={e => setForm({ ...form, content: e.target.value })}
      />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default App;