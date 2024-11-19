import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
import styles from "./Login.module.css";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const newUser = {
            email: email,
            password: password,
        };
    
    loginUser(newUser, dispatch, navigate);
    };
    
    return ( 
        <section className={styles.loginContainer}>
        <div className={styles.loginTitle}>Log in</div>
        <form onSubmit={handleLogin} className={styles.form}>
            <label className={styles.label}>EMAIL</label>
            <input 
                type="text" 
                placeholder="Enter your username" 
                onChange={(e) => setEmail(e.target.value)} 
                className={styles.input}
            />
            <label className={styles.label}>PASSWORD</label>
            <input 
                type="password" 
                placeholder="Enter your password" 
                onChange={(e) => setPassword(e.target.value)} 
                className={styles.input}
            />
            <button type="submit" className={styles.button}>LOGIN</button>
        </form>
        <div className={styles.loginRegister}>Don't have an account yet?</div>
        <Link className={styles.loginRegisterLink} to="/register">Register</Link>
    </section>
);
}
 
export default Login;