import { Box, Grid } from "@mui/material";
import React from "react";
import PremiumUserBenefits from "./PremiumUserBenefits";
import ExpenseList from "./ExpenseList";
import { useSelector } from "react-redux";
import { selectUserData } from "../../redux/reducers/authReducers";
import { useState } from "react";

const PremiumLayout = () => {
  const storedParams = JSON.parse(localStorage.getItem("queryParams"));

  const user = useSelector(selectUserData);
  const [viewVal, setViewVal] = useState(storedParams?.view || "all");

  const viewHandler = (val) => {
    setViewVal(val);
  };

  return (
    <Grid container spacing={2} p={4}>
      {user?.data?.premiumUser && (
        <Grid item xs={12} md={4}>
          <PremiumUserBenefits viewHandler={viewHandler} />
        </Grid>
      )}
      <Grid item xs={12} md={user?.data?.premiumUser ? 8 : 12}>
        <ExpenseList viewVal={viewVal} />
      </Grid>
    </Grid>
  );
};

export default PremiumLayout;
