import React, { useState } from 'react';
import { Spinner } from 'reactstrap';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { IoMdEye } from 'react-icons/io';
import { IoMdEyeOff } from 'react-icons/io';
import { toast } from 'react-hot-toast';

const Register = () => {
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

  const [formData, setFormData] = useState(variables);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const currencyData = [
    {
      id: 1,
      code: 'usd',
      name: '(US) US Dollars',
    },
    {
      id: 0,
      code: 'ngn',
      name: '(NGN) Naira',
    },
    {
      id: 2,
      code: 'cad',
      name: '(CAD) CAD Dollars',
    },
    {
      id: 3,
      code: 'eu',
      name: '(EU) Euro',
    },
  ];

  const router = useRouter();
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.email.length === 0 || formData.password.length === 0) {
      setError('All register fields are required');
      return;
    }
    setLoading(true);
    try {
      const {
        email,
        password,
        lastname,
        firstname,
        address,
        number,
        username,
        currency,
      } = formData;
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          lastname,
          firstname,
          address,
          username,
          number,
          currency,
        }),
      });
      const data = await response.json();
      if (data.status === 401) {
        toast.error(data.message);
        return;
      } else {
        toast.error(
          `${data.message} check your mail for welcome message and proceed to login`
        );
        router.push('/verify');
      }
      console.log({ data });
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (value, attr) => {
    const form = { ...formData, [attr]: value };
    setFormData(form);
  };

  return (
    <>
      <div className='route-back' onClick={() => router.push('/')}>
        <IoMdArrowRoundBack />
        <p>Go Back</p>
      </div>
      <div className='login-container'>
        <div className='column-left'>
          <form className='login-form' onSubmit={handleRegister}>
            <h2>Register</h2>
            <div className='form-group'>
              <input
                placeholder='Lastname'
                type='text'
                id='lastname'
                value={formData.lastname}
                onChange={(e) => handleChange(e.target.value, 'lastname')}
              />
            </div>
            <div className='form-group'>
              <input
                placeholder='Firstname'
                type='text'
                id='firstname'
                value={formData.firstname}
                onChange={(e) => handleChange(e.target.value, 'firstname')}
              />
            </div>
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
              <input
                placeholder='Username'
                type='text'
                id='username'
                value={formData.username}
                onChange={(e) => handleChange(e.target.value, 'username')}
              />
            </div>
            <div className='form-group'>
              <input
                placeholder='Phone Number'
                type='string'
                id='phone'
                value={formData.number}
                onChange={(e) => handleChange(e.target.value, 'number')}
              />
            </div>
            <div className='form-group'>
              <input
                placeholder='Address'
                type='text'
                id='address'
                value={formData.address}
                onChange={(e) => handleChange(e.target.value, 'address')}
              />
            </div>
            <div className='select-container'>
              <select
                name='currency'
                id='currency'
                onChange={(e) => handleChange(e.target.value, 'currency')}
              >
                <option value=''>Select Currency</option>
                {currencyData.map((item) => (
                  <option key={item.id} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
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
            <button type='submit' className='login-button'>
              {loading ? <Spinner /> : 'Register'}
            </button>
            <Link href='/login'>
              <div>
                <p className='signup-option'>Already have an account? Login</p>
              </div>
            </Link>
          </form>
        </div>
        <div className='column-right'>
          <div className='column-right'>
            <div className='right-inner'>
              <div className='image-container'>
                <Image
                  src='/assets/iwatch1.jpeg'
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
      </div>
    </>
  );
};

export default Register;
