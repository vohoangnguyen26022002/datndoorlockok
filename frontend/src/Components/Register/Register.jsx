import { useState } from "react";
import { registerUser } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import styles from './Register.module.css';

const Register = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const schema = yup.object().shape({
        username: yup
        .string()
        .matches(/^[A-Za-zÀ-ỹà-ỹ\s]+$/, 'Username must only contain letters and spaces')
        .required('User Name is required.'),

        email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),

        password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),

        retypePassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Retype Password is required'),
    });

    const form = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            fullName: '',
            email: '',
            pasword: '',
            retypePassword: '',
        },
    });
    

    const handleRegister = (data) => {
        const newUser = {
            email: data.email,
            password: data.password,
            username: data.username,
        };
        console.log("Registering user:", newUser);
        registerUser(newUser, dispatch, navigate);
    };

    return (
      <section className={styles.registerContainer}>
      <div className={styles.registerTitle}>Sign up</div>
      <form onSubmit={form.handleSubmit(handleRegister)}>
        <label>EMAIL</label>
        <input 
          type="text" 
          placeholder="Enter your email" 
          {...form.register("email")}
        />
        {form.formState.errors.email && <p>{form.formState.errors.email.message}</p>}
  
        <label>USERNAME</label>
        <input 
          type="text" 
          placeholder="Enter your username" 
          {...form.register("username")}
        />
        {form.formState.errors.username && <p>{form.formState.errors.username.message}</p>}
  
        <label>PASSWORD</label>
        <input 
          type="password" 
          placeholder="Enter your password" 
          {...form.register("password")}
        />
        {form.formState.errors.password && <p>{form.formState.errors.password.message}</p>}
  
        <label>RETYPE PASSWORD</label>
        <input 
          type="password" 
          placeholder="Retype your password" 
          {...form.register("retypePassword")}
        />
        {form.formState.errors.retypePassword && <p>{form.formState.errors.retypePassword.message}</p>}
  
        <button type="submit">Create account</button>
      </form>
    </section>
);
}
 
export default Register;