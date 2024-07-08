import LockIcon from "@mui/icons-material/Lock";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { resetPasswordAction } from "../../redux/actions/asyncAuthAction";
import styles from "../../styles/AccessLayout.module.css";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token"));
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  const [focus, setFocus] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [resetPassword, setResetPassword] = useState({
    newPassword: "",
    confirmPassword: "",
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
    setResetPassword((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPasswordData = {
      newPassword: resetPassword.newPassword,
      confirmPassword: resetPassword.confirmPassword,
      token: token,
    };
    const response = await dispatch(resetPasswordAction(newPasswordData));
    const status = response?.type?.split("/")[1];
    if (status === "fulfilled") {
      setIsPasswordChanged(true);
    }
    setResetPassword({
      newPassword: "",
      confirmPassword: "",
    });
    setFocus({
      newPassword: false,
      confirmPassword: false,
    });
  };

  return !isPasswordChanged ? (
    <form className={styles.formSubmit} onSubmit={handleSubmit}>
      <img src="/avatar.svg" alt="avatar" />
      <h2>Reset Password</h2>
      <div
        className={`${styles["input-div"]} ${styles.pass} ${
          focus.newPassword ? styles.focus : ""
        }`}
      >
        <div className={styles.i}>
          <LockIcon
            className={focus.newPassword ? styles["focused-icon"] : ""}
          />
        </div>
        <div className={styles.div}>
          <h5>New password</h5>
          <input
            type="password"
            className={styles.input}
            onChange={handleInputChange}
            onFocus={() => handleFocus("newPassword")}
            onBlur={(e) => handleBlur("newPassword", e.target.value)}
            name="newPassword"
            required
            autoComplete="new-password"
            value={resetPassword.newPassword}
          />
        </div>
      </div>
      <div
        className={`${styles["input-div"]} ${styles.pass} ${
          focus.confirmPassword ? styles.focus : ""
        }`}
      >
        <div className={styles.i}>
          <LockIcon
            className={focus.confirmPassword ? styles["focused-icon"] : ""}
          />
        </div>
        <div className={styles.div}>
          <h5>Confirm password</h5>
          <input
            type="password"
            className={styles.input}
            onChange={handleInputChange}
            onFocus={() => handleFocus("confirmPassword")}
            onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
            name="confirmPassword"
            required
            autoComplete="new-password"
            value={resetPassword.confirmPassword}
          />
        </div>
      </div>
      <input type="submit" className={styles.btn} value="Change password" />
    </form>
  ) : (
    <div className={styles.passwordSucces}>
      <img src="/passwordSuccess.png" alt="passwordSuccess" />
      <a href="/login" className={styles.anchor}>
        Return to login ?
      </a>
    </div>
  );
};

export default ResetPassword;
