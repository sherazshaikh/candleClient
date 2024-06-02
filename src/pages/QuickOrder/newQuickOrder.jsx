import React from 'react'
import { Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import "./quickorder.css"
import ComboBox, { ShadeBox, YardageBox } from "../../components/ComboBox/ComboBox"
import { CoPresentOutlined, Delete } from "@mui/icons-material"
import DeleteIcon from "@mui/icons-material/Delete"
import Quantity from "../../components/Quantity/Quantity"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import Checkout from "../Checkout/Checkout"
import { executeApi } from "../../utils/WithAuth"
import { useDispatch, useSelector } from "react-redux"
import { variables } from "../../utils/config"
import OrderPlaceCard from "../../components/Card/OrderPlaceCard"
import PopupAlert from "../../components/PopupAlert/PopupAlert"
import { cartSlice, updateCart } from "../redux/features/cart/cartslice"
import { v4 } from "uuid"
import { useNavigate, useParams } from "react-router-dom"
import _ from "lodash"
import Navbar from "../../components/Navbar/Navbar"
import CloseIcon from "@mui/icons-material/Close"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import QuantityCheckout from "../../components/Quantity/QuantityCheckout"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import ProductBox from "../../components/ProductBox";
import ShadeCodeBox from "../../components/ShadeCodeBox";
import CategoryBox from "../../components/CategoryBox";

function newQuickOrder() {
	const { orderPage } = useParams()
	const [mobileItem, setMobileItem] = useState("NS")

    let {
		baseURL,
		auth: {
			token,
			curr,
			user: { firstName, branchcodeOrcl },
		},
	} = useSelector((state) => state)
    let cart = useSelector(state => state.cart)


	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [showPopup, setShowPopup] = useState(false)
	const [severty, setSeverty] = useState("error")
	const [message, setMessage] = useState("Please fill atleat one order field to place an order!")
	const [shopes, setShopes] = useState([])
	const [orderSuccess, setOrderSuccess] = useState(false)
	const [newCart, setNewCart] = useState([])
	const [islaoding, setLaoding] = useState(true)
	const [rows, setRows] = useState([
		{
			LottypeCode: "",
			shade: [],
			ShadeCode: "",
			yardage: [],
			selectedYardage: "",
			OrderQty: "",
			price: "0",
			product: {},
			productCategoryList: [],
		},
	])




    return !orderSuccess ? (
		<>
			<Grid
				container
				sm={12}
				sx={{ display: { xs: "none", sm: "none", md: "flex" } }}>
				<Grid
					item
					container
					md={3}
					sx={{ display: { sm: "none", md: "block" } }}
					className="quickOrderLeftSection">
					<Grid
						item
						md={12}
						sm={12}
						style={{ height: "20vh", color: "white" }}>
						<Typography variant="h3">Quick Order</Typography>
					</Grid>
					<Grid
						item
						container
						md={11}
						sm={12}
						className="quickOrderTab">
						<Grid
							item
							cotainer
							className={orderPage == 2 ? "quickOrderOptions opacity5" : "quickOrderOptions"}>
							<Grid
								item
								container>
								<Grid
									item
									md={4}
									sm={3}
									className="quickOrderOptionsCount">
									<Typography variant="h2">1</Typography>
								</Grid>
								<Grid
									item
									md={8}
									sm={9}
									className="quickOrderOptionsContent">
									<Typography variant="h5">Items List</Typography>
									{/* <Typography variant='p'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Typography> */}
								</Grid>
							</Grid>
						</Grid>
						<Grid
							item
							cotainer
							className={orderPage == 1 ? "quickOrderOptions opacity5" : "quickOrderOptions"}>
							<Grid
								item
								container>
								<Grid
									item
									md={4}
									sm={3}
									className="quickOrderOptionsCount">
									<Typography variant="h2">2</Typography>
								</Grid>
								<Grid
									item
									md={8}
									sm={9}
									className="quickOrderOptionsContent">
									<Typography variant="h5">Checkout</Typography>
									{/* <Typography variant='p'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Typography> */}
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid
					item
					container
					md={9}
					sm={12}
					style={{ display: "block" }}>
					{orderPage == 1 ? (
						<>
							<Grid
								container
								className="rightContent flex">
								<Grid
									item
									container
									md={11}
									sm={11}>
									<Grid
										item
										md={8}>
										<Typography variant="h3">
											Make Item List
										</Typography>
										{/* <Typography variant='p'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed.</Typography> */}
									</Grid>
								</Grid>
							</Grid>
							<Grid
								container
								className="addItemMain flex">
								<Grid
									item
									container
									md={11}
									sm={11}
									className="addItemSection">
									<Grid
										container
										style={{ height: "40px" }}>
										<Grid
											item
											md={3}
											sm={3}>
											<Typography
												variant="body1"
												className="greyFont">
												Product
											</Typography>
										</Grid>
										<Grid
											item
											md={2}
											sm={2.5}>
											<Typography
												variant="body1"
												className="greyFont">
												Shades
											</Typography>
										</Grid>
										<Grid
											item
											md={3}
											sm={3}>
											<Typography
												variant="body1"
												className="greyFont">
												Product Description
											</Typography>
										</Grid>

										{/* <Grid
											item
											md={1.5}
											sm={2}>
											<Typography
												variant="body1"
												className="greyFont">
												Yardage
											</Typography>
										</Grid> */}
										<Grid
											item
											md={2}
											sm={2.5}>
											<Typography
												variant="body1"
												className="greyFont">
												Quantity
											</Typography>
											<br />
										</Grid>
										{/* <Grid item md={2} sm={1.5} >
                                                    <Typography variant='body1' className='greyFont' >Price</Typography>
                                                </Grid> */}
									</Grid>
									<Grid
										item
										container
										className="addItemRowSection">
										{cart.map((item, index) => (
											<Grid
												container
												style={{
													marginBottom: "10px",
													height: "50px",
												}}>
												<Grid
													item
													md={3}
													sm={3}>
													<ProductBox
														debouncedApiCall={
															debouncedApiCall
														}
														token={
															token
														}
														baseURL={
															baseURL
														}
														options={
															allProduct
														}
														index={
															index
														}
														rows={
															cart
														}
														setRows={
															setRows
														}
														label="Select Product"
														setShadesByCode={
															setShadesByCode
														}
													/>
												</Grid>
												<Grid
													item
													md={2}
													sm={2.5}>
													<ShadeCodeBox
														debouncedApiCall={
															debouncedApiCall
														}
														label="Shades"
														options={
															item.shade
														}
														rows={
															cart
														}
														setRows={
															setRows
														}
														index={
															index
														}
														getProductDescriptionbyCode={
															getProductDescriptionbyCode
														}
													/>
												</Grid>
												<Grid
													item
													md={3}
													sm={3}>
													<CategoryBox
														debouncedApiCall={
															debouncedApiCall
														}
														token={
															token
														}
														baseURL={
															baseURL
														}
														options={
															item.productCategoryList
														}
														index={
															index
														}
														rows={
															cart
														}
														setRows={
															setRows
														}
														label="Select Color Code"
													/>
												</Grid>

												{/* <Grid
													item
													md={1.5}
													sm={2}>
													<YardageBox
														debouncedApiCall={debouncedApiCall}
														label="Yardage"
														options={item.yardage}
														rows={cart}
														setRows={setRows}
														index={index}
													/>
												</Grid> */}
												<Grid
													item
													md={2}
													sm={2.5}>
													<Quantity
														debouncedApiCall={
															debouncedApiCall
														}
														rows={
															cart
														}
														setRows={
															setRows
														}
														index={
															index
														}
													/>
												</Grid>
												<Grid
													container
													item
													md={1.5}
													sm={1.5}
													className="quickOrderPriceColumn">
													<Typography variant="h6">
														{item.uom}
													</Typography>
													<Delete
														style={{
															color: "grey",
															cursor: "pointer",
														}}
														onClick={() =>
															deleteExistingRow(
																index,
															)
														}
													/>
												</Grid>
											</Grid>
										))}
									</Grid>
								</Grid>
								{/* <Grid
									item
									xs={2}></Grid> */}
								<Grid
									item
									md={11}
									sm={11}>
									<button
										className="addAnItemButton flex"
										onClick={() => addNewColumn()}
										style={{ textAlign: "center" }}>
										<Typography
											variant="h6"
											style={{ marginRight: "10px" }}>
											+
										</Typography>
										Add an Item
									</button>
								</Grid>
								<Grid
									item
									container
									md={11}
									sm={11}
									className="quickOrderBottomSection">
									<Grid
										item
										container
										md={3}
										sm={6}
										className="flex">
										<Grid
											ietm
											md={6}
											style={{ textAlign: "right" }}>
											{/* <Typography variant='body1' className='greyFont'>VAT:</Typography>
                                                    <Typography variant='h5' >Total Price:</Typography> */}
										</Grid>
										<Grid
											ietm
											md={6}
											style={{ paddingLeft: "10px" }}>
											{/* <Typography variant='body1' className='greyFont'>{curr} 0</Typography>
                                                    <Typography variant='h5' >{curr} 0</Typography> */}
										</Grid>
									</Grid>
									<Grid
										item
										md={7}
										sm={3}
									// className="discountImage"
									></Grid>
									<Grid
										item
										md={2}
										sm={3}
										className="flex">
										<Typography
											onClick={() => moveToNext()}
											variant="h6">
											Next &nbsp;
										</Typography>
										<button
											onClick={() => moveToNext()}
											className="nextButton flex">
											<ArrowForwardIcon />
										</button>
									</Grid>
								</Grid>
							</Grid>
						</>
					) : (
						<Checkout
							debouncedApiCall={debouncedApiCall}
							setStep={setStep}
							rows={cart}
							setOrderSuccess={handleOrderSuccess}
							orderSuccess={orderSuccess}
							shopes={shopes}
						/>
					)}
				</Grid>
				<PopupAlert
					open={showPopup}
					message={message}
					severty={severty}
					onClose={handleClosePopup}
				/>
			</Grid>
			{orderPage == "1" ? (
				<Grid
					container
					xs={12}
					sx={{ display: { xs: "block", sm: "block", md: "none" } }}>
					<Grid
						item
						container
						style={{ height: "78px" }}>
						<Navbar />
					</Grid>
					{mobileItem === "NS" ? (
						<Grid
							item
							container
							xs={12}>
							<Grid
								item
								container
								xs={12}
								style={{ height: "60px" }}>
								<Grid
									item
									xs={12}
									style={{
										paddingTop: "10px",
										paddingLeft: "20px",
										marginBottom: "10px",
									}}>
									<Typography variant="h3">Quick Order</Typography>
								</Grid>
								<Grid
									item
									xs={0}
									style={{
										paddingTop: "10px",
										display: "flex",
										alignItems: "center",
										justifyContent: "right",
									}}>
									{/* <CloseIcon /> */}
								</Grid>
							</Grid>
							<Grid
								container
								item
								xs={12}
								style={{
									height: "calc(100vh - 60px - 78px - 60px - 53px )",
									display: "flex",
									flexDirection: "rows",
									alignContent: "flex-start",
									justifyContent: "center",
									backgroundColor: "#f8f8f8",
									overflowY: "scroll",
								}}>
								{cart.map((item, index) => {
									// if (item.LottypeCode.value || item.ShadeCode.label || item.LottypeCode.HsCode || item.selectedYardage.label) {
									return (
										<Grid
											item
											container
											xs={11}
											className="flex quickOrderCardMobile"
											style={{
												minHeight: "80px",
												paddingLeft: "10px",
											}}>
											<Grid
												item
												xs={8}
												style={{ height: "90%" }}>
												<Typography
													variant="body1"
													color="grey">
													{item.LottypeCode
														?.label ??
														"No Item Detail Selected, Edit to Select"}
												</Typography>
												<Typography variant="h4">
													{
														item
															.ShadeCode
															?.label
													}
												</Typography>
											</Grid>
											<Grid
												item
												xs={4}
												style={{
													height: "90%",
													textAlign: "right",
													paddingRight: "5px",
												}}>
												<ModeEditIcon
													onClick={() =>
														setMobileItem(
															index,
														)
													}
													style={{
														paddingRight: "5px",
													}}
												/>
												<Delete
													onClick={() =>
														deleteExistingRow(
															index,
														)
													}
												/>
												<Typography variant="h6">
													{" "}
													<Typography
														style={{
															color: "grey",
															fontSize: "12px",
														}}
														variant="p">
														{" "}
														Qty:
													</Typography>{" "}
													{item.OrderQty}
												</Typography>
											</Grid>
										</Grid>
									)
									// }
								})}
								{mobileItems.length > 0 ? (
									<></>
								) : (
									<Grid
										item
										xs={10}
										style={{
											height: "100%",
											flexDirection: "column",
											textAlign: "center",
										}}
										className="flex">
										<Typography variant="h4">
											No Items in the list !
										</Typography>
										<Typography
											variant="body2"
											color="grey">
											Please tap “Add an items” button below
											to add first item in your list.
										</Typography>
										<br />
										<Typography
											variant="body2"
											color="grey">
											<ArrowDownwardIcon />
										</Typography>
									</Grid>
								)}
							</Grid>
							<Grid
								item
								xs={12}
								className="flex"
								style={{ background: "transparent" }}>
								<button
									className="addAnItemButtonMobile flex"
									onClick={() => addNewColumnMobile()}
									style={{ textAlign: "center" }}>
									<Typography
										variant="h6"
										style={{ marginRight: "10px" }}>
										+
									</Typography>
									Add an Item
								</button>
							</Grid>
							<Grid
								item
								xs={12}
								className="quickOrderBottomSectionMobile">
								<Typography
									onClick={() => moveToNext()}
									variant="h6">
									Next &nbsp;
								</Typography>
								<button
									onClick={() => moveToNext()}
									className="nextButtonMobile  flex">
									<ArrowForwardIcon />
								</button>
							</Grid>
						</Grid>
					) : (
						<Grid
							item
							container
							xs={12}>
							<Grid
								item
								container
								xs={12}
								style={{ height: "40px" }}>
								<Grid
									onClick={() => setMobileItem("NS")}
									item
									xs={1.5}
									style={{
										paddingTop: "5px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										marginBottom: "15px",
									}}>
									<ArrowBackIosIcon />
								</Grid>
								<Grid
									item
									xs={10.5}
									style={{ paddingTop: "10px", marginBottom: "15px" }}>
									<Typography variant="h3">Add An Item</Typography>
								</Grid>
								<Grid
									item
									container
									className="addItemRowSectionMobile">
									<Grid
										container
										style={{ marginBottom: "10px", height: "60px" }}>
										<Grid
											item
											container
											xs={12}
											className="flex"
											style={{ marginBottom: "10px" }}>
											<Grid
												item
												xs={12}
												style={{
													paddingLeft: "7%",
													marginBottom: "5px",
												}}>
												<Typography variant="body2">
													{" "}
													Product{" "}
												</Typography>
											</Grid>

											<Grid
												item
												xs={12}
												className="flex">
												<ProductBox
													debouncedApiCall={
														debouncedApiCall
													}
													token={token}
													baseURL={baseURL}
													options={allProduct}
													index={mobileItem}
													rows={cart}
													setRows={setRows}
													label="Select Product"
													setShadesByCode={
														setShadesByCode
													}
												/>
											</Grid>
										</Grid>

										<Grid
											item
											container
											xs={12}
											className="flex"
											style={{ marginBottom: "10px" }}>
											<Grid
												item
												xs={12}
												style={{
													paddingLeft: "7%",
													marginBottom: "5px",
												}}>
												<Typography variant="body2">
													{" "}
													Shades
												</Typography>
											</Grid>
											<Grid
												item
												xs={12}
												className="flex">
												<ShadeCodeBox
													debouncedApiCall={
														debouncedApiCall
													}
													label="Shades"
													options={
														cart[
															mobileItem
														]?.shade
													}
													rows={cart}
													setRows={setRows}
													index={mobileItem}
													getProductDescriptionbyCode={
														getProductDescriptionbyCode
													}
												/>
											</Grid>
										</Grid>
										<Grid
											item
											container
											xs={12}
											className="flex"
											style={{ marginBottom: "10px" }}>
											<Grid
												item
												xs={12}
												style={{
													paddingLeft: "7%",
													marginBottom: "5px",
												}}>
												<Typography variant="body2">
													{" "}
													Product Description{" "}
												</Typography>
											</Grid>

											<Grid
												item
												xs={12}
												className="flex">
												<CategoryBox
													debouncedApiCall={
														debouncedApiCall
													}
													token={token}
													baseURL={baseURL}
													options={
														cart[
															mobileItem
														]?.productCategoryList
													}
													index={mobileItem}
													rows={cart}
													setRows={setRows}
													label="Select Color Code"
												/>
											</Grid>
										</Grid>
										{/* <Grid
											item
											container
											xs={12}
											className="flex"
											style={{ marginBottom: '10px' }}>
											<Grid
												item
												xs={12}
												style={{ paddingLeft: '7%', marginBottom: '5px' }}>
												<Typography variant="body2"> Yardage</Typography>
											</Grid>
											<Grid
												item
												xs={12}
												className="flex">
												<YardageBox
													debouncedApiCall={debouncedApiCall}
													label="Yardage"
													options={cart[mobileItem].yardage}
													rows={cart}
													setRows={setRows}
													index={mobileItem}
												/>
											</Grid>
										</Grid> */}
										<Grid
											item
											container
											xs={12}
											className="flex"
											style={{ marginBottom: "10px" }}>
											<Grid
												item
												xs={12}
												style={{
													paddingLeft: "7%",
													marginBottom: "5px",
												}}>
												<Typography variant="body2">
													{" "}
													Quantity
												</Typography>
											</Grid>
											<Grid
												item
												container
												xs={12}
												className="flex">
												<Quantity
													debouncedApiCall={
														debouncedApiCall
													}
													rows={cart}
													setRows={setRows}
													index={mobileItem}
												/>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Grid
									item
									xs={12}
									className="flex">
									<button
										onClick={() => updatProductFromMobile()}
										className="addAnItemButtonMobile flex"
										style={{ textAlign: "center" }}>
										<Typography
											variant="h6"
											style={{ marginRight: "10px" }}>
											Done
										</Typography>
									</button>
								</Grid>
							</Grid>
						</Grid>
					)}

					<PopupAlert
						open={showPopup}
						message={message}
						severty={severty}
						onClose={handleClosePopup}
					/>
				</Grid>
			) : orderPage == "2" ? (
				<Grid
					container
					xs={12}
					sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>
					<Grid
						item
						container
						style={{ height: "78px" }}>
						<Navbar />
					</Grid>
					<Grid
						item
						container
						xs={12}
						className="cartMainMobile">
						<Grid
							item
							container
							xs={12}
							className="yourcartmain2Mobile flex">
							<Grid
								item
								xs={11}
								style={{ height: "50px", backgroundColor: "white" }}>
								<Typography variant="h3">Your Cart</Typography>
							</Grid>
							<Grid
								container
								xs={12}
								className="flex cartProductMobile">
								<Grid
									container
									item
									xs={11.5}
									className="cartScrollSection">
									{cart.map((item, index) => {
										if (
											item.LottypeCode.value &&
											item.ShadeCode.label &&
											item.LottypeCode.HsCode &&
											item.OrderQty &&
											item.selectedYardage.label
										) {
											return (
												<Grid
													container
													className="yourCartRow">
													<Grid
														container
														item
														xs={8}>
														<Typography variant="h5">
															{
																item
																	.LottypeCode
																	.label
															}
														</Typography>
														<Grid
															item
															xs={
																12
															}>
															<Typography
																variant="p1"
																className="greyFont">
																Shades:{" "}
															</Typography>
															<Typography variant="p1">
																{
																	item
																		.ShadeCode
																		.label
																}
															</Typography>
														</Grid>
														<Grid
															item
															xs={
																12
															}>
															<Typography
																variant="p1"
																className="greyFont">
																Yardage:
															</Typography>
															<Typography variant="p1">
																{
																	item
																		.selectedYardage
																		.label
																}
															</Typography>
														</Grid>
													</Grid>
													<Grid
														item
														container
														xs={4}>
														<Grid
															item
															xs={
																11
															}
															style={{
																display: "flex",
																justifyContent:
																	"end",
															}}>
															<Grid
																item
																md={
																	4
																}
																style={{
																	cursor: "pointer",
																}}
																onClick={() =>
																	deleteExistingRow(
																		index,
																	)
																}>
																<DeleteIcon />
															</Grid>
														</Grid>
														<Grid
															item
															xs={
																12
															}
															style={{
																marginTop: "10%",
															}}>
															<QuantityCheckout
																debouncedApiCall={
																	debouncedApiCall
																}
																item={
																	item
																}
																rows={
																	cart
																}
																index={
																	index
																}
															/>
														</Grid>
													</Grid>
													{/* <Grid item md={4} style={{ textAlign: "center" }} >{item.OrderQty}x</Grid> */}
												</Grid>
											)
										}
									})}
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Grid
						item
						xs={12}
						className="quickOrderBottomSectionMobile">
						<Typography
							onClick={() => navigate("/quickOrder/3")}
							variant="h6">
							Next &nbsp;
						</Typography>
						<button
							onClick={() => navigate("/quickOrder/3")}
							className="nextButtonMobile  flex">
							<ArrowForwardIcon />
						</button>
					</Grid>
				</Grid>
			) : (
				<Grid
					container
					xs={12}
					sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>
					<Grid
						item
						container
						style={{ height: "78px" }}>
						<Navbar />
					</Grid>
					<Checkout
						debouncedApiCall={debouncedApiCall}
						setStep={setStep}
						rows={cart}
						setOrderSuccess={setOrderSuccess}
						orderSuccess={orderSuccess}
						shopes={shopes}
					/>
				</Grid>
			)}
		</>
	) : (
		<OrderPlaceCard
			firstName={firstName}
			debouncedApiCall={debouncedApiCall}
		/>
	)
}

export default newQuickOrder