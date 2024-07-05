import React, { useState } from "react";
import styles from "../../styles/AccessLayout.module.css";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch } from "react-redux";
import {
  getUserInfoAction,
  userLoginAction,
} from "../../redux/actions/asyncAuthAction";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [focus, setFocus] = useState({ email: false, password: false });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleFocus = (field) => {
    setFocus((prevFocus) => ({ ...prevFocus, [field]: true }));
  };

  const handleBlur = (field, value) => {
    if (value === "") {
      setFocus((prevFocus) => ({ ...prevFocus, [field]: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(userLoginAction(loginData));
    await dispatch(getUserInfoAction());
    const status = response?.type?.split("/")[1];
    if (status === "fulfilled") {
      navigate("/");
    }
    setLoginData({
      email: "",
      password: "",
    });
    setFocus({ email: false, password: false });
  };

  return (
    <form className={styles.formSubmit} onSubmit={handleSubmit}>
      <img src="/avatar.svg" alt="avatar" />
      <h2>Welcome back !</h2>
      <div
        className={`${styles["input-div"]} ${styles.one} ${
          focus.email ? styles.focus : ""
        }`}
      >
        <div className={styles.i}>
          <EmailIcon className={focus.email ? styles["focused-icon"] : ""} />
        </div>
        <div className={styles.div}>
          <h5>Email</h5>
          <input
            type="text"
            className={styles.input}
            onChange={handleInputChange}
            onFocus={() => handleFocus("email")}
            onBlur={(e) => handleBlur("email", e.target.value)}
            name="email"
            required
            value={loginData.email}
          />
        </div>
      </div>
      <div
        className={`${styles["input-div"]} ${styles.pass} ${
          focus.password ? styles.focus : ""
        }`}
      >
        <div className={styles.i}>
          <LockIcon className={focus.password ? styles["focused-icon"] : ""} />
        </div>
        <div className={styles.div}>
          <h5>Password</h5>
          <input
            type="password"
            className={styles.input}
            onChange={handleInputChange}
            onFocus={() => handleFocus("password")}
            onBlur={(e) => handleBlur("password", e.target.value)}
            name="password"
            required
            autoComplete="new-password"
            value={loginData.password}
          />
        </div>
      </div>
      <div className={styles["forgot-password"]}>
        <Link to="/forgot-password" className={styles.anchor}>
          Forgot password ?
        </Link>
        <Link to="/signup" className={styles.anchor}>
          New user ?
        </Link>
      </div>

      <input type="submit" className={styles.btn} value="Login" />
    </form>
  );
};

export default Login;
