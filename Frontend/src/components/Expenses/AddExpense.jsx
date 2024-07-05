import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { addExpenseAction } from "../../redux/actions/asyncExpenseAction";

const expenseCategories = [
  "Groceries",
  "Rent",
  "Utilities",
  "Transportation",
  "Entertainment",
  "Dining Out",
  "Healthcare",
  "Insurance",
  "Education",
  "Clothing",
];

const textfieldTheme = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#bfa181",
    },
    "&:hover fieldset": {
      borderColor: "#bfa181",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#bfa181",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#bfa181",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#bfa181",
  },
};

const AddExpense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { description, amount, category } = expenseData;
    const parsedAmount = parseFloat(amount);
    const formattedExpenseData = {
      description,
      amount: isNaN(parsedAmount) ? 0 : parsedAmount,
      category,
    };
    const response = await dispatch(addExpenseAction(formattedExpenseData));
    const expenseStatus = response?.type.split("/")[1];
    if (expenseStatus === "fulfilled") {
      navigate("/expense-list");
    }
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ p: isSmallScreen && 4 }}>
      <Card
        sx={{
          maxWidth: 550,
          margin: "80px auto",
          backgroundColor: "#fceddc",
        }}
      >
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Typography
              variant="h4"
              align="center"
              sx={{ color: "#bfa181", fontWeight: 700 }}
            >
              Fill your expense
            </Typography>
            <TextField
              name="description"
              required
              margin="normal"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              onChange={handleChange}
              value={expenseData.description}
              sx={textfieldTheme}
            />
            <TextField
              name="amount"
              required
              margin="normal"
              label="Amount"
              type="number"
              fullWidth
              variant="outlined"
              onChange={handleChange}
              value={expenseData.amount}
              sx={textfieldTheme}
            />

            <FormControl
              variant="outlined"
              fullWidth
              margin="normal"
              sx={textfieldTheme}
            >
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                name="category"
                labelId="category-select-label"
                label="Category"
                variant="outlined"
                onChange={handleChange}
                value={expenseData.category}
              >
                {expenseCategories.map((expense) => (
                  <MenuItem key={expense} value={expense}>
                    {expense}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                mt: 1,
                backgroundColor: "#bfa181",
                color: "#0A1828",
                "&:hover": {
                  backgroundColor: "#a3805a",
                },
                fontWeight: 600,
              }}
            >
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddExpense;
