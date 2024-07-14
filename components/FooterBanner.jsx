import React from 'react';
import Link from 'next/link';

const FooterBanner = () => {
  return (
    <div className='footer-banner-container'>
      <div className='banner-desc'>
        <div className='left'>
          <p>24 Hours Support</p>
          <h3>Unlock</h3>
          <h3>Phones</h3>
          <p>Money Back Guarantee</p>
        </div>
        <div className='right'>
          <p>Attractive Prices</p>
          <h3>imei services</h3>
          <p>iPhone/Andriod imei services</p>
          <Link href={`/services`}>
            <button type='button'>IMEI Services</button>
          </Link>
        </div>

        {/* <img src={urlFor(image)} className='footer-banner-image' /> */}
      </div>
    </div>
  );
};

export default FooterBanner;
