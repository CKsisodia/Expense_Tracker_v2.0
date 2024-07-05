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
import { useEffect, useState } from "react";
import { FcPrint } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadHistoryAction } from "../../redux/actions/asyncExpenseAction";
import { selectDownloadHistoryData } from "../../redux/reducers/expenseSlice";
import formatDate from "../../utils/formattedDate";
import downloadFile from "../../utils/downloadFile";
import useThrottle from "../../hooks/useThrottle";
import { Box } from "@mui/material";

const columns = [
  { id: "filename", label: "Filename", align: "left", minWidth: 100 },
  {
    id: "downloaded",
    label: "Downloaded",
    minWidth: 100,
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
    align: "center",
  },
];

const DownloadHistory = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const downloadHistory = useSelector(selectDownloadHistoryData);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    dispatch(getDownloadHistoryAction());
  }, []);

  const handleClick = (fileurl, filename) => {
    downloadFile(fileurl, filename);
  };

  const downloadHandler = useThrottle(handleClick, 5000);


  return (
    <Box sx={{p:4}}>
       <Paper sx={{ m: "40px auto auto auto",backgroundColor:'#fceddc' }}>
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
                    fontWeight:700
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {downloadHistory && !!downloadHistory?.length ? (
            <TableBody>
              {downloadHistory
                // ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align="left">{row.fileName}</TableCell>
                      <TableCell align="left">
                        {formatDate(row.createdAt)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          sx={{ color: "green" }}
                          size="small"
                          onClick={() =>
                            downloadHandler(row.fileUrl, row.fileName)
                          }
                        >
                          <FcPrint size="2rem" />
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
        count={downloadHistory ? downloadHistory?.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </Box>
   
  );
};

export default DownloadHistory;
