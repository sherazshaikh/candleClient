import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function ScrollableTable({ list }) {
  const [searchText, setSearchText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const filteredRows = list?.filter((row) =>
    row.orderNum?.toString().toLowerCase().includes(searchText.toLowerCase())
  )
    ?.map((row) => ({
      orderNumber: row.orderNum,
      orderDate: row.orderDate,
      orderTime: row.orderTime,
      id: row.rowuid,
      orderDetails: row.orderDetails
    }));

  const handleView = (row) => {
    console.log("row", row)
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  return (
    <Paper sx={{ padding: '0 2px' }}>
      <TextField
        fullWidth
        label="Search"
        variant="outlined"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <TableContainer sx={{ maxHeight: 400, overflowY: "auto" }} component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Order No.</b></TableCell>
              <TableCell><b>Order Date</b></TableCell>
              <TableCell><b>Order Time</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.orderNumber}</TableCell>
                <TableCell>{row.orderDate}</TableCell>
                <TableCell>{row.orderTime}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleView(row?.orderDetails)}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredRows?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No matching results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Modal */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><b>Category</b></TableCell>
                  <TableCell><b>Shade</b></TableCell>
                  <TableCell><b>HS Code</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  selectedRow?.map((row) => (
                    <TableRow key={row.rowuid}>
                      {/* <TableCell><b>Category</b></TableCell> */}
                      <TableCell>{row.lottypeDesc}</TableCell>

                      {/* <TableCell><b>Shade</b></TableCell> */}
                      <TableCell>{row.shadeCode}</TableCell>

                      {/* <TableCell><b>HS Code</b></TableCell> */}
                      <TableCell>{row.hsCode}</TableCell>
                    </TableRow>
                  ))
                }


              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
