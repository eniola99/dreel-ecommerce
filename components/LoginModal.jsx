import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import { Spinner } from 'reactstrap';
import { toast } from 'react-hot-toast';
import { MdOutlineAccountCircle } from 'react-icons/md';

import { useStateContext } from '../context/StateContext';

const LoginModal = ({ rerender }) => {
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
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState(variables);
  const [error, setError] = useState('');
  const [loginScreen, setLoginScreen] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login, currentUser } = useStateContext();

  const openModal = () => {
    if (!currentUser) return setModal(true);
    router.push('/account');
  };
  const closeModal = () => {
    setModal(false);
    setFormData(variables);
    setError('');
    setLoginScreen(true);
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

  const persistAccount = (data) => {
    login(data);
    rerender();
    toast.success(`${data.user.email} logged in.`);
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
      closeModal();
    } catch (error) {
      console.error(error.response);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (formData.email.length === 0 || formData.password.length === 0) {
      setError('All register fields are required');
      return;
    }
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
      toast.error(data.message);
      setLoading(false);
      switchScreen();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (value, attr) => {
    const form = { ...formData };
    form[attr] = value;
    setFormData(form);
  };

  const switchScreen = () => {
    setLoginScreen(!loginScreen);
    setFormData(variables);
  };

  return (
    <div>
      <div className='account' onClick={openModal}>
        <MdOutlineAccountCircle size={22} />
      </div>

      {loginScreen ? (
        <Modal
          ariaHideApp={false}
          isOpen={modal}
          onRequestClose={closeModal}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
            },
          }}
        >
          <div className=''>
            <div className='login-container'>
              <form className='login-form' onSubmit={handleLogin}>
                <h2>Welcome Back</h2>
                <div className='form-group'>
                  <input
                    placeholder='Username or Email'
                    type='email'
                    id='email'
                    value={formData.email}
                    onChange={(e) => handleChange(e.target.value, 'email')}
                  />
                </div>
                <div className='form-group'>
                  <input
                    placeholder='Password'
                    type='password'
                    id='password'
                    value={formData.password}
                    onChange={(e) => handleChange(e.target.value, 'password')}
                  />
                  {error.length !== 0 && <p className='login-error'>{error}</p>}
                </div>
                <button
                  type='submit'
                  disabled={loading}
                  className='login-button'
                >
                  {loading ? <Spinner /> : 'Login'}
                </button>
                <div onClick={switchScreen}>
                  <p className='signup-option'>Don't have an account? Signup</p>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      ) : (
        <Modal
          ariaHideApp={false}
          isOpen={modal}
          onRequestClose={closeModal}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
            },
          }}
        >
          <div className=''>
            <div className='login-container'>
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
                    type='number'
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
                <div className='form-group'>
                  <select
                    name='currency'
                    id='currency'
                    onChange={(e) => handleChange(e.target.value, 'currency')}
                  >
                    <option value=''>Select a Currency</option>
                    {currencyData.map((item) => (
                      <>
                        <option key={item._id} value={item.code}>
                          {item.name}
                        </option>
                      </>
                    ))}
                  </select>
                </div>
                <div className='form-group'>
                  <input
                    placeholder='Password'
                    type='password'
                    id='password'
                    value={formData.password}
                    onChange={(e) => handleChange(e.target.value, 'password')}
                  />
                  {error.length !== 0 && <p className='login-error'>{error}</p>}
                </div>
                <button type='submit' className='login-button'>
                  {loading ? <Spinner /> : 'Register'}
                </button>
                <div onClick={switchScreen}>
                  <p className='signup-option'>
                    Already have an account? Login
                  </p>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LoginModal;
