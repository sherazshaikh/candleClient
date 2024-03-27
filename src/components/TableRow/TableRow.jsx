import { Grid, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { executeApi } from '../../utils/WithAuth';
import { useDispatch } from 'react-redux';
import { variables } from '../../utils/config';

const TableRow = ({ item, formattedDate, baseURL, token, firstName }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const downloadFile = (url, orderId) => {
        fetch(baseURL + variables.DownloadFile.url + `?fileName=${url}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {

                return response.blob();
            })
            .then(blob => {
                // Handle the file content (e.g., open or download it)
                // Example: open the file in a new tab
                // const url = window.URL.createObjectURL(blob);
                // window.open(url, '_blank');

                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);

                // Set the download attribute with the desired file name
                link.download = `${orderId}-${firstName}.pdf`;

                // Append the link to the document body
                document.body.appendChild(link);

                // Programmatically click the link to trigger the download
                link.click();

                // Remove the link from the document
                document.body.removeChild(link);

            })

    }
    return (
        <Grid item container md={12} sm={12} sx={{ display: { xs: "flex", sm: "flex" }, padding:{xs:"20px", sm:"0px"} }} className='recentOrderRow' onClick={() => navigate(`/orderDetails/${item?.rowuid}`)} >
            <Grid item md={3} sm={3} xs={8} sx={{ display: { xs: "block", sm: "flex" }, padding: { xs: "5px", sm: "0px" }, textAlign:{xs:"left", sm:"center"} }} className='flex' style={{ flexDirection: "column" }}  >
                <Typography variant='h6'>Order #{item?.rowuid}</Typography>
                <Typography variant='body2'>Date: {formattedDate}</Typography>
            </Grid>
            <Grid item md={2.6} sm={2.6} xs={4} sx={{ display: { xs: "block", sm: "flex" }, padding: { xs: "5px", sm: "0px" }, paddingTop:{xs:"10px", sm:"0px"} }} className='flex' >
                <Typography sx={{ display: { xs: "block", sm: "none" } }} style={{ fontSize: "10px", color: "gray" }}>Order Status</Typography>

                <Typography variant='body2'>{item?.orderStatus ? item?.orderStatus : "-"}</Typography>
            </Grid>
            <Grid item md={2.5} sm={2.5} xs={8} sx={{ display: { xs: "block", sm: "flex" }, padding: { xs: "5px", sm: "0px" } }} className='flex'   >
                <Typography sx={{ display: { xs: "block", sm: "none" } }} style={{ fontSize: "10px", color: "gray" }}>Shipped To</Typography>
                <Typography variant='body2'>{item.branchDesc}</Typography>
            </Grid>

            <Grid item md={2} sm={2} sx={{ display: { xs: "none", sm: "flex" } }} className='flex'  >
                <Typography variant='body2'> {item.poAttachment ? <a onClick={() => downloadFile(item.poAttachment, item.rowuid)}> <InsertDriveFileOutlinedIcon style={{ color: "#e46e39" }} /> </a> : "-"}</Typography>
            </Grid>
            <Grid item md={1.9} sm={1.9} xs={4} sx={{ display: { xs: "block", sm: "flex" }, padding: { xs: "5px", sm: "0px" } }} className='flex' >
                <Typography sx={{ display: { xs: "block", sm: "none" } }} style={{ fontSize: "10px", color: "gray" }}>Payment</Typography>
                <Typography variant='body2'>{item.ordertype}</Typography>
                {/* <button className='recentOrderRowButton flex'  > <Typography variant='body2' > <b>Details</b></Typography> </button> */}
            </Grid>
        </Grid>
    )
}

export default TableRow