import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css';

//Components
import NavBar from './global/navBar';
import Unauthorized from './pages/unauthorized/unauthorized';
import PageNotFound from './pages/404/PageNotFound';
import Login from './pages/login/login';
import Home from './pages/home/home';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* Public */}
        <Route path='/' element={<Login />}></Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<PageNotFound />} />

        {/* To protect */}
        <Route path='/home' element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
