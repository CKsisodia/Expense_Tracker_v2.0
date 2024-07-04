import {
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

const filterExpenses = [
  { id: "all", val: "All" },
  { id: "daily", val: "Daily" },
  { id: "weekly", val: "Last Week" },
  { id: "monthly", val: "Last Month" },
];

const PremiumUserBenefits = (props) => {
  const dispatch = useDispatch();
  const storedParams = JSON.parse(localStorage.getItem("queryParams"));
  const [viewVal, setViewVal] = useState(storedParams?.view || "all");

  const [shake, setShake] = useState(false);

  useEffect(() => {
    setViewVal(storedParams?.view);
  }, []);

  const handleClick = async () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
    const response = await dispatch(downloadExpensesAction());
    const urlStatus = response?.type?.split("/")[1];
    if (urlStatus === "fulfilled") {
      const { fileUrl, fileName } = response?.payload?.data;
      downloadFile(fileUrl, fileName);
    }
  };

  const downloadHandler = useThrottle(handleClick, 5000);

  const shakeAnimation = `
    @keyframes shake {
      0% { transform: translate(1px, 1px) rotate(0deg); }
      10% { transform: translate(-1px, -2px) rotate(-1deg); }
      20% { transform: translate(-3px, 0px) rotate(1deg); }
      30% { transform: translate(3px, 2px) rotate(0deg); }
      40% { transform: translate(1px, -1px) rotate(1deg); }
      50% { transform: translate(-1px, 2px) rotate(-1deg); }
      60% { transform: translate(-3px, 1px) rotate(0deg); }
      70% { transform: translate(3px, 1px) rotate(-1deg); }
      80% { transform: translate(-1px, -1px) rotate(1deg); }
      90% { transform: translate(1px, 2px) rotate(0deg); }
      100% { transform: translate(1px, -2px) rotate(-1deg); }
    }

    .shake {
      animation: shake 0.5s;
    }
  `;

  return (
    <Card sx={{ margin: "80px auto" }}>
      <CardContent>
        <Typography
          variant="h4"
          align="center"
          sx={{ color: "#023364", fontWeight: 700 }}
        >
          Day to Day Expenses
        </Typography>

        <FormControl variant="outlined" fullWidth margin="normal">
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
        <style>{shakeAnimation}</style>
        <Typography variant="h5">Download Your Expenses</Typography>
        <IconButton
          sx={{ color: "#38d39f" }}
          size="small"
          className={shake ? "shake" : ""}
          onClick={downloadHandler}
        >
          <FaDownload size="2rem" />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default PremiumUserBenefits;
