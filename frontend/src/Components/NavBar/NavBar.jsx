import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/apiRequest";
import { createAxios } from "../../createInstance";
import { logOutSuccess } from "../../redux/authSlice";
import { FaUserCircle } from "react-icons/fa";
import './NavBar.css';


const NavBar = () => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = user?.accessToken;
  const id = user?._id;
  let axiosJWT = createAxios(user, dispatch, logOutSuccess);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);

  const hanldeLogout = () => {
     logOut(dispatch, navigate);
  }

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (
      (dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
      (iconRef.current && !iconRef.current.contains(event.target))
    ) {
      setDropdownOpen(false); 
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);



  return (
    <nav className="navbar-container">
      {!user && <Link to="/" className="navbar-home">Home</Link>}

    {user ? (
      <div className="navbar-user-section">
        <div className="navbar-user-icon" onClick={toggleDropdown} ref={iconRef}>
          <FaUserCircle size={30} />
        </div>

        {dropdownOpen && (
          <div className="navbar-dropdown" ref={dropdownRef}>
            <p className="navbar-dropdown-title">Hi, {user.username}</p>
            <Link to="/changePassword" className="navbar-dropdown-item">Change Password</Link>
            <button onClick={hanldeLogout} className="navbar-logout">Logout</button>
          </div>
        )}
      </div>
    ) : (
      <>
        <Link to="/login" className="navbar-login">Login</Link>
        <Link to="/register" className="navbar-register">Register</Link>
      </>
    )}
  </nav>
);
};
export default NavBar;
