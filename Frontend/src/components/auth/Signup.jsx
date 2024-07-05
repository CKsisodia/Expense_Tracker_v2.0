import React, { useState } from "react";
import styles from "../../styles/AccessLayout.module.css";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import { useDispatch } from "react-redux";
import { userSignupAction } from "../../redux/actions/asyncAuthAction";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [focus, setFocus] = useState({
    username: false,
    email: false,
    password: false,
  });
  const [signupData, setSignupData] = useState({
    username: "",
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
    setSignupData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(userSignupAction(signupData));
    const status = response?.type?.split("/")[1];
    if (status === "fulfilled") {
      navigate("/login");
    }

    setSignupData({
      username: "",
      email: "",
      password: "",
    });
    setFocus({ username: false, email: false, password: false });
  };

  return (
    <form className={styles.formSubmit} onSubmit={handleSubmit}>
      <img src="/avatar.svg" alt="avatar" />
      <h2>Join us today !</h2>

      <div
        className={`${styles["input-div"]} ${styles.one} ${
          focus.username ? styles.focus : ""
        }`}
      >
        <div className={styles.i}>
          <PersonIcon
            className={focus.username ? styles["focused-icon"] : ""}
          />
        </div>
        <div className={styles.div}>
          <h5>Username</h5>
          <input
            type="text"
            className={styles.input}
            name="username"
            onChange={handleInputChange}
            onFocus={() => handleFocus("username")}
            onBlur={(e) => handleBlur("username", e.target.value)}
            required
            value={signupData.username}
          />
        </div>
      </div>
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
            type="email"
            className={styles.input}
            name="email"
            onChange={handleInputChange}
            onFocus={() => handleFocus("email")}
            onBlur={(e) => handleBlur("email", e.target.value)}
            required
            value={signupData.email}
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
            name="password"
            onChange={handleInputChange}
            onFocus={() => handleFocus("password")}
            onBlur={(e) => handleBlur("password", e.target.value)}
            autoComplete="new-password"
            required
            value={signupData.password}
          />
        </div>
      </div>
      <Link to="/login" className={styles.anchor}>
        Already a user ?
      </Link>
      <input type="submit" className={styles.btn} value="Sign up" />
    </form>
  );
};

export default Signup;
