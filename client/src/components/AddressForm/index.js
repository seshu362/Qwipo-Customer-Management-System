import React, { useState, useEffect } from 'react';
import './index.css';

function AddressForm({ customerId, address, onSuccess, onCancel }) {
  const isEdit = Boolean(address);

  const [formData, setFormData] = useState({
    address_details: '',
    city: '',
    state: '',
    pin_code: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (address) {
      setFormData({
        address_details: address.address_details,
        city: address.city,
        state: address.state,
        pin_code: address.pin_code
      });
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.address_details.trim()) {
      newErrors.address_details = 'Address details are required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pin_code.trim()) {
      newErrors.pin_code = 'PIN code is required';
    } else if (!/^\d{6}$/.test(formData.pin_code)) {
      newErrors.pin_code = 'PIN code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setSubmitError('');

      const url = isEdit 
        ? `http://localhost:5000/api/addresses/${address.id}`
        : `http://localhost:5000/api/customers/${customerId}/addresses`;

      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setSubmitError(data.error);
      }
    } catch (err) {
      setSubmitError('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-form-container">
      <div className="address-form-header">
        <h3>{isEdit ? 'Edit Address' : 'Add New Address'}</h3>
        <button onClick={onCancel} className="close-button">×</button>
      </div>

      {submitError && <div className="error-message">{submitError}</div>}

      <form onSubmit={handleSubmit} className="address-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address_details">Address Details</label>
            <textarea
              id="address_details"
              name="address_details"
              value={formData.address_details}
              onChange={handleChange}
              rows="3"
              placeholder="Street address, building name, apartment number..."
              className={errors.address_details ? 'error' : ''}
            />
            {errors.address_details && <span className="field-error">{errors.address_details}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? 'error' : ''}
            />
            {errors.city && <span className="field-error">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={errors.state ? 'error' : ''}
            />
            {errors.state && <span className="field-error">{errors.state}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pin_code">PIN Code</label>
            <input
              type="text"
              id="pin_code"
              name="pin_code"
              value={formData.pin_code}
              onChange={handleChange}
              placeholder="6 digit PIN code"
              className={errors.pin_code ? 'error' : ''}
            />
            {errors.pin_code && <span className="field-error">{errors.pin_code}</span>}
          </div>
        </div>

        <div className="address-form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Saving...' : (isEdit ? 'Update Address' : 'Add Address')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddressForm;