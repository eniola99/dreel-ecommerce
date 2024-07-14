import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';
import { toast } from 'react-hot-toast';

import { runFireworks } from '../lib/utils';

const PaymentSuccess = () => {
  const router = useRouter();
  const { type, sn, notes, userId, session_id } = router.query;

  useEffect(() => {
    runFireworks();
    if (session_id) {
      handleCreate();
      setTimeout(() => {
        router.push('/account');
      }, 2000);
    }
  }, [session_id]);

  const handleCreate = async () => {
    const response = await fetch('/api/success', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        sn,
        notes,
        userId,
        session_id,
      }),
    });
    const data = await response.json();
    toast.success(data.message);
  };

  return (
    <div className='success-wrapper'>
      <div className='success'>
        <p className='icon'>
          <BsBagCheckFill />
        </p>
        <h2>Thank you for using our unlock service!</h2>
        <p className='email-msg'>Check your email inbox for the receipt.</p>
        <p className='description'>
          If you have any questions, please email
          <a className='email' href='mailto:qudusnurudeen10@gmail.com'>
            dreelmarketplace@gmail.com
          </a>
        </p>
        {/* <button
          type='button'
          width='300px'
          className='btn'
          onClick={handleCreate}
        >
          Continue to Dashboard
        </button> */}
        <Link href='/account'>
          <button type='button' width='300px' className='btn'>
            Continue to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
