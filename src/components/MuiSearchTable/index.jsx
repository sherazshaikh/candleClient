import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField,
  Typography, TableSortLabel, useMediaQuery
} from "@mui/material";

export default function ScrollableTable({ list }) {
  const [searchText, setSearchText] = useState("");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [sortOn, setSortOn] = useState("nmbr");
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleSortClick = (sort) => {
    setSortOn(sort)
    setOrderDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const filteredRows = list?.filter((row) => {
    for (let key in row) {
      if (row[key]?.toString().toLowerCase().includes(searchText.toLowerCase()))
        return row
    }
  }

    // row.webOrderNum?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
    // row.oracleOrderNumber?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
    // row.orderDateTime?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
    // row.productCode?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
    // row.productName?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
    // row.hsade?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
    // row.orderQty?.toString().toLowerCase().includes(searchText.toLowerCase())
  )?.map((row) => ({
    ...row,
    id: row.rowuid,
  }));

  const sortedRows = [...(filteredRows || [])].sort((a, b) => {
    let key = sortOn == 'date' ? "orderDateTime" : sortOn == 'nmbr' ? 'webOrderNum' : "productCode"
    const aVal = a[key] ||  "";
    const bVal = b[key] ||  "";

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
      month: isMobile ? "short" : "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    };
    return inputDate.toLocaleDateString("en-US", options) || "";
  };

  return (
    <Paper sx={{ padding: isMobile ? '0' : '0 2px', boxShadow: 'none' }}>
      <TextField
        fullWidth
        label="Search"
        variant="outlined"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ marginBottom: 2 }}
        size={isMobile ? "small" : "medium"}
      />

      <TableContainer
        sx={{
          maxHeight: 400,
          overflowX: 'auto',

        }}
        component={Paper}
      >
        <Table stickyHeader size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: isMobile ? 90 : 120 }}>
                <TableSortLabel
                  active
                  direction={orderDirection}
                  onClick={() => handleSortClick('nmbr')}
                >
                  <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                    {isMobile ? "Order No." : "Order Number"}
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ minWidth: isMobile ? 90 : 120 }}>
                <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                  {isMobile ? "Oracle No." : "Oracle Order No."}
                </Typography>
              </TableCell>
              <TableCell sx={{ minWidth: isMobile ? 120 : 150 }}>
                <TableSortLabel
                  active
                  direction={orderDirection}
                  onClick={() => handleSortClick('date')}
                >
                  <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                    Order Date
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ minWidth: isMobile ? 90 : 120 }}>
                <TableSortLabel
                  active
                  direction={orderDirection}
                  onClick={() => handleSortClick('code')}
                >
                  <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                    {isMobile ? "Prod Code" : "Product Code"}
                  </Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ minWidth: isMobile ? 90 : 120 }}>
                <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                  {isMobile ? "Product" : "Product Name"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                  Shade
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                  {isMobile ? "Order Qty" : "Order Qty."}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                  {isMobile ? "Deliver Qty" : "Deliver Qty."}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows?.map((row, i) => (
              <TableRow key={i} hover>
                <TableCell>
                  <Typography variant="body2">
                    {row.webOrderNum}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.oracleOrderNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {dateFormatter(row.orderDateTime)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.productCode}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.productName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.shade}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.orderQty}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.deliveredQty}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {sortedRows?.length === 0 && (
              <TableRow >
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2">
                    No matching results.
                  </Typography>
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