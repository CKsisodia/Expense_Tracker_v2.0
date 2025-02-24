import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  InputBase,
  Typography
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { useEffect, useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useDebounceVal } from "../../hooks/useDebounce";
import {
  deleteExpenseAction,
  getAllExpenseAction,
} from "../../redux/actions/asyncExpenseAction";
import {
  expenseAction,
  selectExpenseData
} from "../../redux/reducers/expenseSlice";
import formatDate from "../../utils/formattedDate";
import EditExpense from "./EditExpense";

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

const ExpenseList = (props) => {
  const dispatch = useDispatch();
  const expenseData = useSelector(selectExpenseData);
  const storedParams = JSON.parse(localStorage.getItem("queryParams"));

  const [page, setPage] = useState(storedParams?.page || 0);
  const [rowsPerPage, setRowsPerPage] = useState(storedParams?.pageSize || 5);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [expenseId, setExpenseId] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearchValue = useDebounceVal(searchValue, 500);

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  useEffect(() => {
    const queryParams = {
      page: page,
      pageSize: rowsPerPage,
      sortBy: "createdAt",
      orderBy: "DESC",
      search: debouncedSearchValue,
      view: props.viewVal,
    };
    dispatch(expenseAction.setQueryParams(queryParams));
    dispatch(getAllExpenseAction(queryParams));
  }, [dispatch, page, rowsPerPage, debouncedSearchValue, props.viewVal]);

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
    setExpenseId(id);
  };

  return (
    <Paper sx={{ m: "40px auto auto auto", backgroundColor: "#fceddc" }}>
      <TableContainer sx={{ maxHeight: 440}}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                align="right"
                colSpan={6}
                style={{ backgroundColor: "#fceddc" }}
              >               
                <Paper
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    maxWidth: "50%",
                    backgroundColor: "#fceddc",
                  }}
                >
                  <MagnifyingGlass
                  visible={true}
                  height="30"
                  width="30"
                  ariaLabel="magnifying-glass-loading"
                  wrapperStyle={{}}
                  wrapperClass="magnifying-glass-wrapper"
                  glassColor="#c0efff"
                  color="#178582"
                />
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search..."
                    inputProps={{
                      "aria-label": "Search...",
                    }}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </Paper>
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    top: 58,
                    minWidth: column.minWidth,
                    backgroundColor: "#bfa181",
                    fontWeight: 700,
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
                        {formatDate(row.createdAt)}
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
                          expenseData={expenseData?.data?.filter(
                            (item) => item.id === expenseId
                          )}
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
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={expenseData?.data ? expenseData?.total : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ExpenseList;
