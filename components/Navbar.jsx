import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineShopping } from 'react-icons/ai';
import { MdOutlineAccountCircle } from 'react-icons/md';

import { Cart } from './';
import { useStateContext } from '../context/StateContext';

const Navbar = () => {
  const router = useRouter();
  const { showCart, setShowCart, totalQuantities, logout } = useStateContext();
  const [userAccount, setUserAccount] = useState();
  const [open, setOpen] = useState(false);
  const [isLoggedin, setIsLoggedIn] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = useCallback(() => {
    handleClose();
    logout();
    setIsLoggedIn(!isLoggedin);
    router.push('/');
  }, [isLoggedin]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setUserAccount(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, [isLoggedin]);
  const rerender = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      <div className='navbar-container'>
        <p className='logo'>
          <Link href='/'>Dreel Marketplace</Link>
        </p>
        <div className='inner-navbar'>
          <button
            type='button'
            className='cart-icon'
            onClick={() => setShowCart(true)}
          >
            <AiOutlineShopping />
            <span className='cart-item-qty'>{totalQuantities}</span>
          </button>
          <div className='navbar-account'>
            {!isLoggedin ? (
              <Link href='/login'>
                <div className='account'>
                  <MdOutlineAccountCircle size={22} />
                  <span>Login/Register</span>
                </div>
              </Link>
            ) : (
              <div className='dropdown'>
                <button onClick={handleToggle} className='dropdown-toggle'>
                  {userAccount?.user?.username}
                </button>
                {open && (
                  <ul className='dropdown-menu'>
                    <li>My Account</li>
                    <Link
                      href={{
                        pathname: '/account',
                        query: { id: userAccount.user._id },
                      }}
                      className='account-link'
                    >
                      <li onClick={handleClose}>Dashboard</li>
                    </Link>
                    <li className='logout' onClick={handleLogout}>
                      LOGOUT
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {showCart && <Cart />}
      </div>
    </>
  );
};

export default Navbar;
