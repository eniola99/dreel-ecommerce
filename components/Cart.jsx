import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';
import Modal from 'react-modal';

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';

const Cart = () => {
  const cartRef = useRef();
  const [userAccount, setUserAccount] = useState();
  const [modal, setModal] = useState(false);

  const closeModal = () => {
    setModal(false);
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setUserAccount(JSON.parse(storedUser));
    }
  }, []);
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleCartItemQuanitity,
    onRemove,
  } = useStateContext();

  const handleCheckout = async () => {
    console.log({ userAccount });
    setModal(true);
    // if (!userAccount) {
    //   toast.error('Please login before checkout');
    //   return;
    // }
    // const stripe = await getStripe();

    // const response = await fetch('/api/stripe', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(cartItems),
    // });

    // if (response.statusCode === 500) return;

    // const data = await response.json();

    // toast.loading('Redirecting...');

    // stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className='cart-wrapper' ref={cartRef}>
      <div className='cart-container'>
        <button
          type='button'
          className='cart-heading'
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className='heading'>Your Cart</span>
          <span className='cart-num-items'>({totalQuantities} items)</span>
        </button>

        {cartItems && cartItems.length < 1 && (
          <div className='empty-cart'>
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href='/'>
              <button
                type='button'
                onClick={() => setShowCart(false)}
                className='btn'
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className='product-container'>
          {cartItems &&
            cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div className='product' key={item._id}>
                <img
                  src={urlFor(item?.image[0])}
                  className='cart-product-image'
                />
                <div className='item-desc'>
                  <div className='flex top'>
                    <h5>{item.name}</h5>
                    <h4>${item.price}</h4>
                  </div>
                  <div className='flex bottom'>
                    <div>
                      <p className='quantity-desc'>
                        <span
                          className='minus'
                          onClick={() =>
                            toggleCartItemQuanitity(item._id, 'dec')
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className='num' onClick=''>
                          {item.quantity}
                        </span>
                        <span
                          className='plus'
                          onClick={() =>
                            toggleCartItemQuanitity(item._id, 'inc')
                          }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type='button'
                      className='remove-item'
                      onClick={() => onRemove(item)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cartItems && cartItems.length >= 1 && (
          <div className='cart-bottom'>
            <div className='total'>
              <h3>Subtotal:</h3>
              <h3>${totalPrice}</h3>
            </div>
            <div className='btn-container'>
              <button type='button' className='btn' onClick={handleCheckout}>
                Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
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
            <p>this is the delivery location</p>
            {/* <form className='login-form' onSubmit={handleLogin}>
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
              <button type='submit' disabled={loading} className='login-button'>
                {loading ? <Spinner /> : 'Login'}
              </button>
              <div onClick={switchScreen}>
                <p className='signup-option'>Don't have an account? Signup</p>
              </div>
            </form> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
