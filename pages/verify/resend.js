import React, { useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useRouter } from 'next/router';

const resend = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email });
  };

  const handleChange = (value, attr) => {
    setEmail(value);
  };
  return (
    <>
      <div className='verify-container'>
        <div className='products-heading'>
          <h2>VERIFY YOUR ACCOUNT</h2>
        </div>
        <div className='route-back' onClick={() => router.push('/')}>
          <IoMdArrowRoundBack />
          <p>Go To Homepage</p>
        </div>
        <div className='verify-component'>
          <h1 className='verify-message'>
            Input your email to send a 6 digit code. <br />
          </h1>
          <div className='verify-form-container'>
            <form className='verify-form' onSubmit={handleSubmit}>
              <div className='form-group'>
                <input
                  type='text'
                  placeholder='email'
                  id='email'
                  value={email}
                  onChange={(e) => handleChange(e.target.value)}
                  required
                />
              </div>
              <button type='submit' className='login-button'>
                Send Code
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default resend;
