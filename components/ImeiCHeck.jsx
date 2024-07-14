import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Spinner } from 'reactstrap';
import getStripe from '../lib/getStripe';

const ImeiCHeck = ({ categories }) => {
  const variables = {
    type: '',
    sn: '',
    notes: '',
  };

  const [formData, setFormData] = useState(variables);
  const [error, setError] = useState('');
  const [userAccount, setUserAccount] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setUserAccount(JSON.parse(storedUser));
    }
  }, []);

  const onSuccess = (data) => {
    setLoading(false);
    toast.success(`${data.message}`);
  };
  // onSuccess(data);

  const handleChange = (value, attr) => {
    const form = { ...formData };
    form[attr] = value;
    setFormData(form);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.sn.length === 0 || formData.type.length === 0)
      return setError('serial number and service field is required');

    const stripe = await getStripe();
    const { type, sn, notes } = formData;
    const { user } = userAccount;
    const response = await fetch('/api/unlockRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, sn, notes, user, categories }),
    });
    if (response.statusCode === 500) return;
    const data = await response.json();

    toast.loading('Redirecting...');
    await stripe.redirectToCheckout({ sessionId: data.id });
    toast.error(`${data.message}`);
  };

  return (
    <div>
      <div className='imei-container'>
        <form className='imei-form' onSubmit={handleSubmit}>
          <p>IMEI CHECK</p>
          <div className='form-group'>
            <select
              name='service'
              id='service'
              onChange={(e) => handleChange(e.target.value, 'type')}
            >
              <option value=''>Select a Service</option>
              {categories &&
                categories.map((item) => (
                  <>
                    <option key={item._id} value={item.title}>
                      {item.title}
                    </option>
                  </>
                ))}
            </select>
            {categories &&
              categories
                .filter((item) => item.title === formData.type)
                .map((itemPrice) => (
                  <span className='login-error'>${itemPrice.price}.00</span>
                ))}
          </div>
          <div className='form-group'>
            <input
              placeholder='SN'
              type='text'
              id='sn'
              value={formData.sn}
              onChange={(e) => handleChange(e.target.value, 'sn')}
            />
          </div>
          <div className='form-group'>
            <input
              placeholder='Additional Notes'
              type='text'
              id='notes'
              value={formData.notes}
              onChange={(e) => handleChange(e.target.value, 'notes')}
            />
          </div>
          {error.length !== 0 && <span className='login-error'>{error}</span>}
          <button type='submit' className='login-button'>
            {loading && error.length === 0 ? <Spinner /> : 'Submit'}
          </button>
        </form>

        <form className='imei-form' onSubmit={handleSubmit}>
          <p>IMEI CHECK</p>
          <div className='form-group'>
            <select name='service' id='service' placeholder='Choose a Service'>
              <option value='volvo'>hauwei unlock</option>
              <option value='saab'>Samsung unlock</option>
              <option value='mercedes'>iPhone unlock</option>
              <option value='audi'>other</option>
            </select>
          </div>
          <div className='form-group'>
            <input
              placeholder='SN'
              type='text'
              id='sn'
              value={variables.sn}
              onChange={(e) => handleChange(e.target.value, 'sn')}
            />
          </div>
          <div className='form-group'>
            <input
              placeholder='Additional Notes'
              type='text'
              id='notes'
              value={variables.notes}
              onChange={(e) => handleChange(e.target.value, 'notes')}
            />
            {/* {error.length !== 0 && <p className='login-error'>{error}</p>} */}
          </div>
          <button type='submit' className='login-button'>
            {/* {loading ? <Spinner /> : 'Login'} */}Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImeiCHeck;
