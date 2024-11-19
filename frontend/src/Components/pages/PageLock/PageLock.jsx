import React, { useEffect } from 'react';
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getKhoa, PostUnlockHistory, updateKhoa } from '../../../redux/apiRequest';
import { realtimeDb } from '../../../redux/firebaseapp';
import { onValue, ref } from 'firebase/database';
import styles from './PageLock.module.css';

const PageLock = () => {
    const [isUnLocked, setIsUnLocked] = useState(false);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    
    useEffect(() => {
        // Lấy trạng thái khóa ban đầu
        const fetchInitialKhoaStatus = async () => {
            try {
                const initialStatus = await getKhoa(dispatch); // Gọi hàm để lấy trạng thái khóa
                setIsUnLocked(initialStatus === true); // Cập nhật trạng thái với giá trị boolean
            } catch (error) {
                console.error("Failed to fetch initial khoa status:", error);
            }
        };

        fetchInitialKhoaStatus();

        const refKhoa = ref(realtimeDb, 'khoa');

        
        const unsubscribe = onValue(refKhoa, (snapshot) => {
            if (snapshot.exists()) {
                const status = snapshot.val();
                setIsUnLocked(status === true); 
            } else {
                console.log("No data available");
            }
        }, (error) => {
            console.error("Error fetching khoa status:", error);
        });

        // Cleanup function để hủy bỏ listener khi component unmount
        return () => unsubscribe();
    }, [dispatch]);

  const handleToggleLock = async () => {
      if (user?.can_open) {
          const newStatus = !isUnLocked; // Đảo ngược trạng thái hiện tại

          try {
              await updateKhoa(newStatus); // Cập nhật trạng thái mới lên server
              setIsUnLocked(newStatus); // Cập nhật trạng thái trong UI

              if (newStatus) {
                  const unlockTime = new Date().toISOString();
                  // Ghi lại lịch sử mở khóa
                  console.log("Using token:", user?.token); // Log token để kiểm tra
                  await PostUnlockHistory(user?.token, dispatch, unlockTime, user.email);
              }
          } catch (error) {
              console.error("Failed to update khoa status:", error);
          }
      } else {
          console.log('User does not have permission to unlock.');
      }
  };
    
  return (
    <div className={styles['lock-container']}>
      <div className={styles['lock-icon']}>
        {isUnLocked ? '🔓' : '🔒'} 
      </div>
      <h2 className={styles['lock-status']}>{isUnLocked ? 'UnLocked' : 'Locked'}</h2>
      <button className={styles['unlock-button']} onClick={handleToggleLock}>
        {isUnLocked ? 'Unlock' : 'Lock'}
      </button>
      {!user?.can_open && (
                <p className={styles['permission-message']}>You do not have permission to unlock.</p>
            )}
    </div>
  );
};

export default PageLock;
