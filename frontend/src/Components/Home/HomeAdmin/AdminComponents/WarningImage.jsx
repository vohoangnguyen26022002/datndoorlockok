import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFailedAttemptImages } from '../../../../redux/apiRequest';

const WarningImage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const imageList = useSelector((state) => state.users.failedAttemptImages?.images);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.token) {
      fetchFailedAttemptImages(dispatch, user?.token);
    }
  }, [ dispatch,user]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
  };


  // Kiểm tra nếu imageList không phải là mảng hợp lệ
  if (!Array.isArray(imageList)) {
    return <div>No failed attempt images found.</div>;
  }

  return (
    <div>
      <h3>Failed Attempt Images</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {imageList.map((image, index) => {
          const imageData = image.failedAttemptsImage;
          const imageId = image.id; 

          return (
            <div key={index} style={{ margin: '10px', textAlign: 'center' }}>
              <div>
                <h4> {imageId}</h4>
              </div>
              {imageData ? (
                <img
                  src={`data:image/jpeg;base64,${imageData}`}
                  alt={`Failed attempt ${index}`}
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              ) : (
                <p>No image available</p>
              )}
              {/* Nếu bạn có timestamp, có thể hiển thị nó dưới mỗi ảnh */}
              {/* <p>{formatTimestamp(image.timestamp)}</p> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default WarningImage;
