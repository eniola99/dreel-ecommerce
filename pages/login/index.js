import React, { useState } from 'react';
import { Spinner } from 'reactstrap';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { IoMdEye } from 'react-icons/io';
import { IoMdEyeOff } from 'react-icons/io';
import { toast } from 'react-hot-toast';

import { useStateContext } from '../../context/StateContext';

const Login = () => {
  const variables = {
    email: '',
    password: '',
    username: '',
    lastname: '',
    firstname: '',
    number: '',
    address: '',
    currency: '',
  };

  const router = useRouter();
  const { login } = useStateContext();

  const [formData, setFormData] = useState(variables);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const persistAccount = (data) => {
    login(data);
    toast.success(`${data.user.email} logged in.`);
    router.push('/');
    console.log({ data });
  };

  const handleChange = (value, attr) => {
    const form = { ...formData };
    form[attr] = value;
    setFormData(form);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (formData.email.length === 0 || formData.password.length === 0) {
      setError('Login fields are required');
      return;
    }
    try {
      const { email, password } = formData;
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.message) {
        toast.error(data.message);
        setLoading(false);
        return;
      }
      persistAccount(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className='route-back' onClick={() => router.push('/')}>
        <IoMdArrowRoundBack />
        <p>Go Back</p>
      </div>
      <div className='login-container'>
        <div className='column-left'>
          <form className='login-form' onSubmit={handleLogin}>
            <h2>Welcome Back</h2>
            <div className='form-group'>
              <input
                placeholder='Email'
                type='email'
                id='email'
                value={formData.email}
                onChange={(e) => handleChange(e.target.value, 'email')}
              />
            </div>
            <div className='form-group'>
              <div className='login-password'>
                <input
                  placeholder='Password'
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  value={formData.password}
                  onChange={(e) => handleChange(e.target.value, 'password')}
                />
                <span
                  className='login-password-icon'
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <IoMdEyeOff className='icon' />
                  ) : (
                    <IoMdEye className='icon' />
                  )}
                </span>
              </div>
              {error.length !== 0 && <p className='login-error'>{error}</p>}
            </div>
            <button type='submit' disabled={loading} className='login-button'>
              {loading && !error ? <Spinner /> : 'Login'}
            </button>
            <Link href='/register'>
              <div>
                <p className='signup-option'>Don't have an account? Signup</p>
              </div>
            </Link>
          </form>
        </div>
        <div className='column-right'>
          <div className='right-inner'>
            <div className='image-container'>
              <Image
                src='/assets/iphone14.jpeg'
                alt='iPhone 14'
                width={500}
                height={500}
                className='product-detail-image'
              />
            </div>
            <p className='logo-login'>Dreel Marketplace</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
