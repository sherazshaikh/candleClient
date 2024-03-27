import React, { useEffect, useState } from 'react'
import './orderdetails.css'
import { Grid, Typography } from '@mui/material'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer';
import { useNavigate, useParams } from "react-router-dom"
import { executeApi } from '../../utils/WithAuth';
import { useDispatch, useSelector } from 'react-redux';
import { variables } from '../../utils/config';
import DownloadIcon from '@mui/icons-material/Download';

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [order, setOrder] = useState({});
    let { baseURL, auth: { token, user: { firstName } } } = useSelector((state) => state);


    const getOrder = (id) => {
        executeApi(baseURL + variables.SpecificOrder.url.replace("{{orderId}}", id), {}, variables.SpecificOrder.method, token, dispatch)
            .then((data) => {
                console.log(data.data);
                setOrder(data.data)
            })
            .catch((error) => console.log(error.message))
    }

    const orderDate = (createdwhenDate) => {
        if (createdwhenDate) {
            const inputDate = new Date(createdwhenDate);
            // Format the date as "DD Month YYYY"
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const formattedDate = inputDate.toLocaleDateString('en-US', options);
            return `Date: ${formattedDate}`
        } else {
            return "-"
        }
    }


    useEffect(() => {
        getOrder(orderId);
    }, [orderId])

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
        <>
            <Grid container style={{ height: "78px" }} >
                <Navbar />
            </Grid>
            <Grid container className='flex orderDetailsMain' >
                <Grid item container md={10} xs={12} sm={11} >
                    <Grid item container md={12} sm={12} >
                        <Grid item container md={12} sm={12} xs={11} sx={{paddingLeft:{xs:"10px",sm:"0px"}}} onClick={() => navigate("/recentOrders") } >
                            <Typography variant='body1' style={{ opacity: "0.5", marginBottom: "5px", cursor:"pointer" }}><b>{"< All Orders"}</b></Typography>
                        </Grid>
                        <Grid item container md={6} xs={6} sm={6} sx={{paddingLeft:{xs:"20px",sm:"0px"},paddingTop:{xs:"10px",sm:"0px"}}}  >
                            <Typography variant='h4'><b>Order # {orderId}</b></Typography>
                        </Grid>
                        <Grid item container md={6} xs={6} sx={{display:{xs:"flex", sm:"none"}}} className='orderDetailActionButtons' >
                            {  order.poAttachment ?  <button onClick={() => downloadFile(order.poAttachment, order.rowuid)} className='InquireOrderButton flex' ><DownloadIcon /> &nbsp;PO Attachment</button> : ""}
                            {/* <button className='cancelShipmentButton' > Cancel Shipment</button> */}
                        </Grid>
                        <Grid item container md={12} sm={12} className="orderDetailStatusSection" >
                            <Grid item md={1} ></Grid>
                            <Grid item md={2} xs={6} sm={3} >
                                <Typography variant='p' className='greyFont' >Status</Typography>
                                <br />
                                <Typography variant='p'>{order?.orderStatus ? order?.orderStatus : "-"}</Typography>
                            </Grid>
                            <Grid item md={6} xs={6} sm={6} sx={{display:{xs:"block", sm:"flex"}}} className='flex' style={{flexDirection:"column"}} >
                                <Typography variant='body2' className='greyFont' >Pickup Point</Typography>
                                <Typography variant='body1'>{order.branchDesc}</Typography>
                            </Grid>
                            <Grid item md={3} sm={3} xs={12} sx={{display:{xs:"block", sm:"flex"}, paddingTop:{xs:"10px",sm:"0px"}}} className='flex' style={{flexDirection:"column"}} >
                                <Typography variant='body2' className='greyFont' >Payment Status</Typography>
                               
                                <Typography variant='body1'> {order?.ordertype}</Typography>
                            </Grid>
                           
                        </Grid>
                        <Grid item container md={12} sm={12} sx={{}} className='orderDetailsDeliveryDurationSection' >
                            <Grid item md={3} xs={6} sm={3} sx={{display:{xs:"block", sm:"flex"},backgroundColor:{xs:"#f8f8f8", sm:"transparent"},paddingLeft:{xs:"10px", sm:"0px"}, paddingTop:{xs:"10px", ms:"0px"}, borderRadius:"5px 0px 0px 0px"}} className='flex' >
                                <Typography variant='body1' className='greyFont' >Order On</Typography>
                            </Grid>
                            <Grid item md={6} sm={6} xs={0} className='flex' >
                                {/* <Typography variant='h4' ><b>Delivery Duration</b></Typography> */}
                            </Grid>
                            <Grid item md={3} sm={3} xs={6} sx={{display:{xs:"block", sm:"flex"},backgroundColor:{xs:"#f8f8f8", sm:"transparent"},paddingLeft:{xs:"10px", sm:"0px"}, paddingTop:{xs:"10px", ms:"0px"}, borderRadius:"0px 5px 0px 0px"}} className='flex' >
                                <Typography variant='body1' className='greyFont' >Delivered To</Typography>
                            </Grid>
                            <Grid item xs={6} sx={{display:{xs:"block", sm:"none"},backgroundColor:{xs:"#f8f8f8", sm:"transparent"},paddingLeft:{xs:"10px", sm:"0px"}, paddingTop:{xs:"10px", ms:"0px"}, borderRadius:"0px 0px 0px 5px"}} className='flex' >
                                <Typography variant='body2'>{orderDate(order?.orderDate).split(":")[1]}</Typography>
                            </Grid>
                            
                            
                            <Grid item xs={6} sx={{display:{xs:"block", sm:"none"},backgroundColor:{xs:"#f8f8f8", sm:"transparent"},paddingLeft:{xs:"10px", sm:"0px"}, paddingTop:{xs:"10px", ms:"0px"}, borderRadius:"0px 0px 5px 0px"}} className='flex' >
                                <Typography variant='h6'>{order?.isdelivered?.[0] ? order?.recName : "-" }</Typography>
                            </Grid>
                            <Grid item md={3} sm={3} sx={{display:{xs:"none", sm:"none", md:'flex'},backgroundColor:{xs:"#f8f8f8", sm:"transparent"}}} className='flex' >
                                <Typography variant='h6'>{orderDate(order?.orderDate)}</Typography>
                            </Grid>
                            <Grid item md={3} sm={3} sx={{display:{xs:"none", sm:"flex", md:'none'},backgroundColor:{xs:"#f8f8f8", sm:"transparent"}, textAlign:"center"}} className='flex' >
                                <Typography variant='h6'>{orderDate(order?.orderDate).split(":")[1]}</Typography>
                            </Grid>
                            <Grid item md={6} sm={6}  className='flex' >
                                {/* <Typography variant='h6'>Over-Night Delivery</Typography> */}
                            </Grid>
                            <Grid item md={3} sm={3} sx={{display:{xs:"none", sm:"flex"},backgroundColor:{xs:"#f8f8f8", sm:"transparent"}}} className='flex' >
                                <Typography variant='body2'>{order?.isdelivered?.[0] ? order?.recName : "-" }</Typography>
                            </Grid>
                        </Grid>
                        <Grid item container md={12} sx={{marginTop : {xs : "0px" , md : "49px"}}} className='orderDetailOrderdItems' >
                            <Grid item md={6}  sx={{display :{xs:"none" , md:"block"} ,  paddingLeft:{xs:"10px",sm:"0px"}}}  >
                                <Typography variant='h5'>Ordered Items</Typography>
                            </Grid>
                            <Grid item md={6} style={{ display: "flex", justifyContent: "flex-end" }} >
                                {/* <Typography variant='h6' className='flex' > <FileDownloadIcon />&nbsp;Download Invoice</Typography> */}
                            </Grid>
                            <Grid item container md={12} sm={12} sx={{marginTop:{xs:"0px", sm:"10px"}, boxShadow:{xs:"none"}}} className='OrderItemSection' >
                                <Grid item container sx={{display:{xs:"none", sm:"flex"}}} className='orderItemSectionHeader' >

                                    <Grid item md={4.8} sm={4} className='greyFont' >
                                        Product
                                    </Grid>
                                    <Grid item md={1.8} sm={2} className='greyFont' >Shade No.</Grid>
                                    <Grid item md={1.8} sm={2} className='greyFont' >Yardage</Grid>
                                    <Grid item md={1.8} sm={2} className='greyFont' >Ordered Quantity</Grid>
                                    <Grid item md={1.8} sm={2} className='greyFont'>Delivered Quantity</Grid>
                                </Grid>
                                <Grid item container md={12} sm={12} className='OrderItemSectionRow' >
                                    {
                                        order?.orderDetails?.map((item , index) => (
                                            <>
                                                <Grid item md={4.8} xs={12} sm={4} sx={{borderBottom:{xs:"none", sm:"1px solid lightGrey"}}} >
                                                    <Typography sx={{display:{xs:"block", sm:"none"} }} variant='body2' style={{color:"grey"}} > {item.lottypeDesc} </Typography>
                                                    <Grid sx={{display:{xs:"none", sm:"block"}}} >{item.lottypeDesc} </ Grid>
                                                </Grid>
                                                <Grid item md={1.8} sm={2} xs={12} sx={{borderBottom:{xs:"none", sm:"1px solid lightGrey"} , marginBottom : {xs:"20px", sm:"0px"}}} >
                                                    {/* <Typography sx={{display:{xs:"block", sm:"none"}}} variant='body2' style={{color:"grey"}} > Shade</Typography> */}
                                                    
                                                    <Grid sx={{display:{xs:"none", sm:"block"}}} >{item.shadeCode ? item.shadeCode : "-" }</ Grid>
                                                    <Grid sx={{display:{xs:"block", sm:"none"} }} >{item.shadeCode ? item.shadeCode : "-" }</ Grid>
                                                    </Grid>
                                                <Grid item md={1.8} sm={2} xs={3} sx={{borderBottom:{xs:"none", sm:"1px solid lightGrey"}}}>
                                                    <Typography sx={{display:{xs:"block", sm:"none"} , fontSize: "10px" }} variant='body2' style={{color:"grey"}} > Yardage</Typography>
                                                    {item.yardage}
                                                    </Grid>
                                                <Grid item md={1.8} sm={2} xs={3} sx={{borderBottom:{xs:"none", sm:"1px solid lightGrey"}}} >
                                                    <Typography sx={{display:{xs:"block", sm:"none"} , fontSize: "10px"}} variant='body2' style={{color:"grey"}} > Ordered Qty</Typography>
                                                    {item.orderQty}
                                                    </Grid>
                                                <Grid item md={1.8} sm={2} xs={3} sx={{display:{xs:"block", sm:"none"},borderBottom:{xs:"none", sm:"1px solid lightGrey"}}} >
                                                    <Typography sx={{display:{xs:"block", sm:"none"}, fontSize: "10px"}} variant='body2' style={{color:"grey"}} > Delivered Qty</Typography>
                                                    {item?.deliveredQty ? item?.deliveredQty : "-" }
                                                    </Grid>
                                                 {order?.orderDetails?.length - 1 != index ? <Grid item md={0} xs={12} sx={{display:{xs:"block", sm:"none"}}} style={{borderBottom:"1px solid lightGrey" , margin :"25px 0px"}}></Grid> : "" } 
                                                <Grid item container sx={{display:{xs:"none", sm:"flex"}, marginBottom:{xs:"20px", sm:"0px"},paddingBottom:{xs:"20px", sm:"0px"}}} xs={12} md={1.8} sm={2} style={{borderBottom:"1px solid lightGrey"}} className=' flex'>
                                                    <Grid item md={12} >
                                                    <Typography sx={{display:{xs:"block", sm:"none"}}} variant='body2' style={{color:"grey"}} > Delivered Qty</Typography>
                                                        {item?.deliveredQty ? item?.deliveredQty : "-" }
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))
                                    }

                                </Grid>
                                {/* <Grid item md={12} style={{ border: "2px solid lightGrey" }}></Grid> */}
                                {/* <Grid item md={10} className='OrderItemSectionPrice' >
                                    <Typography variant='body1' className='greyFont'>Items Cost:</Typography>
                                    <Typography variant='body1' className='greyFont'>Delivery Cost:</Typography>
                                    <Typography variant='body1' className='greyFont'>Taxes:</Typography>
                                    <br />
                                    <Typography variant='h6'><b>Total:</b></Typography>
                                </Grid>
                                <Grid item md={2} style={{ marginTop: "5px" }} >
                                    <Typography variant='body1' className='greyFont'>&nbsp;{order?.currencyCode} N/A</Typography>
                                    <Typography variant='body1' className='greyFont'>&nbsp;{order?.currencyCode} N/A</Typography>
                                    <Typography variant='body1' className='greyFont'>&nbsp;{order?.currencyCode} N/A</Typography>
                                    <br />
                                    <Typography variant='h6'><b>{order?.currencyCode}&nbsp;N/A</b></Typography>
                                </Grid> */}
                            </Grid>
                        </Grid>
                        {/* <Grid item container md={12} className='orderDetailOrderdItems' >
                            <Grid item md={6} >
                                <Typography variant='h5'>Refund Items</Typography>
                            </Grid>
                            <Grid item md={6} style={{ display: "flex", justifyContent: "flex-end" }} >
                                <Typography variant='h6' className='flex' > <FileDownloadIcon />&nbsp;Download Refund Invoice</Typography>
                            </Grid>
                            <Grid item container md={12} className='OrderItemSection' >
                                <Grid item container className='orderItemSectionHeader' >

                                    <Grid item md={7} className='greyFont greyFont' >
                                        Color Code
                                    </Grid>
                                    <Grid item md={1} className='greyFont' >Yardage</Grid>
                                    <Grid item md={1} className='greyFont' >Ticket</Grid>
                                    <Grid item md={1} className='greyFont' >Quantity</Grid>
                                    <Grid item md={2} className='greyFont'>Price</Grid>
                                </Grid>

                                <Grid item container md={12} className='OrderItemSectionRow flex' >
                                    <Grid item md={7}  >
                                        01-000022-3315 Sea Pink 1
                                    </Grid>
                                    <Grid item md={1}  >500</Grid>
                                    <Grid item md={1}  >100</Grid>
                                    <Grid item md={1}  >5</Grid>
                                    <Grid item container md={2} className='flex'>
                                        <Grid item md={6} >
                                            USD 123
                                        </Grid>
                                        <Grid item md={6} className='flex greyFont' >
                                            <DeleteIcon />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={12} style={{ border: "1px solid lightGrey" }}></Grid>
                                <Grid item md={10} className='OrderItemSectionPrice' >
                                    <Typography variant='body1' className='greyFont'>Items Cost:</Typography>
                                    <Typography variant='body1' className='greyFont'>Return Policy:</Typography>
                                    <br />
                                    <Typography variant='h6'><b>Total:</b></Typography>
                                </Grid>
                                <Grid item md={2} style={{ marginTop: "5px" }} >
                                    <Typography variant='body1' className='greyFont'>&nbsp;USD 10</Typography>
                                    <Typography variant='body1' className='greyFont'>&nbsp;60%</Typography>
                                    <br />
                                    <Typography variant='h6'>&nbsp;<b>USD 30</b></Typography>
                                </Grid>
                            </Grid>
                        </Grid> */}
                    </Grid>
                </Grid>
                <Grid item md={12} style={{ border: "1px solid lightGrey", marginTop: "20px" }} ></Grid>
                <Footer />
            </Grid>
        </>
    )
}

export default OrderDetails