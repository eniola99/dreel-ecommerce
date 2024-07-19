import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { urlFor, client } from '../../lib/client';
import { truncate } from '../../lib/utils';
import { IoMdArrowRoundBack } from 'react-icons/io';

const list = ({ products }) => {
  const router = useRouter();
  return (
    <>
      <div className='route-back' onClick={() => router.back()}>
        <IoMdArrowRoundBack />
        <p>Go Back</p>
      </div>
      <div className='product-list'>
        {products
          .map((product) => (
            <Link
              href={`/product/${product?.slug?.current}`}
              key={product?._id}
            >
              <div className=''>
                <img
                  src={urlFor(product?.image[0] && product?.image[0])}
                  width={270}
                  height={250}
                  className='product-image'
                />
                <p className='product-name'>{truncate(product?.name)}</p>
                <p className='product-price'>${product?.price}.99</p>
              </div>
            </Link>
          ))
          .reverse()}
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  return {
    props: { products },
  };
};

export default list;
