import React from 'react';
import { useRouter } from 'next/router';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';

import { client } from '../../lib/client';

import ImeiCHeck from '../../components/ImeiCHeck';
import Announcement from '../../components/Announcement';

const index = ({ announcement, categories }) => {
  const router = useRouter();
  return (
    <>
      <div className='products-heading'>
        <h2>CLIENT AREA DASHBOARD</h2>
      </div>
      <div className='route-back' onClick={() => router.back()}>
        <IoMdArrowRoundBack />
        <p>Go Back</p>
      </div>
      <div className='dashboard-row'>
        <div className='dashboard-column'>
          <div className='column-two'>
            <div className='column-two-card'>
              <p>Completed Order:</p>
              <span>8</span>
            </div>
            <div className='column-two-card'>
              <p>Completed IMEI Checks:</p>
              <span>8</span>
            </div>
            <div className='column-two-card'>
              <p>Pending Order:</p>
              <span>8</span>
            </div>
            <div className='column-two-card'>
              <p>Pending IMEI Checks:</p>
              <span>2</span>
            </div>
          </div>
          <ImeiCHeck categories={categories} />
          <div className='account-socials'>
            <div className='account-socials-card'>
              <button type='submit' className='socials-action'>
                Connect Telegram
              </button>
              <FaTelegramPlane />
            </div>
            <div className='account-socials-card'>
              <button type='submit' className='socials-action'>
                Connect WhatsApp
              </button>
              <FaWhatsapp />
            </div>
          </div>
        </div>
        <div className='dashboard-column-first'>
          <Announcement announcement={announcement} />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const query = '*[_type == "announcement"]';
  const announcement = await client.fetch(query);

  const categoryList = '*[_type == "categories"]';
  const categories = await client.fetch(categoryList);

  return {
    props: { announcement, categories },
  };
};

export default index;
