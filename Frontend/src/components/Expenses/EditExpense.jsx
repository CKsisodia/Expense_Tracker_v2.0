import CloseIcon from "@mui/icons-material/Close";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateExpenseAction } from "../../redux/actions/asyncExpenseAction";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

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

const EditExpense = ({ open, handleClose, expenseData }) => {
  const dispatch = useDispatch();

  const [editFormData, setEditFormData] = useState({
    updateDescription: "",
    updateAmount: "",
    updateCategory: "",
  });

  useEffect(() => {
    if (expenseData) {
      setEditFormData({
        updateDescription: expenseData[0]?.description || "",
        updateAmount: expenseData[0]?.amount || "",
        updateCategory: expenseData[0]?.category || "",
      });
    }
  }, [expenseData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedUpdatedAmount = parseFloat(editFormData.updateAmount);
    const formattedUpdateExpenseData = {
      expenseId: expenseData[0]?.id,
      updateDescription: editFormData.updateDescription,
      updateAmount: isNaN(parsedUpdatedAmount) ? 0 : parsedUpdatedAmount,
      updateCategory: editFormData.updateCategory,
    };
    dispatch(updateExpenseAction(formattedUpdateExpenseData));
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            mb: "-24px",
            color: "#023364",
            fontWeight: 700,
            fontSize: "28px",
          }}
        >
          Edit your expense
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              name="updateDescription"
              required
              margin="normal"
              label="Update description"
              type="text"
              fullWidth
              variant="outlined"
              onChange={handleChange}
              value={editFormData.updateDescription}
            />
            <TextField
              name="updateAmount"
              required
              margin="normal"
              label="Update amount"
              type="number"
              fullWidth
              variant="outlined"
              onChange={handleChange}
              value={editFormData.updateAmount}
            />

            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel id="category-select-label">
                Update category
              </InputLabel>
              <Select
                name="updateCategory"
                labelId="category-select-label"
                label="Update Category"
                variant="outlined"
                onChange={handleChange}
                value={editFormData.updateCategory}
              >
                {expenseCategories.map((expense) => (
                  <MenuItem key={expense} value={expense}>
                    {expense}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              sx={{
                mr: 2,
                backgroundColor: "#38d39f",
                color: "#023364",
                "&:hover": {
                  backgroundColor: "#229c73",
                },
                fontWeight: 600,
              }}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default EditExpense;
