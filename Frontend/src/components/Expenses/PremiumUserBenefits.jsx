import {
  Box,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { useDispatch } from "react-redux";
import useThrottle from "../../hooks/useThrottle";
import { downloadExpensesAction } from "../../redux/actions/asyncExpenseAction";
import downloadFile from "../../utils/downloadFile";
import { Circles } from "react-loader-spinner";
import { toast } from "react-toastify";

const filterExpenses = [
  { id: "all", val: "All" },
  { id: "daily", val: "Daily" },
  { id: "weekly", val: "Last Week" },
  { id: "monthly", val: "Last Month" },
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

const PremiumUserBenefits = (props) => {
  const dispatch = useDispatch();
  const storedParams = JSON.parse(localStorage.getItem("queryParams"));
  const [viewVal, setViewVal] = useState(storedParams?.view || "all");
  const [isDownload, setIsDownload] = useState(false);

  useEffect(() => {
    setViewVal(storedParams?.view);
  }, []);

  const handleClick = async () => {
    const response = await dispatch(downloadExpensesAction());
    const urlStatus = response?.type?.split("/")[1];
    if (urlStatus === "fulfilled") {
      setIsDownload(true);
      const { fileUrl, fileName } = response?.payload?.data;
      setTimeout(() => {
        downloadFile(fileUrl, fileName);
        setIsDownload(false);
      }, 2000);
    } else {
      toast.error("Please add some expenses or try again after sometime");
    }
  };

  const downloadHandler = useThrottle(handleClick, 5000);

  return (
    <Card sx={{ margin: "40px auto", backgroundColor: "#fceddc" }}>
      <CardContent>
        <Typography
          variant="h4"
          align="center"
          sx={{ color: "#bfa181", fontWeight: 700 }}
        >
          Day to Day Expenses
        </Typography>

        <FormControl
          variant="outlined"
          fullWidth
          margin="normal"
          sx={textfieldTheme}
        >
          <InputLabel id="filter-select-label">Filter</InputLabel>
          <Select
            name="filter"
            labelId="filter-select-label"
            label="Filter"
            variant="outlined"
            value={viewVal}
            onChange={(e) => {
              props.viewHandler(e.target.value);
              setViewVal(e.target.value);
            }}
          >
            {filterExpenses.map((expense) => (
              <MenuItem
                key={expense.id}
                value={expense.id || storedParams?.view}
              >
                {expense.val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{display:'flex',flexDirection:'column', alignItems:'center', mt:2}}>
          <Typography variant="h5" sx={{ color: "#bfa181" }} align="center">
            Download Your Expenses
          </Typography>
          {!isDownload ? (
            <IconButton
              sx={{ color: "#178582" }}
              size="large"
              onClick={downloadHandler}
            >
              <FaDownload size="4rem" />
            </IconButton>
          ) : (
            <Circles
              height="80"
              width="80"
              color="#178582"
              ariaLabel="circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={isDownload}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PremiumUserBenefits;
