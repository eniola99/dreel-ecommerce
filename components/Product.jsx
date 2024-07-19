import React from 'react';
import Link from 'next/link';

import { urlFor } from '../lib/client';
import { truncate } from '../lib/utils';

const Product = ({
  product: { image, name, slug, price, isAvailable, _type },
}) => {
  return (
    <div>
      <Link href={`/${_type}/${slug.current}`}>
        <div className='product-card'>
          <img
            src={urlFor(image && image[0])}
            width={270}
            height={250}
            className='product-image'
          />
          <p className='product-name'>{truncate(name)}</p>
          <p className='product-price'>${price}.99</p>
          {!isAvailable && <p className='product-available'>Out of Stock</p>}
        </div>
      </Link>
    </div>
  );
};

export default Product;
