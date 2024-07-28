import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Spinner } from 'reactstrap';
import dateFormat from 'dateformat';
import getStripe from '../lib/getStripe';

const ImeiCHeck = ({ categories, result, pendingResult, cancelledResult }) => {
  const variables = {
    type: '',
    imei: '',
    sn: '',
    notes: '',
  };

  const [formData, setFormData] = useState(variables);
  const [error, setError] = useState('');
  const [userAccount, setUserAccount] = useState();
  const [loading, setLoading] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setUserAccount(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (result || cancelledResult || pendingResult) {
      const combinedArray = [
        ...(result || []),
        ...(cancelledResult || []),
        ...(pendingResult || []),
      ];
      setTransactionDetails(combinedArray);
    }
  }, [result, cancelledResult, pendingResult]);

  const handleChange = (value, attr) => {
    const form = { ...formData };
    form[attr] = value;
    setFormData(form);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (
      formData.sn.length === 0 ||
      formData.type.length === 0 ||
      formData.imei.length === 0
    )
      return setError(
        'serial number, service type and imei fields is required'
      );

    const stripe = await getStripe();
    const { type, sn, notes, imei } = formData;
    const { user } = userAccount;
    const response = await fetch('/api/unlockRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, sn, imei, notes, user, categories }),
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
              placeholder='IMEI'
              type='text'
              id='imei'
              value={formData.imei}
              onChange={(e) => handleChange(e.target.value, 'imei')}
            />
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

        <div className='transaction-info'>
          <p>Transaction Details</p>
          {transactionDetails ? (
            transactionDetails
              .map((item) => (
                <div className='announcement-item' key={item._id}>
                  <div className='transaction-name'>
                    <p>{item.type}</p>
                    <span>
                      {item.completed ? (
                        'completed'
                      ) : item.completed === false ? (
                        <span className='transaction-cancel'>cancelled</span>
                      ) : (
                        <span className='transaction-pending'>pending</span>
                      )}
                    </span>
                  </div>
                  <span>{dateFormat(item._createdAt)}</span>
                  <hr />
                </div>
              ))
              .reverse()
          ) : (
            <div className='announcement-spinner'>
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImeiCHeck;
