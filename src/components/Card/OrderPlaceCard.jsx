import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import backgroundImage from '../../assets/Mask Group 12.png'
import logo from '../../assets/Group 151.png'
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { emptyCart } from '../../pages/redux/features/cart/cartslice';


export default function OrderPlaceCard({ debouncedApiCall, firstName, shopes }) {

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const buttonClicked = () => {
        navigate("/recentOrders")
    }

    React.useEffect(() => {
        dispatch(emptyCart());
        debouncedApiCall()

    }, [])


    return (
        <Grid container className="flex" style={{ height: "100vh" }} >
            
            <Card sx={{ maxWidth: {xs:"300px", sm:"470px"}, flexDirection: "column" }} className='flex' >
                <span>
                    <img src={logo} height='40px' style={{ margin: "10px" }} />
                </span>

                <CardMedia
                    component="img"
                    height="194"
                    image={backgroundImage}
                    alt="Paella dish"
                />
                <CardContent className='flex' style={{ maxWidth: 445, flexDirection: "column", textAlign: "center" }} >
                    <Typography variant='h4' >Thanks for Ordering</Typography>
                    <Typography variant="body1" >Hey, {firstName}!</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Thank you for choosing us! We appreciate your order and look forward to exceeding your expectations.
                    </Typography>
                </CardContent>
                <CardActions disableSpacing style={{ marginTop: "-30px" }} className='flex' >
                    {/* <button>Go to Home</button> */}
                    <Button buttonName={"My Orders"} onClick={buttonClicked} />
                    {/* <button>Place new order</button> */}
                </CardActions>
            </Card>
        </Grid>
    );
}
