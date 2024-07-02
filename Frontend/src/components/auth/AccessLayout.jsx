import React from "react";
import styles from "../../styles/AccessLayout.module.css";

const AccessLayout = ({ children }) => {
  return (
    <div className={styles.bodyContainer}>
      <img className={styles.wave} src="/wave.png" alt="wave" />
      <div className={styles.container}>
        <div className={styles.image}>
          <img src="/bg.svg" alt="background" />
        </div>
        <div className={styles["auth-content"]}>{children}</div>
      </div>
    </div>
  );
};

export default AccessLayout;
