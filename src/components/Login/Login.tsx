import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setUser } from '../AuthSlice/AuthSlice';



const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessageEmail, setErrorMessageEmail] = useState('');
    const [errorMessagePassword, setErrorMessagePassword] = useState('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showToggleButton, setShowToggleButton] = useState<boolean>(false);

    //email validation on change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setErrorMessageEmail('Please enter a valid email');
        } else {
            setErrorMessageEmail('');
        }

        
        if(email.trim().length === 0){
            setErrorMessageEmail('Please enter your email');
        }

        setUsername(email);
    };

    //password validation on change
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        const trimmedPassword = password.trim();
    
        if (!trimmedPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            setErrorMessagePassword('Enter a valid password');
        } else {
            setErrorMessagePassword('');
        }

        if(password.trim().length === 0){
            setErrorMessagePassword('Please enter your password')
        }

        setPassword(password);
        setShowToggleButton(password.length > 0);
    };
    const dispatch = useDispatch();
    
    // email and password validation on submit
    const handleClick = () => {
        if (username.length === 0 && password.length === 0) {
            setErrorMessageEmail('Please enter your email');
            setErrorMessagePassword('Please enter your password');
            return;
        }

        if(!password){
            setErrorMessagePassword('Please enter your password');
            return;
        }
        if(errorMessagePassword){
            setErrorMessagePassword('Please enter valid password');
            return;
        }
        if(!username ){
            setErrorMessageEmail('Please enter your email');
            return;
        }
        if(errorMessageEmail){
            setErrorMessageEmail('Please enter valid email');
            return;
        }
        // setUsername(username);
        // navigate('/dashboard', { state: { username: username } });
        dispatch(setUser({user: username, password: password}));
        navigate('/dashboard')
    };

    // toggle of eye icon
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='login-page'>
            <h1 style={{color: 'white'}}>Login Page</h1>
            <div className="form">
                <div className="input-container">
                    <label style={{color: 'white'}}>Email: </label>
                    <input type="text" name="uname" id="username" value={username} onChange={handleEmailChange} required /><br/>
                    {errorMessageEmail && <span style={{color:'black'}}>{errorMessageEmail}</span>}
                </div><br/>
                <div className="input-container">
                    <div className="password-input">
                        <label style={{color: 'white'}}>Password: </label>
                        <input type={showPassword ? "text" : "password"} name="pass" id="password" value={password} onChange={handlePasswordChange} required />
                        {showToggleButton && (
                            <button type="button" onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        )}
                        <div></div>
                    {errorMessagePassword && <span style={{color:'black'}}>{errorMessagePassword}</span>}
                    </div><br/>
                </div>
                <div className="button-container">
                    <input style={{borderRadius:'5px', borderColor:'beige'}} type="submit" onClick={handleClick} />
                </div>
            </div>
        </div>
    );
};

export default Login;
