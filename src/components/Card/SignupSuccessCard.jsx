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


export default function SignupSuccessCard({ firstName, shopes }) {

    const navigate = useNavigate();

    const buttonClicked = () => {
        navigate("/")
    }

    return (
        <Grid container className="flex" style={{ height: "100vh" }} >

            <Card sx={{ maxWidth: {sm:"470px",xs:"260px"}, flexDirection: "column" }} className='flex' >
                <span onClick={() => buttonClicked()} >
                    <img src={logo} height='40px' style={{ margin: "10px" }} />
                </span>
                <CardMedia
                    component="img"
                    height="194"
                    image={backgroundImage}
                    alt="Paella dish"
                />
                <CardContent className='flex' style={{ maxWidth: 445, flexDirection: "column", textAlign: "center" }} >
                    <Typography variant='h4' >Thank You For SignUp</Typography>
                    <br />
                    {/* <Typography variant="body1" >Hey, {firstName}!</Typography> */}
                    <Typography variant="body1" >
                        Your requisition form has been submitted.
                    </Typography>
                    <Typography variant="body1" >
                        You will be notify after the approval.
                    </Typography>
                </CardContent>
                <CardActions disableSpacing style={{ marginTop: "-30px" }} className='flex' >
                    {/* <button>Go to Home</button> */}
                    <Button buttonName={"Home Page"} onClick={buttonClicked} />
                    {/* <button>Place new order</button> */}
                </CardActions>
            </Card>
        </Grid>
    );
}
