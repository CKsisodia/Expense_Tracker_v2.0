import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Stack, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteExpenseAction,
  getAllExpenseAction,
} from "../../redux/actions/asyncExpenseAction";
import { selectExpenseData } from "../../redux/reducers/expenseSlice";
import formatDate from "../../utils/formattedDate";
import EditExpense from "./EditExpense";
import { useState } from "react";

const columns = [
  { id: "category", label: "Category", align: "left", minWidth: 100 },
  { id: "description", label: "Description", align: "left", minWidth: 100 },
  {
    id: "amount",
    label: "Amount",
    minWidth: 100,
    align: "left",
  },
  {
    id: "date",
    label: "Date",
    minWidth: 100,
    align: "center",
  },
  {
    id: "actions",
    label: "Actions",
    minWidth: 100,
    align: "right",
  },
];

const ExpenseList = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [expenseId, setExpenseId] = useState(null);

  const expenseData = useSelector(selectExpenseData);

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  useEffect(() => {
    dispatch(getAllExpenseAction());
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteHandler = (expenseId) => {
    dispatch(deleteExpenseAction(expenseId));
  };

  const editHandler = (id) => {
    setEditDialogOpen(true);
    setExpenseId(id)
  };

  return (
    <Paper sx={{ m: "80px auto auto auto" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: "#DBF2FF",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {expenseData?.data && !!expenseData?.data?.length ? (
            <TableBody>
              {expenseData?.data
                // ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align="left">{row.category}</TableCell>
                      <TableCell align="left">{row.description}</TableCell>
                      <TableCell align="left">₹{row.amount}</TableCell>
                      <TableCell align="center">
                        {formatDate(row.updatedAt)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          sx={{ color: "#eb8690" }}
                          size="small"
                          onClick={() => deleteHandler(row.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          sx={{ color: "#527d57" }}
                          size="small"
                          onClick={() => editHandler(row.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <EditExpense
                          expenseData={expenseData?.data?.filter(item => item.id === expenseId)}
                          open={editDialogOpen}
                          handleClose={handleEditDialogClose}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography align="center" variant="h6">
                    No Data found !
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={expenseData?.data ? expenseData?.data?.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ExpenseList;
