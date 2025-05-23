import { Backdrop, CircularProgress, Grid, Typography, Paper, IconButton } from "@mui/material"
import React, { useEffect, useState } from "react"
import Navbar from "../../components/Navbar/Navbar"
import "./home.css"
import Footer from "../../components/Footer/Footer"
import { variables } from "../../utils/config"
import { executeApi } from "../../utils/WithAuth"
import { useDispatch, useSelector } from "react-redux"
import { v4 } from "uuid"
import { updateCart } from "../redux/features/cart/cartslice"
import zIndex from "@mui/material/styles/zIndex"
import Carousel from "react-material-ui-carousel"
import { isMobile } from "react-device-detect"
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material"
import { Button } from "antd"

// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import MyCarousel from '../../components/MyCarousel/MyCarousel';
// import VerticalCarousel from '../../components/VerticalCarousel/VerticalCarousel';

const Home = () => {
	const user = useSelector((state) => state.auth.isAuthenticated)
	let {
		baseURL,
		auth: { token },
	} = useSelector((state) => state)
	const dispatch = useDispatch()
	const [open, setOpen] = React.useState(false)
	const [imagesWeb, setWebImages] = React.useState([])
	const [imagesMobile, setMobileImages] = React.useState([])
	const [images, setImages] = React.useState([])
	const [transitionDirection, setTransitionDirection] = useState("right")
	const [currentIndex, setCurrentIndex] = useState(0)
	const [timer, setTimer] = useState(0)
	const [deviceType, setDeviceType] = useState(isMobile ? "Mobile" : "Desktop")

	const executeInitails = () => {
		console.log("user", user)
		if (user) {
			setOpen(true)
			executeApi(baseURL + variables.getCart.url, {}, variables.getCart.method, token, dispatch)
				.then((data) => {
					var finalObject = data.data.map((item) => {
						let jsonData = item
						let dataArray = jsonData.shadecodelist.split("OBJEND")
						dataArray.pop()
						// Map the array elements back into objects
						let parsedArray = dataArray.map((item) => {
							let [shadeCode, shadeDesc] = item.split("BTWOBJ")
							return { shadeCode, shadeDesc }
						})
						return {
							LottypeCode: {
								label: jsonData.lottypecode.split("BTWOBJ")[0],
								value: jsonData.lottypecode.split("BTWOBJ")[1],
								HsCode: jsonData.lottypecode.split("BTWOBJ")[2],
							},
							shade: parsedArray,
							ShadeCode: { label: jsonData.shadecode.split("BTWOBJ")[0], value: jsonData.shadecode.split("BTWOBJ")[1] },
							yardage: jsonData.yardagelist.split("BTWOBJ"),
							selectedYardage: {
								label: jsonData.yardage.split("BTWOBJ")[0],
								value: jsonData.yardage.split("BTWOBJ")[1],
								HsCode: jsonData.yardage.split("BTWOBJ")[2],
							},
							OrderQty: jsonData.qty,
							product: {},
							productCategoryList: [],
							price: 0,
							uuid: v4(),
						}
					})

					dispatch(updateCart(finalObject))
					setOpen(false)
				})
				.catch((err) => {
					setOpen(false)
					console.log(err)
				})
		}
	}

	useEffect(() => {
		getImages()
		executeInitails()
	}, [])

	const getImages = async () => {
		await fetch("/config.json")
			.then((response) => response.json())
			.then((data) => {
				setTimer(data.delay)
			})

		await fetch("/webImages.json")
			.then((response) => response.json())
			.then((data) => {
				setWebImages(data.images)
			})

		await fetch("/mobileImages.json")
			.then((response) => response.json())
			.then((data) => {
				setMobileImages(data.images)
			})

		console.log("ismobile", isMobile)
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex === imagesMobile.length - 1 ? 0 : prevIndex + 1))
		}, timer)
		return () => clearInterval(interval) // Cleanup interval on component unmount
	}, [imagesMobile])

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex === imagesWeb.length - 1 ? 0 : prevIndex + 1))
		}, timer)
		return () => clearInterval(interval) // Cleanup interval on component unmount
	}, [imagesWeb])

	return (
		<Grid container sx={{ position: "relative" }}>
			<Navbar />

			<Grid
				container
				className="heroDiv"
				sx={{
					position: "relative",
					width: "100%",
					height: "100%",
				}}
			>
				{/* {images.map((image, index) => (
					<Grid
						item
						xs={12}
						key={index}
						sx={{
							position: "absolute",
							top: 0,
							left: `${(index - currentIndex) * 100}%`,
							width: "100%",
							height: "100%",
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundImage: `url(${image})`,
							transition: "left 0.5s ease-in-out",
							display: `${Math.abs(index - currentIndex) <= 1 ? "block" : "none"}`, // Show only adjacent images
						}}
					>
						<div
							style={{
								position: "relative",
								width: "100%",
								height: "100%",
								backgroundColor: "rgba(0, 0, 0, 0.3)", // Light black overlay
							}}
						></div>
					</Grid>
				))} */}
				<Grid item xs={12} sx={{ position: "absolute", top: 0, left: 0, zIndex: 9, width: "100%" }}>
					<Carousel
						indicators={true}
						animation="slide"
						autoPlay={true}
						interval={timer}
						swipe={true}
						navButtonsAlwaysVisible={false}
						navButtonsProps={{
							className: "nav-buttons",
						}}
						// NavButton={({ onClick, className, style, next, prev }) => {
						// 	return (
						// 		<IconButton onClick={() =>{console.log('Button clicked');}} className={`${className} nav-button`} style={style}>
						// 			{next && <ArrowForwardIos />}
						// 			{prev && <ArrowBackIos />}
						// 		</IconButton>
						// 	)
						// }}

						// next={ () => {console.log("next")} }
						// prev={ () => {console.log("prev")} }
					>
						{deviceType === "Mobile"
							? imagesMobile.map((image, index) => (
									<Grid key={index} container justifyContent="center" alignItems="center" sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
										<Paper
											className="cursoualContainerClass"
											sx={{
												position: "relative",
												width: "100%",
												backgroundSize: "contain",
												backgroundPosition: "center",
												backgroundRepeat: "no-repeat",
												backgroundImage: `url(${image})`,
											}}
										>
										</Paper>
									</Grid>
							  ))
							: imagesWeb.map((image, index) => (
									<Grid key={index} container justifyContent="center" alignItems="center" sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
										<Paper
											className="cursoualContainerClass"
											sx={{
												position: "relative",
												width: "100%",
												objectFit: "contain",
												backgroundPosition: "center",
												backgroundRepeat: "no-repeat",
												backgroundImage: `url(${image})`,
											}}
										></Paper>
									</Grid>
							  ))}
					</Carousel>
				</Grid>

				<Grid container style={{ zIndex: 10 }} className="heroDiv">
					{/* <Grid item container md={7} xs={11} sx={{ marginTop: { xs: "20vh", md: "100px" } }} className="heroDivContent">
						<Typography variant="h3" sx={{ fontFamily: "Axiforma" }}>
							Threading Colors into Your World
						</Typography>
						<Grid item md={8} xs={11}>
							<Typography variant="p" style={{ marginTop: "0px", opacity: "0.6" }}>
								With our state of the art facility we produce 100 product variants and 150 unique colors everyday with precise focus on quality, product safety.
							</Typography>
						</Grid>
					</Grid> */}
				</Grid>
			</Grid>

			<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>
			{/* <Grid container className='productSection' >
        <Grid item container md={12} >
          <Grid item md={1} />
          <Grid item container md={5} className='productSectionContentSection' >
            <Grid item xs={12}>
              <Typography variant='h6' className='sectionHeading' >
                OUR PRODUCTS
              </Typography>
            </Grid>
            <Grid xs={8} item sx={{ marginBottom: "30px" }} >

              <Typography variant='h3' sx={{ marginBottom: "20px" }} >
                Plethora of Colors &nbsp;
              </Typography>
              <Typography variant='p'  >
                We have been using candle thread for the last 18
                years and haven’t faced any problem so far. There
                is no thread breakage while running.
              </Typography>
            </Grid>
            <Grid item container xs={12} >
              <button className='productSectionNavButton flex' style={{ marginRight: "20px" }} ><ArrowBackIcon /></button>
              <button className='productSectionNavButton flex ' style={{ marginRight: "20px" }} > <ArrowForwardIcon /> </button>
              <button className='productSectionProdButton' > See All Products </button>
            </Grid>
          </Grid>
          <Grid item container md={6} className='productSectionCardSection' >
            <MyCarousel />
          </Grid>
        </Grid>
      </Grid>
      <Grid container className='certifiedSection flex' >
        <Grid item container md={10} className='certifiedSectionMain flex'  >
          <Grid item md={4} className='certifiedSectionContent' >
            <Typography typography='h3' >Certified Premium Quality in</Typography>
            <Typography typography='h3' sx={{ fontWeight: "bold", marginBottom: "20px" }} >8 Countries</Typography>
            <Typography typography='p' >We have been using candle thread for the last 18
              years and haven’t faced any problem so far. There
              is no thread breakage while running.</Typography>
            <Grid item container md={12} className='certifiedSectionImages' >
              <Grid item md={4} className='certifiedSectionImages1' >
              </Grid>
              <Grid item md={4} className='certifiedSectionImages2' ></Grid>
              <Grid item md={4} className='certifiedSectionImages3' ></Grid>
            </Grid>
          </Grid>
          <Grid item md={8} className='certifiedSectionBack' ></Grid>
        </Grid>
      </Grid>
      <Grid container className='aboudUsSection flex' >
        <Grid container item md={10} className='aboudUsSectionMain' >
          <Grid md={6} container item className='aboudUsSectionContent' >
            <Grid item xs={12} >
              <Typography variant='h6' sx={{ marginBottom: "20px" }} className='sectionHeading' >
                ABOUT US
              </Typography>
            </Grid>
            <Typography variant='h3' sx={{ fontWeight: "bold", marginBottom: "20px" }} >25 Years </Typography>
            <Typography variant='h3' sx={{ marginBottom: "20px" }} >Of Experience In Yarn Processing Industry</Typography>
            <Typography variant='p' sx={{ marginBottom: "20px", color: "#333333" }} >Candle Threads is one of the largest producers of embroidery th reads in the world producing around 100 million spool of thread per year, that is enough to cover the earth around 6570 mes in a year.</Typography>
          </Grid>
          <Grid md={6} container item className='aboudUsSectionImage' ></Grid>
          <div className='aboudUsSectionImage2' >
            <div className="first flex" >
              <Typography variant='h4'  >100<Typography variant='p' sx={{ fontSize: "14px" }} > Million</Typography></Typography>
              <Typography variant='p' sx={{ marginBottom: "5px" }}>Spools of thread</Typography>
              <Typography variant='p'>every year</Typography>
            </div>
            <div className="second flex" >
              <Typography variant='h4'>150</Typography>
              <Typography variant='p' sx={{ marginBottom: "5px" }}>Unique Colors</Typography>
              <Typography variant='p'>per day</Typography>
            </div>
            <div className="third flex" >
              <Typography variant='h4'>3000+</Typography>
              <Typography variant='p' sx={{ marginBottom: "5px" }}>Satisfied</Typography>
              <Typography variant='p'>Customers</Typography>
            </div>
            <div className="fourth flex" >
              <Typography variant='h4'>100</Typography>
              <Typography variant='p' sx={{ marginBottom: "5px" }}>Products</Typography>
              <Typography variant='p'>Variants</Typography>
            </div>
          </div>
        </Grid>
      </Grid>
      <Grid container className='homeBanner flex' >
        <Grid item md={10} className='homeBannerMain' >
          <Typography variant='h3' sx={{ fontWeight: "bold" }} >Make a list to</Typography>
          <Typography variant='h3' sx={{ fontWeight: "bold" }} >order in 2 minutes</Typography>
        </Grid>
      </Grid>
      <Grid container className='reviewSection flex' >
        <Grid item container md={10} className='reviewSectionMain' >
          <Grid item container md={6} className='reviewSectionCotent' >
            <Grid item xs={12} >
              <Typography variant='h6' sx={{ marginBottom: "20px" }} className='sectionHeading' >
                REVIEWS
              </Typography>
            </Grid>
            <Typography variant='h2'   >
              Our Customers
            </Typography>
            <Typography variant='h2' sx={{ marginBottom: "20px" }}  >
              Love What We Do
            </Typography>
          </Grid>
          <Grid item container md={6} className='reviewSectionVerticalCrausel' >
            <VerticalCarousel />  
          </Grid>
        </Grid>
      </Grid>
      <Grid container className='blogSection' ></Grid> */}
			<Grid container className="footerSection flex">
				<Footer />
			</Grid>
		</Grid>
	)
}

export default Home
