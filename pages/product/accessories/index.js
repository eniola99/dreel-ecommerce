import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { urlFor, client } from '../../../lib/client';
import { IoMdArrowRoundBack } from 'react-icons/io';

const list = ({ accessoriesProducts }) => {
  console.log({ accessoriesProducts });
  const router = useRouter();
  return (
    <>
      <div className='route-back' onClick={() => router.back()}>
        <IoMdArrowRoundBack />
        <p>Go Back</p>
      </div>
      <div className='product-list'>
        {accessoriesProducts.map((product) => (
          <Link
            href={`/accessories/${product?.slug?.current}`}
            key={product?._id}
          >
            <div className=''>
              <img
                src={urlFor(product?.image[0] && product?.image[0])}
                width={270}
                height={250}
                className='product-image'
              />
              <p className='product-name'>{product?.name}</p>
              <p className='product-price'>${product?.price}.99</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const accessoriesQuery = '*[_type == "accessories"]';
  const accessoriesProducts = await client.fetch(accessoriesQuery);

  return {
    props: { accessoriesProducts },
  };
};

export default list;
