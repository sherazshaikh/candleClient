import { Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { executeApi } from '../../utils/WithAuth';
import { useDispatch } from 'react-redux';
import { variables } from '../../utils/config';
import PopupAlert from '../../components/PopupAlert/PopupAlert';


const TableRow = ({ item, formattedDate, baseURL, token, firstName, updateData }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isCancelled, setCancelled] = useState(false)
    const [showPopup, setShowPopup] = useState(false)
    const [message, setMessage] = useState()
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

    const handleOrderCancel = async (item) => {
        console.log('Item', item)
        

        if (item.orderStatus == "Order Pending") {
            setCancelled(true)
              await fetch(baseURL + `/v1/Order/cancelOrder?rowuid=${item.rowuid}`, {
                method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        
                    },
                }).then((data) => {
                    if(data.ok){
                        updateData()
                    } else {
                        setMessage('APi Failed!')
                        setShowPopup(true)
                    }
                    setCancelled(false)
                }).catch((error) => {
                    console.log('error', error)
                    setCancelled(false)
                   
                })
           
          
        } else{
            setShowPopup(true)
            setMessage('Only Panding Orders Can be Cancelled')
        }  
      

    }
      // ERROR TOASTER SHOW 
      const handleClosePopup = () => {
        setShowPopup(false)
    }
    return (
        <Grid item container md={12} sm={12} sx={{ display: { xs: "flex", sm: "flex" }, padding: { xs: "20px", sm: "0px" } }} className='recentOrderRow' >
            <Grid onClick={() => navigate(`/orderDetails/${item?.rowuid}`)} item md={2} sm={2} xs={8} sx={{ display: { xs: "block", sm: "flex" }, padding: { xs: "5px", sm: "0px" }, textAlign: { xs: "left", sm: "center" } }} className='flex' style={{ flexDirection: "column" }}  >
                <Typography variant='h6'>Order # {item?.orderNum}</Typography>
                <Typography variant='body2'>Date: {formattedDate}</Typography>
            </Grid>
            <Grid onClick={() => navigate(`/orderDetails/${item?.rowuid}`)} item md={2} sm={2} xs={4} sx={{ display: { xs: "block", sm: "flex" }, padding: { xs: "5px", sm: "0px" }, paddingTop: { xs: "10px", sm: "0px" } }} className='flex' >
                <Typography sx={{ display: { xs: "block", sm: "none" } }} style={{ fontSize: "10px", color: "gray" }}>Order Status</Typography>

                <Typography variant='body2'>{item?.orderStatus ? item?.orderStatus : "-"}</Typography>
            </Grid>
            <Grid onClick={() => navigate(`/orderDetails/${item?.rowuid}`)} item md={2} sm={2} xs={8} sx={{ display: { xs: "block", sm: "flex" }, padding: { xs: "5px", sm: "0px" } }} className='flex'   >
                <Typography sx={{ display: { xs: "block", sm: "none" } }} style={{ fontSize: "10px", color: "gray" }}>Shipped To</Typography>
                <Typography variant='body2'>{item.branchDesc}</Typography>
            </Grid>

            <Grid onClick={() => navigate(`/orderDetails/${item?.rowuid}`)} item md={2} sm={2} sx={{ display: { xs: "none", sm: "flex" } }} className='flex'  >
                <Typography variant='body2'> {item.poAttachment ? <a onClick={() => downloadFile(item.poAttachment, item.rowuid)}> <InsertDriveFileOutlinedIcon style={{ color: "#e46e39" }} /> </a> : "-"}</Typography>
            </Grid>
            <Grid onClick={() => navigate(`/orderDetails/${item?.rowuid}`)} item md={2} sm={2} xs={4} sx={{ display: { xs: "block", sm: "flex" }, padding: { xs: "5px", sm: "0px" } }} className='flex' >
                <Typography sx={{ display: { xs: "block", sm: "none" } }} style={{ fontSize: "10px", color: "gray" }}>Payment</Typography>
                <Typography variant='body2'>{item.ordertype}</Typography>
                {/* <button className='recentOrderRowButton flex'  > <Typography variant='body2' > <b>Details</b></Typography> </button> */}
            </Grid>
            <Grid key={item.rowuid} item md={2} sm={2} xs={4} sx={{ display: { xs: "block", sm: "flex" }, padding: { xs: "5px", sm: "0px" }, alignItems: "center" }} className='flex'>
                <Typography
                    sx={{ display: { xs: "block", sm: "none" } }}
                    style={{ fontSize: "10px", color: "gray", marginBottom: "5px" }}
                >
                    Action
                </Typography>

                <button
                    className='recentOrderRowButton flex'
                    onClick={(e) => {
                        handleOrderCancel(item);
                    }}
                    style={{
                        padding: "5px 10px",
                        backgroundColor: "#e46e39",
                        border: "none",
                        color: "white",
                        borderRadius: "4px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                    }}
                    disabled={isCancelled}
                >
                    <Typography variant='body2'><b>{isCancelled ? 'Loading...' : 'Cancel'} </b></Typography>
                </button>
            </Grid>
            <PopupAlert open={showPopup} message={message} severty={'error'} onClose={handleClosePopup} />

        </Grid>
    )
}

export default TableRow