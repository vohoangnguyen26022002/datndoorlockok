import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { fetchUnlockHistory } from '../../../../redux/apiRequest';
import styles from './css/LoginHistory.module.css';

const LoginHistory = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  
  const PassWordList = useSelector((state) => state.users.passWordHistories?.allPassWord);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    if(user?.token) {
      fetchUnlockHistory(user?.token, dispatch);
    }
  },[user, dispatch]);

 // Hàm phân trang
 const paginate = (data) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return data.slice(startIndex, startIndex + itemsPerPage);
};


// Sắp xếp danh sách theo unlockTime (mới nhất trước)
const sortedPassWordList = Array.isArray(PassWordList)
? [...PassWordList].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
: [];

  // GỌI hàm phân trang
  const paginatedEntries = paginate(sortedPassWordList);

  // Tính tổng số trang
  const totalPages = Math.ceil(sortedPassWordList.length / itemsPerPage);
  

  return (
    <div className={styles['login-history']}>
    <h2>Login History PassWord</h2>
    <table className={styles['login-history-table']}>
      <thead>
        <tr>
          <th>Tên</th>
          <th>Thời gian mở cửa</th>
          <th>Thời gian đóng cửa</th>
        </tr>
      </thead>
      <tbody>
      {paginatedEntries.length > 0 ? (
            paginatedEntries.map((entry, index) => (
              <tr key={entry.unlockTime + index}> 
                <td>{entry.username || undefined }</td>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
                <td>
          {entry.closetime
            ? new Date(entry.closetime).toLocaleString()
            : "Chưa đóng"}
        </td>
              </tr>
              
            ))
          ) : (
            <tr>
              <td colSpan="2">No login history available.</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div className={styles.pagination}>
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LoginHistory;


