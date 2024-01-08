// App.js
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import MetadataTable from './MetadataTable';
import DataGrid from './DataGrid';
import LibraryTabs from './LibraryTabs';
import LoginPage from './LoginPage';

function Home({ username }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <div>
        <input 
          type="text" 
          placeholder="Search for a date..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <h2>Welcome, {username}!</h2>
      <MetadataTable searchQuery={searchQuery} />
    </div>
  );
}

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setUsername(user);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <Router>
      <div>
        {/* Navigation */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <Link to="/datagrid">DataGrid</Link>
                </li>
                <li>
                  <Link to="/librarytabs">Library Tabs</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Home username={username} /> : <Navigate to="/login" />}
          />
          <Route
            path="/datagrid"
            element={isLoggedIn ? <DataGrid /> : <Navigate to="/login" />}
          />
          <Route
            path="/librarytabs"
            element={isLoggedIn ? <LibraryTabs /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={<LoginPage onLogin={handleLogin} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

