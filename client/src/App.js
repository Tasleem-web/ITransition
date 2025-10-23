import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import HomePage from './components/HomePage';
import TablePage from "./components/TablePage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/table" element={<TablePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
