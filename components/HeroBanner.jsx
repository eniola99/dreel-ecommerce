import React from 'react';
import Link from 'next/link';

import { urlFor } from '../lib/client';

const HeroBanner = ({ heroBanner }) => {
  return (
    <div className='hero-banner-container'>
      <div>
        <p className='beats-solo'>{heroBanner.smallTex}</p>
        {/* <h3>{heroBanner.midText}</h3> */}
        <h3>Everything You Need</h3>
        {/* <h1>{heroBanner.largeText1}</h1> */}
        <h1>iPhones</h1>
        <p>and more...</p>
        {/* <img
          src={urlFor(heroBanner?.image && heroBanner?.image)}
          alt='headphones'
          className='hero-banner-image'
        /> */}

        <div>
          <Link href={`/product/list`}>
            <button type='button'>Shop Now</button>
          </Link>
          <div className='desc'>
            <h5>Description</h5>
            <p>{heroBanner.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
