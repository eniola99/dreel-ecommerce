import Link from 'next/link';
import React, { useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Spinner } from 'reactstrap';

const index = () => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const handleRedirect = (data) => {
    setLoading(false);
    toast.error(`${data.message}`);
    setVerified(true);
  };

  console.log({ verified });
  const handleSubmit = async (e) => {
    setError('');
    e.preventDefault();
    if (code.length === 0) {
      setError('Please input a valid code');
      return;
    }
    setLoading(true);
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data?.status === 201) {
      handleRedirect(data);
      return;
    } else {
      toast.error(`${data.message}`);
      setLoading(false);
    }
  };

  const handleChange = (value) => {
    setCode(value);
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
        {verified ? (
          <>
            <div className='verify-component'>
              <h1 className='verify-message'>
                Your account as been verified. <br />
                <Link href='/login'>
                  <span className='resend-link'>Proceed toLogin</span>
                </Link>
              </h1>
            </div>
          </>
        ) : (
          <div className='verify-component'>
            <h1 className='verify-message'>
              A 6 digit pin as been sent to your provided mail. <br />
              <Link href='/verify/resend'>
                <span className='resend-link'>click to resend</span>
              </Link>
            </h1>
            <div className='verify-form-container'>
              <form className='verify-form' onSubmit={handleSubmit}>
                <div className='form-group'>
                  <input
                    type='text'
                    placeholder='6 digit code'
                    id='code'
                    value={code}
                    onChange={(e) => handleChange(e.target.value)}
                    autoComplete='off'
                  />
                  {error.length !== 0 && <p className='login-error'>{error}</p>}
                </div>
                <button type='submit' className='login-button'>
                  {loading ? <Spinner /> : 'Verify'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default index;
