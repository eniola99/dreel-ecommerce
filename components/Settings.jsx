import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Settings = () => {
  const variables = {
    currency: '',
    password: '',
    number: '',
  };
  const [userAccount, setUserAccount] = useState();
  const [formData, setFormData] = useState(variables);

  // console.log({ userAccount, formData });
  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setUserAccount(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (userAccount) {
      setFormData((prev) => ({
        ...prev,
        currency: userAccount.user.currency,
        number: userAccount.user.number,
      }));
    }
    return () => {
      setFormData({});
    };
  }, [userAccount]);

  const handleSubmit = () => {
    console.log('line 21');
  };

  const handleChange = (value, attr) => {
    const form = { ...formData };
    form[attr] = value;
    setFormData(form);
  };

  const currencyData = [
    {
      code: 'ngn',
      name: '(NGN) Naira',
    },
    {
      code: 'usd',
      name: '(US) US Dollars',
    },
    {
      code: 'cad',
      name: '(CAD) CAD Dollars',
    },
    {
      code: 'eu',
      name: '(EU) Euro',
    },
  ];

  return (
    <>
      <div className='settings-heading'>
        <h2>Account Settings</h2>
      </div>
      <div className='user-card'>
        <div className='user-info'>
          <span className='user-name'>
            {userAccount?.user.firstname} {userAccount?.user.lastname}
          </span>
          <span className='user-email'>{userAccount?.user.email}</span>
        </div>
        <div className='status'>
          <span className='status-text'>
            {userAccount?.user.verified ? <p>verified</p> : <p>unverified</p>}
          </span>
        </div>
      </div>
      <div className='verify-button'>
        <Link href='/verify/resend'>
          <button>Click here to verify</button>
        </Link>
      </div>
      <div className='update-form'>
        <form className='imei-form' onSubmit={handleSubmit}>
          <p>Update Account</p>
          <div className='form-group'>
            <label className='auth__label' htmlFor='currency'>
              Select Currency
            </label>
            <select
              name='currency'
              id='currency'
              onChange={(e) => handleChange(e.target.value, 'curency')}
            >
              <option value=''>{formData.currency}</option>
              {currencyData &&
                currencyData.map((item) => (
                  <>
                    <option key={item._id} value={item.code}>
                      {item.name}
                    </option>
                  </>
                ))}
            </select>
          </div>
          <div className='form-group'>
            <label className='auth__label' htmlFor='number'>
              Phone Number
            </label>
            <input
              placeholder='Number'
              type='text'
              id='number'
              value={formData.number}
              onChange={(e) => handleChange(e.target.value, 'number')}
            />
          </div>
          <div className='form-group'>
            <label className='auth__label' htmlFor='password'>
              Password
            </label>
            <input
              placeholder='New Password'
              type='password'
              id='password'
              value={formData.password}
              onChange={(e) => handleChange(e.target.value, 'password')}
            />
          </div>

          <button type='submit' className='login-button'>
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default Settings;
