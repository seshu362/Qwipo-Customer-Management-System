import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './index.css';

function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchCustomer();
    }
  }, [id, isEdit]);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/customers/${id}`);
      const data = await response.json();

      if (response.ok) {
        setFormData({
          first_name: data.data.first_name,
          last_name: data.data.last_name,
          phone_number: data.data.phone_number
        });
      } else {
        setSubmitError(data.error);
      }
    } catch (err) {
      setSubmitError('Failed to fetch customer details');
    }
  };

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

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must be 10 digits';
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
        ? `http://localhost:5000/api/customers/${id}`
        : 'http://localhost:5000/api/customers';

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
        navigate(isEdit ? `/customers/${id}` : '/customers');
      } else {
        setSubmitError(data.error);
      }
    } catch (err) {
      setSubmitError('Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-form-container">
      <div className="form-header">
        <Link to={isEdit ? `/customers/${id}` : '/customers'} className="back-button">
          ← Back
        </Link>
        <h2>{isEdit ? 'Edit Customer' : 'Add New Customer'}</h2>
      </div>

      {submitError && <div className="error-message">{submitError}</div>}

      <form onSubmit={handleSubmit} className="customer-form">
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={errors.first_name ? 'error' : ''}
          />
          {errors.first_name && <span className="field-error">{errors.first_name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={errors.last_name ? 'error' : ''}
          />
          {errors.last_name && <span className="field-error">{errors.last_name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="10 digit phone number"
            className={errors.phone_number ? 'error' : ''}
          />
          {errors.phone_number && <span className="field-error">{errors.phone_number}</span>}
        </div>

        <div className="form-actions">
          <Link 
            to={isEdit ? `/customers/${id}` : '/customers'} 
            className="cancel-button"
          >
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Saving...' : (isEdit ? 'Update Customer' : 'Create Customer')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;