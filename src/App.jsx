import React, { useEffect } from 'react';

// External
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Core
import Scroll from './core/Scroll';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const App = () => {
  useEffect(() => {}, []);

  return (
    <div className="app">
      <Router>
        <Scroll>
          <Routes>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Scroll>
      </Router>
    </div>
  );
};

export default App;
