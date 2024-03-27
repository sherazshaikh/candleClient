import { CircularProgress, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import './recentorder.css'
import TableRow from '../../components/TableRow/TableRow'
import { executeApi } from '../../utils/WithAuth'
import { variables } from '../../utils/config'
import { useDispatch, useSelector } from 'react-redux'

const RecentOrder = () => {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [allOrders, setAllOrders] = useState([]);
    let { baseURL, auth: { token, user: { firstName } } } = useSelector((state) => state);

    const getAllOrders = () => {
        setIsLoaded(true)
        executeApi(baseURL + variables.PrevOrders.url, {}, variables.PrevOrders.method, token, dispatch)
            .then((data) => {
                setIsLoaded(false)
                setAllOrders(data.data || [])
            })
            .catch((error) => console.log(error.message))
    }

    useEffect(() => {
        getAllOrders();
    }, [])

    return (
        <Grid container >
            <Grid item container className='recentOrderNabar' >
                <Navbar />
            </Grid>
            <Grid container className="recentOrderHero flex">
                <Grid item container md={10} sm={11} sx={{display:{xs:"flex", sm:"block"}}} xs={12} className='recentOrderHerMain flex' >
                    <Grid item md={12} xs={11} sx={{height:{xs:"5%",sm:"15%"   }}} className='recentOrderHerMainHeading' >
                        <Typography variant='h4' sx={{marginBottom:{md : "20px !important" , xs:"0px"}}}> Recent Orders</Typography>
                    </Grid>
                    <Grid item container md={12} sm={12} xs={12} className='recentOrderHerMainTableSection' >
                        <Grid item container sx={{display:{xs:'none', sm:"flex"}}} sm={12} md={12} >
                            <Grid item md={3} sm={3} className='greyFont flex'   >
                                Order
                            </Grid>
                            <Grid item md={2.5} sm={2.5} className='greyFont flex'  >
                                Status
                            </Grid>
                            <Grid item md={2.5} sm={2.5} className='greyFont flex'   >
                                Pickup
                            </Grid>
                            <Grid item md={2} sm={2} className='greyFont flex' >
                                PO
                            </Grid>
                            <Grid item md={2} sm={2} className='greyFont flex' >
                                Payment
                            </Grid>
                        </Grid>
                        <Grid item container md={12} sm={12} className='recentOrderHerMainTableListSection' >
                            {
                                isLoaded ?
                                    <div className='flex' style={{ height: "100%" }} >
                                        <CircularProgress style={{ color: "#e9520c" }} />
                                    </div>
                                    :
                                  allOrders.length > 0 ? allOrders.map((item) => {
                                        const inputDate = new Date(item.createdwhenDate);
                                        // Format the date as "DD Month YYYY"
                                        const options = { day: 'numeric', month: 'long', year: 'numeric' };
                                        const formattedDate = inputDate.toLocaleDateString('en-US', options);
                                        return <TableRow item={item} formattedDate={formattedDate} baseURL={baseURL} token={token} firstName={firstName}/>
                                    })
                                    : <div className='flex' style={{color:'#e9520c', height:"100%"}} >No Data Found !</div>
                                }
                        </Grid>
                    </Grid>

                </Grid>
                <Footer />
            </Grid>
        </Grid>
    )
}

export default RecentOrder