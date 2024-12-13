import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './login/login';
import QuoteList from './quoteList/quoteList';
import QuoteCreation from './quoteCreation/quoteCreation';

const App = () => {
  // State to track whether the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token')?true:false);


  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/quoteList" /> : <Login />} />

          <Route path="/quoteList" element={isLoggedIn ? <QuoteList /> : <Navigate to="/login" />} />

          <Route path="/quoteCreation" element={isLoggedIn ? <QuoteCreation /> : <Navigate to="/login" />} />

          {/* Default Route */}
          <Route path="/" exact element={isLoggedIn ? <Navigate to="/quoteList" /> : <Navigate to="/login" />} />
         
        </Routes>
      </div>
    </Router>
  );
};

export default App;
