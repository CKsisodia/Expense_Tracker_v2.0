import { Box, Grid } from "@mui/material";
import React from "react";
import PremiumUserBenefits from "./PremiumUserBenefits";
import ExpenseList from "./ExpenseList";
import { useSelector } from "react-redux";
import { selectUserData } from "../../redux/reducers/authReducers";

const PremiumLayout = () => {
  const user = useSelector(selectUserData);

  console.log(user)

  return (
    <Grid container spacing={2} p={4}>
      {user?.data?.premiumUser && (
        <Grid item xs={12} md={4}>
          <PremiumUserBenefits />
        </Grid>
      )}
      <Grid item xs={12} md={user?.data?.premiumUser ? 8 : 12}>
        <ExpenseList />
      </Grid>
    </Grid>
  );
};

export default PremiumLayout;
