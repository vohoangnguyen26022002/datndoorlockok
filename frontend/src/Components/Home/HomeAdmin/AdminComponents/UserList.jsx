import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, fetchAllUsers, updateUser } from '../../../../redux/apiRequest';
import { createAxios } from '../../../../createInstance';
import { updateUsersList } from '../../../../redux/userSlice';
import styles from './css/UserList.module.css'

const UserList = () => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const usersList = useSelector((state) => state.users.users?.allUsers);
    const dispatch = useDispatch();
    useEffect(() => {
        if (user?.token) {
            fetchAllUsers(dispatch, user?.token);
        }
    }, [dispatch, user]);

    
    const handleTogglePrivilege = (userId, adminStatus, canOpenStatus) => {
        const updatedUsersList = usersList.map((user) =>
            user.id === userId
                ? { ...user, admin: adminStatus, can_open: canOpenStatus }
                : user
        );
    
        dispatch(updateUsersList(updatedUsersList));
        updateUser(userId, adminStatus, canOpenStatus, user?.token, dispatch);
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) return;
      
        try {
            await deleteUser(userId, user?.token, dispatch); 
            const updatedUsersList = usersList.filter((user) => user.id !== userId);
            dispatch(updateUsersList(updatedUsersList));
        } catch (error) {
            console.error("Error in deleteUser:", error);
        }
    };

    return (
        <div className={styles.userTableContainer}>
            <h2>User List</h2>
            <table className={styles.userTable}>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Can Open</th>
                        <th>Admin</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                {usersList && usersList.length > 0 ? (
                        usersList.map((user) => (
                            <tr key={user.id}>
                                <td>{user.userName}</td> 
                                <td>
                                <label className={styles.switch}>
                                        <input 
                                            type="checkbox" 
                                            checked={user.can_open} 
                                            onChange={() => handleTogglePrivilege(user.id, user.admin, !user.can_open)}
                                          
                                        />
                                         <span className={styles.slider}></span>
                                    </label>
                                </td>
                                <td>
                                <label className={styles.switch}>
                                        <input 
                                            type="checkbox" 
                                            checked={user.admin} 
                                            onChange={() => handleTogglePrivilege(user.id, !user.admin, user.can_open)}
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
                                </td>
                                <td>
                                <button className={styles.deleteButton} onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;