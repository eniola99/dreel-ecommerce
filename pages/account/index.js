import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';

import { client } from '../../lib/client';

import ImeiCHeck from '../../components/ImeiCHeck';
import Announcement from '../../components/Announcement';
import Settings from '../../components/Settings';

const index = ({
  announcement,
  categories,
  result,
  pendingResult,
  cancelledResult,
}) => {
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
              <p>Completed IMEI Checks:</p>
              {Array.isArray(result) && (
                <span>{result.length || 'No Transaction'}</span>
              )}
            </div>
            <div className='column-two-card'>
              <p>Pending IMEI Checks:</p>
              {Array.isArray(pendingResult) && (
                <span>{pendingResult.length || 'No Transaction'}</span>
              )}
            </div>
            <div className='column-two-card'>
              <p>Cancelled IMEI CHECK:</p>
              {Array.isArray(cancelledResult) && (
                <span>{cancelledResult.length || 'No Transaction'}</span>
              )}
            </div>
          </div>
          <ImeiCHeck
            categories={categories}
            result={result}
            cancelledResult={cancelledResult}
            pendingResult={pendingResult}
          />
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
      <hr />
      <Settings />
    </>
  );
};

export const getServerSideProps = async (router) => {
  const userId = router.query.id;

  const pending = false;
  const query = '*[_type == "announcement"]';
  const completedImei = `*[_type == "unlockRequest" && userId == $userId && completed == true]`;
  const pendingImei = `*[_type == "unlockRequest" && userId == $userId && completed == undefined]`;
  const cancelledImei = `*[_type == "unlockRequest" && userId == $userId && completed == $pending]`;

  const params = { userId, pending };
  const pendingParams = { userId, pending };
  const announcement = await client.fetch(query);
  const result = await client.fetch(completedImei, params);
  const pendingResult = await client.fetch(pendingImei, pendingParams);
  const cancelledResult = await client.fetch(cancelledImei, params);

  const categoryList = '*[_type == "categories"]';
  const categories = await client.fetch(categoryList);

  return {
    props: { announcement, categories, result, pendingResult, cancelledResult },
  };
};

export default index;
