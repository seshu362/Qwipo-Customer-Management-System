import React from 'react';
import './index.css';

function AddressList({ addresses, onEdit, onDelete }) {
  if (!addresses || addresses.length === 0) {
    return <div className="no-addresses">No addresses found</div>;
  }

  return (
    <div className="address-list">
      {addresses.map(address => (
        <div key={address.id} className="address-card">
          <div className="address-content">
            <div className="address-details">{address.address_details}</div>
            <div className="address-location">
              {address.city}, {address.state} - {address.pin_code}
            </div>
            <div className="address-date">
              Added on: {new Date(address.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="address-actions">
            <button onClick={() => onEdit(address)} className="edit-address-button">
              Edit
            </button>
            <button onClick={() => onDelete(address.id)} className="delete-address-button">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AddressList;