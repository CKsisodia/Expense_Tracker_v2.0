import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { MdOutlineDoNotDisturb, MdWorkspacePremium } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { selectLeaderBoardData } from "../../redux/reducers/expenseSlice";
import { useEffect } from "react";
import { getLeaderboardAction } from "../../redux/actions/asyncExpenseAction";
import { Box } from "@mui/material";

const columns = [
  { id: "username", label: "Username", align: "left", minWidth: 100 },
  {
    id: "total-expense",
    label: "Total Expense",
    minWidth: 100,
    align: "left",
  },
  {
    id: "subscription",
    label: "Subscription",
    minWidth: 100,
    align: "center",
  },
];

const LeaderBoard = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const leaderBoardData = useSelector(selectLeaderBoardData);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    dispatch(getLeaderboardAction());
  }, [dispatch]);

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ m: "40px auto auto auto", backgroundColor: "#fceddc" }}>
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
                      backgroundColor: "#bfa181",

                      fontWeight: 700,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {leaderBoardData?.data && !!leaderBoardData?.data?.length ? (
              <TableBody>
                {leaderBoardData?.data
                  // ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((row,index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                      >
                        <TableCell align="left">{row.username}</TableCell>
                        <TableCell align="left">
                          {row.totalAmount
                            ? `₹${row.totalAmount}`
                            : "No expenses"}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton sx={{ color: "#eb8690" }} size="small">
                            {row.premiumUser ? (
                              <MdWorkspacePremium color="green" size="2rem" />
                            ) : (
                              <MdOutlineDoNotDisturb
                                color="orange"
                                size="2rem"
                              />
                            )}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4}>
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
          count={leaderBoardData?.data ? leaderBoardData?.data?.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default LeaderBoard;
