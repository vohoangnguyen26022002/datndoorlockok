import axios from "axios";
import { getAuth, signInWithEmailAndPassword, signOut  } from "firebase/auth";
import { changePasswordFailed, changePasswordStart, changePasswordSuccess, loginFailed, loginStart, loginSuccess, logOutFailed, logOutStart, logOutSuccess, PostUnlockHistoryFailed, PostUnlockHistoryStart, PostUnlockHistorySuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";
import { deleteUserStart, deleteUserSuccess,deteleUserFailed, getCloseHistoryFailed, getCloseHistoryStart, getCloseHistorySuccess, getFailedAttemptImagesFailed, getFailedAttemptImagesStart, getFailedAttemptImagesSuccess, getPassHistoryFailed, getPassHistoryStart, getPassHistorySuccess, getUsersFailed, getUserStart, getUserSuccess, UpdateUserFailed, UpdateUserStart, UpdateUserSuccess } from "./userSlice";
import { firebaseApp, realtimeDb } from "./firebaseapp";
import { db } from "./firebaseapp";
import { doc, getDoc } from "firebase/firestore";
import { ref, set, get } from "firebase/database";


export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    const auth = getAuth(firebaseApp);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, user.email.trim(), user.password.trim());
        const userInfo = userCredential.user;

        const token = await userCredential.user.getIdToken();
           const userDocRef = doc(db, "users", userInfo.uid); 
           const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists) {
            console.error("User not found in Firestore");
            dispatch(loginFailed());
            return;
        }

        const userData = userDoc.data();
        dispatch(loginSuccess({
            uid: userInfo.uid,
            email: userData.email,
            userName: userData.userName,
            admin: userData.admin,  // Lưu trường admin
            can_open: userData.can_open, // Lưu trường can_open
            token,
        }));
        navigate("/");
    } catch (error) {
        console.error("Error signing in:", error);
        dispatch(loginFailed());
    }
};


//Hàm đăng ký
export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        await axios.post("/auth/signup", user);
        
        dispatch(registerSuccess());
        navigate("/login"); 
    } catch (error) {
        console.error("Error registering user:", error); 
        dispatch(registerFailed());
    }
};

//Hàm lấy các user
export const fetchAllUsers = async (dispatch, token) => {
    dispatch(getUserStart());
    try {
        const response = await axios.get("/users/allusers", {
            headers: { Authorization: `Bearer ${token}` },
        });
        
        dispatch(getUserSuccess(response.data)); 
    } catch (error) {
        console.error("Error fetching all users:", error.message);
        dispatch(getUsersFailed(error.message)); 
    }
};

//Hàm đăng xuất
export const logOut = async (dispatch, navigate) => {
    dispatch(logOutStart());
    try {
        const auth = getAuth(); 
        await signOut(auth); 

        dispatch(logOutSuccess()); 
        navigate("/login"); 
    } catch (error) {
        console.error("Logout error:", error);
        dispatch(logOutFailed()); 
    }
};

//Hàm đổi password
export const changePassword = async (newPassword, dispatch) => {
    dispatch(changePasswordStart());
    
    try {
        const response = await axios.post(
            "/auth/changepassword",
            { newPassword },
            {
                headers: {
                    Authorization: `Bearer ${getAuth().currentUser?.accessToken}`
                }
            }
        );

        dispatch(changePasswordSuccess(response.data));
        alert("Password changed successfully!");
    } catch (error) {
        console.error("Error changing password:", error);
        dispatch(changePasswordFailed());
        alert("Failed to change password.");
    }
};


// Hàm lấy trạng thái khóa
export const getKhoa = async (dispatch) => {
    try {
        const refKhoa = ref(realtimeDb, 'khoa');
        const snapshot = await get(refKhoa);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("No data available");
            return null;
        }
    } catch (error) {
        console.error("Error fetching khoa status:", error);
    }
};

// Hàm cập nhật trạng thái Khoá
export const updateKhoa = async (newValue, dispatch) => {
    try {
        const refKhoa = ref(realtimeDb, 'khoa'); 
        await set(refKhoa, newValue);
        console.log("Khoa status updated successfully!");
    } catch (error) {
        console.error("Error updating khoa status:", error);
    }
};


//Post danh sach lich su mo khoa
export const PostUnlockHistory = async ( token, dispatch, unlockTime, email) => {
    dispatch(PostUnlockHistoryStart());

    try {
        const res = await axios.post("/auth/khoahistory", { email, unlockTime }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(PostUnlockHistorySuccess(res.data));
    } catch (error) {
        dispatch(PostUnlockHistoryFailed());
        throw new Error("Failed to log unlock history.");
    }
};


// Hàm lấy danh sách lịch sử mở khóa cho admin
export const fetchUnlockHistory = async (token, dispatch) => {
    dispatch(getPassHistoryStart());

    try {
        const response = await axios.get("/users/allhistory", {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Unlock History Response:', response.data);
        dispatch(getPassHistorySuccess(response.data));
    } catch (error) {
        console.error("Error fetching unlock history:", error);
        dispatch(getPassHistoryFailed(error.message));
    }
};


//Hàm update User ở frontend
export const updateUser = async (userId, newAdminStatus, newCanOpenStatus, token, dispatch) => {
    dispatch(UpdateUserStart());
    
    try {
        const response = await axios.put(
            "/users/updateusers", 
            { userId: userId, admin: newAdminStatus, can_open: newCanOpenStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(UpdateUserSuccess(response.data));
        alert("User privileges updated successfully!");
    } catch (error) {
        console.error("Error updating user privileges:", error);
        dispatch(UpdateUserFailed(error.message));
        alert("Failed to update user privileges.");
    }
};

//Hàm xóa user
export const deleteUser = async (userId, token, dispatch) => {
    dispatch(deleteUserStart()); 
    try {
        const response = await axios.delete(
            "/users/deleteUser", 
            {
              headers: { 
                Authorization: `Bearer ${token}`
              },
              data: { userId }
            }
          );
  
      dispatch(deleteUserSuccess(response.data)); 
      alert("User deleted successfully!");  
    } catch (error) {
      console.error("Error deleting user:", error);
      dispatch(deteleUserFailed(error.message));  
      alert("Failed to delete user."); 
    }
  };

  export const fetchFailedAttemptImages = async (dispatch, token) => {
    dispatch(getFailedAttemptImagesStart());
    try {
        const response = await axios.get("/users/image", {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(getFailedAttemptImagesSuccess(response.data));
    } catch (error) {
        console.error("Error fetching failed attempt images:", error);
        dispatch(getFailedAttemptImagesFailed(error.message));
    }
};

export const fetchCloseHistory = async (token, dispatch) => {
    dispatch(getCloseHistoryStart());  // Start the process (loading)

    try {
        // Send GET request to your API endpoint for close history
        const response = await axios.get("/users/closetime", {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Close Response:', response.data);
        dispatch(getCloseHistorySuccess(response.data));
    } catch (error) {
        // In case of error, log it and dispatch the failure action
        console.error("Error fetching close history:", error);
        dispatch(getCloseHistoryFailed(error.message));
    }
};