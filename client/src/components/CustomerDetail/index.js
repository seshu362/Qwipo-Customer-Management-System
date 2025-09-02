import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AddressList from '../AddressList';
import AddressForm from '../AddressForm';
import './index.css';

function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/customers/${id}`);
      const data = await response.json();

      if (response.ok) {
        setCustomer(data.data);
        setError('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch customer details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressAdded = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    fetchCustomerDetails();
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/addresses/${addressId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchCustomerDetails();
        } else {
          const data = await response.json();
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to delete address');
      }
    }
  };

  if (loading) return <div className="loading">Loading customer details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!customer) return <div className="error-message">Customer not found</div>;

  return (
    <div className="customer-detail">
      <div className="customer-detail-header">
        <Link to="/customers" className="back-button">← Back to Customers</Link>
        <Link to={`/customers/${id}/edit`} className="edit-customer-button">Edit Customer</Link>
      </div>

      <div className="customer-info">
        <h2>{customer.first_name} {customer.last_name}</h2>
        <p className="phone-number">{customer.phone_number}</p>
        <p className="created-date">Customer since: {new Date(customer.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="addresses-section">
        <div className="addresses-header">
          <h3>Addresses ({customer.addresses.length})</h3>
          <button 
            onClick={() => setShowAddressForm(true)} 
            className="add-address-button"
          >
            Add Address
          </button>
        </div>

        {showAddressForm && (
          <AddressForm
            customerId={id}
            address={editingAddress}
            onSuccess={handleAddressAdded}
            onCancel={() => {
              setShowAddressForm(false);
              setEditingAddress(null);
            }}
          />
        )}

        <AddressList
          addresses={customer.addresses}
          onEdit={handleEditAddress}
          onDelete={handleDeleteAddress}
        />
      </div>
    </div>
  );
}

export default CustomerDetail;