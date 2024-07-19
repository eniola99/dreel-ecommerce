import React from 'react';
import Link from 'next/link';
import { IoIosArrowForward } from 'react-icons/io';
import { client } from '../lib/client';
import { Product, FooterBanner, HeroBanner } from '../components';

const Home = ({ products, bannerData, accessoriesProducts }) => {
  return (
    <div>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
      <div className=''>
        <div className='products-heading'>
          <h2>Best Seller Products</h2>
        </div>

        <div className='products-container'>
          {products
            .slice(-8)
            .map((product) => <Product key={product._id} product={product} />)
            .reverse()}
        </div>
      </div>

      <div className=''>
        <div className='products-heading'>
          <h2>Top Deals</h2>
          <Link href='/product/list'>
            <p>
              show more <IoIosArrowForward />
            </p>
          </Link>
        </div>

        <div className='products-container'>
          {products
            .slice(-8)
            .map((product) => <Product key={product._id} product={product} />)
            .reverse()}
        </div>
      </div>

      <div className=''>
        <div className='products-heading'>
          <h2>Accessories</h2>
          <Link href='/product/accessories'>
            <p>
              show more <IoIosArrowForward />
            </p>
          </Link>
        </div>

        <div className='products-container'>
          {accessoriesProducts
            .slice(-8)
            .map((product) => <Product key={product._id} product={product} />)
            .reverse()}
        </div>
      </div>

      <FooterBanner />
    </div>
  );
};

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const accessoriesQuery = '*[_type == "accessories"]';
  const accessoriesProducts = await client.fetch(accessoriesQuery);

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, bannerData, accessoriesProducts },
  };
};

export default Home;
