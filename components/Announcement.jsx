import React from 'react';
import { Spinner } from 'reactstrap';

const Announcement = ({ announcement }) => {
  return (
    <>
      <div className='announcement-container'>
        <p>Announcements</p>
        {announcement ? (
          announcement.map((item) => (
            <div className='announcement-item' key={item._id}>
              <p>{item.title}</p>
              <span>{item.date}</span>
              <hr />
            </div>
          ))
        ) : (
          <div className='announcement-spinner'>
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
};

export default Announcement;
