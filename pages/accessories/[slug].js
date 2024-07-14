import React, { useState } from 'react';
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from 'react-icons/ai';
import { useRouter } from 'next/router';
import { IoMdArrowRoundBack } from 'react-icons/io';

import { client, urlFor } from '../../lib/client';
import { Product } from '../../components';
import { useStateContext } from '../../context/StateContext';

const ProductDetails = ({ product, products }) => {
  console.log({ product, products });
  const { image, name, details, price, isAvailable } = product;
  const [index, setIndex] = useState(0);
  const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

  const handleBuyNow = (isAvailable) => {
    if (!isAvailable) return;
    onAdd(product, qty, isAvailable);

    setShowCart(true);
  };

  const router = useRouter();

  return (
    <div>
      <div className='route-back' onClick={() => router.back()}>
        <IoMdArrowRoundBack />
        <p>Go Back</p>
      </div>

      <div className='product-detail-container'>
        <div>
          <div className='image-container'>
            <img
              src={urlFor(image && image[index])}
              className='product-detail-image'
            />
          </div>
          <div className='small-images-container'>
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className={
                  i === index ? 'small-image selected-image' : 'small-image'
                }
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className='product-detail-desc'>
          <h1>
            {name} {!isAvailable && <span>Out of Stock</span>}
          </h1>
          <div className='reviews'>
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className='price'>${price}.99</p>
          <div className='quantity'>
            <h3>Quantity:</h3>
            <p className='quantity-desc'>
              <span className='minus' onClick={decQty}>
                <AiOutlineMinus />
              </span>
              <span className='num'>{qty}</span>
              <span className='plus' onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className='buttons'>
            <button
              type='button'
              className='add-to-cart'
              disabled={!isAvailable}
              onClick={() => onAdd(product, qty, isAvailable)}
            >
              Add to Cart
            </button>
            <button
              type='button'
              className='buy-now'
              onClick={() => handleBuyNow(isAvailable)}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className='maylike-products-wrapper'>
        <h2>You may also like</h2>
        <div className='marquee'>
          <div className='maylike-products-container track'>
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }
  `;

  const products = await client.fetch(query);

  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  if (slug === 'list') return;
  const query = `*[_type == "accessories" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "accessories"]';

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return {
    props: { products, product },
  };
};

export default ProductDetails;
