import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField,
  Typography, TableSortLabel
} from "@mui/material";

export default function ScrollableTable({ list }) {
  const [searchText, setSearchText] = useState("");
  const [orderDirection, setOrderDirection] = useState("asc"); // asc or desc

  const [listData, setListData] = useState([]);

  const handleSortClick = () => {
    setOrderDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const filteredRows = list?.filter((row) =>
    row.webOrderNum?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
    row.oracleOrderNumber?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
    row.orderDateTime?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
    row.productCode?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
    row.productName?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
    row.hsade?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
    row.orderQty?.toString().toLowerCase().includes(searchText.toLowerCase())
  )?.map((row) => ({
    ...row,
    id: row.rowuid,
  }));

  const sortedRows = [...(filteredRows || [])].sort((a, b) => {
    const aVal = a.webOrderNum || "";
    const bVal = b.webOrderNum || "";

    if (orderDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const dateFormatter = (date) => {
    const inputDate = new Date(date);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    };
    return inputDate.toLocaleDateString("en-US", options) || "";
  };

  return (
    <Paper sx={{ padding: '0 2px', boxShadow: 'none' }}>
      <TextField
        fullWidth
        label="Search"
        variant="outlined"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <TableContainer sx={{ maxHeight: 400 }} component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active
                  direction={orderDirection}
                  onClick={handleSortClick}
                >
                  <b>Order No.</b>
                </TableSortLabel>
              </TableCell>
              <TableCell><b>Oracle Order No.</b></TableCell>
              <TableCell><b>Order Date</b></TableCell>
              <TableCell><b>Product Code</b></TableCell>
              <TableCell><b>Product Name</b></TableCell>
              <TableCell><b>Shade</b></TableCell>
              <TableCell><b>Order Qty.</b></TableCell>
              <TableCell><b>Deliver Qty.</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.webOrderNum}</TableCell>
                <TableCell>{row.oracleOrderNumber}</TableCell>
                <TableCell>{dateFormatter(row.orderDateTime)}</TableCell>
                <TableCell>{row.productCode}</TableCell>
                <TableCell>{row.productName}</TableCell>
                <TableCell>{row.shade}</TableCell>
                <TableCell>{row.orderQty}</TableCell>
                <TableCell>{row.deliveredQty}</TableCell>
              </TableRow>
            ))}
            {sortedRows?.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  No matching results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="body2" sx={{ marginTop: 2, textAlign: "right" }}>
        Total Order: {filteredRows?.length}
      </Typography>
    </Paper>
  );
}
