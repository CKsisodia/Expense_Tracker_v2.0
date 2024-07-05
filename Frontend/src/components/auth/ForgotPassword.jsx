import React, { useState } from "react";
import styles from "../../styles/AccessLayout.module.css";
import EmailIcon from "@mui/icons-material/Email";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordAction } from "../../redux/actions/asyncAuthAction";
import { toast } from "react-toastify";
import { Vortex } from "react-loader-spinner";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [focus, setFocus] = useState({ email: false });
  const [email, setEmail] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);

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
    setEmail((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await dispatch(forgotPasswordAction(email));
      setEmail({ email: "" });
      setFocus({ email: false });
      const status = response?.type?.split("/")[1];
      if (status === "fulfilled") {
        navigate("/login");
      }
    } catch (err) {
      toast.error("Failed , Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.formSubmit} onSubmit={handleSubmit}>
      <img src="/avatar.svg" alt="avatar" />
      <h2>Forgot Password</h2>
      <h4>We'll send a recovery link to</h4>
      <div
        className={`${styles["input-div"]} ${styles.one} ${
          focus.email ? styles.focus : ""
        }`}
      >
        <div className={styles.i}>
          <EmailIcon className={focus.email ? styles["focused-icon"] : ""} />
        </div>
        <div className={styles.div}>
          <h5>Enter email</h5>
          <input
            type="text"
            className={styles.input}
            onChange={handleInputChange}
            onFocus={() => handleFocus("email")}
            onBlur={(e) => handleBlur("email", e.target.value)}
            name="email"
            required
          />
        </div>
      </div>
      <Link to="/login" className={styles.anchor}>
        Return to login!
      </Link>
      {!loading ? (
        <input
          type="submit"
          className={styles.btn}
          value="Send recovery link"
        />
      ) : (
        <Vortex
          visible={true}
          height="80"
          width="80"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={[
            "#38d39f",
            "#38d39f",
            "#38d39f",
            "#38d39f",
            "#38d39f",
            "#38d39f",
          ]}
        />
      )}
    </form>
  );
};

export default ForgotPassword;
