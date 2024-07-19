import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IoIosSearch } from 'react-icons/io';
import { IoMdArrowRoundBack } from 'react-icons/io';
import toast from 'react-hot-toast';
import Link from 'next/link';

import { client } from '../../lib/client';

const index = ({ categories }) => {
  const router = useRouter();
  const [userAccount, setUserAccount] = useState();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setUserAccount(JSON.parse(storedUser));
    }
  }, []);

  const viewMessage = () => {
    if (!userAccount) {
      return toast.error('You need to login to proceed');
    }
  };

  const filteredCategories = categories.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className='products-heading'>
        <h2>RESELLER PRICING / IMEI SERVICE</h2>
      </div>
      <div className='route-back' onClick={() => router.back()}>
        <IoMdArrowRoundBack />
        <p>Go Back</p>
      </div>
      <div className='service-container-top'>
        <div className='service-input'>
          <input
            placeholder='Search'
            className='search-input'
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className='search-icon'>
            <IoIosSearch size={30} />
          </button>
        </div>
        <button onClick={viewMessage} className='unlock-now-button'>
          {userAccount !== undefined ? (
            <Link
              href={{
                pathname: '/account',
                query: { id: userAccount.user._id },
              }}
            >
              Unlock Now
            </Link>
          ) : (
            'Unlock Now'
          )}
        </button>
      </div>
      <div className='imei-table'>
        <table>
          <tbody>
            <tr>
              <th>IMEI CHECK</th>
              <th>DELIVERY TIME</th>
              <th>PRICE</th>
            </tr>
            {filteredCategories &&
              filteredCategories.map((item) => (
                <>
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item.duration}</td>
                    <td>${item.price}.00</td>
                  </tr>
                </>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const query = '*[_type == "categories"]';
  const categories = await client.fetch(query);

  return {
    props: { categories },
  };
};

export default index;
