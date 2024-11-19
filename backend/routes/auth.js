// routes/auth.js
const express = require('express');
const { signup, login, logout, changePassword, getKhoaStatus, updateKhoaStatus, logUnlockHistory, getCuaStatus, updateCuaStatus, logCloseHistory,  } = require('../Controller/auth');
const router = express.Router();
const middlewareController = require("../Controller/middleWare");


// Định nghĩa route cho đăng ký
router.post('/signup', signup);

// Định nghĩa route cho đăng nhập
router.post('/login', login);

router.post("/logout", middlewareController.verifyToken, logout);

router.post("/changepassword",middlewareController.verifyToken, changePassword);

router.get('/khoa',middlewareController.verifyToken, getKhoaStatus);

router.post('/khoa',middlewareController.verifyToken, updateKhoaStatus);

router.post('/khoahistory', middlewareController.verifyToken, logUnlockHistory);

// Định nghĩa route cho lấy trạng thái cửa
router.get('/cua', middlewareController.verifyToken, getCuaStatus);

// Định nghĩa route cho cập nhật trạng thái cửa
router.post('/updatecua', middlewareController.verifyToken, updateCuaStatus);

// Định nghĩa route cho lịch sử đóng cửa
router.post('/closehistory', middlewareController.verifyToken, logCloseHistory);


module.exports = router;
