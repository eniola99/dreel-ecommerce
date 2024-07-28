import React, { useState, useEffect } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

const resend = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [userAccount, setUserAccount] = useState();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setUserAccount(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    setEmail(userAccount?.user.email);
  }, [userAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { _id } = userAccount.user;
    const response = await fetch('/api/resend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        _id,
      }),
    });
    const data = await response.json();
    if (data.status === 404) {
      toast.error(data.message);
      return;
    } else {
      toast.success(data.message);
      return;
    }
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
                  disabled
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
