import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';
import CustomerForm from './components/CustomerForm';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Customer Management System</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/customers/:id/edit" element={<CustomerForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
