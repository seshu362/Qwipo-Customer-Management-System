import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [cities, setCities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
    fetchCities();
  }, [currentPage, search, cityFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });

      if (search) params.append('search', search);
      if (cityFilter) params.append('city', cityFilter);

      const response = await fetch(`http://localhost:5000/api/customers?${params}`);
      const data = await response.json();

      if (response.ok) {
        setCustomers(data.data);
        setTotalPages(data.pagination.total_pages);
        setError('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cities');
      const data = await response.json();
      if (response.ok) {
        setCities(data.data);
      }
    } catch (err) {
      console.log('Failed to fetch cities');
    }
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/customers/${customerId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchCustomers();
        } else {
          const data = await response.json();
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to delete customer');
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomers();
  };

  return (
    <div className="customer-list">
      <div className="customer-list-header">
        <h2>Customers</h2>
        <Link to="/customers/new" className="add-button">Add New Customer</Link>
      </div>

      <div className="filters">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>

        <select
          value={cityFilter}
          onChange={(e) => {
            setCityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="city-filter"
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading customers...</div>
      ) : (
        <>
          <div className="customer-table">
            <div className="table-header">
              <div>Name</div>
              <div>Phone</div>
              <div>Addresses</div>
              <div>Actions</div>
            </div>
            {customers.length === 0 ? (
              <div className="no-data">No customers found</div>
            ) : (
              customers.map(customer => (
                <div key={customer.id} className="table-row">
                  <div className="customer-name">
                    {customer.first_name} {customer.last_name}
                  </div>
                  <div className="customer-phone">{customer.phone_number}</div>
                  <div className="address-count">{customer.address_count} addresses</div>
                  <div className="actions">
                    <Link to={`/customers/${customer.id}`} className="view-button">View</Link>
                    <Link to={`/customers/${customer.id}/edit`} className="edit-button">Edit</Link>
                    <button 
                      onClick={() => handleDelete(customer.id)} 
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="page-button"
            >
              Previous
            </button>
            <span className="page-info">Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="page-button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CustomerList;