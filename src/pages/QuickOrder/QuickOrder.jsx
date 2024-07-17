import { Backdrop, CircularProgress, Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import "./quickorder.css"
import ComboBox, { ShadeBox, YardageBox } from "../../components/ComboBox/ComboBox"
import { CoPresentOutlined, Delete, ShoppingBasket } from "@mui/icons-material"
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

import ProductBox from "../../components/ProductBox"
import ShadeCodeBox from "../../components/ShadeCodeBox"
import CategoryBox from "../../components/CategoryBox"

const QuickOrder = () => {
	let {
		baseURL,
		auth: {
			token,
			curr,
			user: { firstName, branchcodeOrcl },
		},
	} = useSelector((state) => state)
	let cart = useSelector((state) => state.cart)
	let state = useSelector((state) => state)
	const [Step, setStep] = useState(1)
	const { orderPage } = useParams()
	const [isMobileEmpty, setIsMobileEmpty] = useState(false)
	const [mobileItem, setMobileItem] = useState("NS")
	// const [cart, setCart] = useState(nCart)
	const count = useSelector((state) =>
		state.cart.filter((item) => {
			if (!item.LottypeCode?.label || !item.ShadeCode?.label || !item.selectedYardage?.label) {
			} else {
				return item
			}
		}),
	)
	const mobileItems = useSelector((state) =>
		state.cart.filter((item) => {
			if (item.LottypeCode?.label || item.ShadeCode?.label || item.selectedYardage?.label) {
				return item
			} else {
			}
		}),
	)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [showPopup, setShowPopup] = useState(false)
	const [severty, setSeverty] = useState("error")
	const [message, setMessage] = useState("Please fill atleat one order field to place an order!")
	const [shopes, setShopes] = useState([])
	const [orderSuccess, setOrderSuccess] = useState(false)
	const [newCart, setNewCart] = useState([])
	const [islaoding, setLaoding] = useState(true)
	const [isLoading, setLoading] = useState(false)
	const [isMobItemLoading, setIsMobItemLoading] = useState(false)
	const [pdateComponent, setUpdateComponent] = useState(0)
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
	const [products, setProducts] = useState([])
	const [allProduct, setAllProduct] = useState([])

	const [isMobileView, setMobileView] = useState(false)

	const getAllProduct = async () => {
		await executeApi(baseURL + variables.getAllProduct.url, {}, variables.shades.method, token, dispatch)
			.then((data) => {
				// let prdct = data.data.map((p) => `${p.categoryId}-${p.categoryName}`)
				setAllProduct(data.data)
			})
			.catch((error) => console.log(error))
	}

	const setShadesByCode = async (product, i, rows) => {
		let newArray = [...rows]

		executeApi(baseURL + `/v1/Order/getShadeByCategoryId?categoryId=${product.id}`, {}, variables.shades.method, token, dispatch)
			.then((data) => {
				newArray[i] = {
					...newArray[i],
					shade: data.data,
					product: product,
				}

				dispatch(updateCart(newArray))
			})
			.catch((error) => console.log(error))
	}

	const getInitialShadeByAll = () => {
		let newArray = [...cart]

		newArray.map((data) => {
			executeApi(baseURL + `/v1/Order/getShadeByCategoryId?categoryId=${data.product.id}`, {}, variables.shades.method, token, dispatch)
				.then((data) => {
					data.shade = data.data

					// newArray[i] = {
					// 	...newArray[i],
					// 	shade: data.data,
					// 	product: product
					// }

					// dispatch(updateCart(newArray))
				})
				.catch((error) => console.log(error))
		})

		console.log("CARD PP AT", newArray)
	}

	const getProductDescriptionbyCode = async (shade, i, rows, initial) => {
		let newArray = [...rows]
		await executeApi(baseURL + `/v1/Order/getProductByCategoryIdAndShadeCode?categoryId=${newArray[i]?.product?.id}&shadeCode=${shade?.label}`, {}, variables.shades.method, token, dispatch)
			.then((data) => {
				const cData = data?.data[0]
				newArray[i] = {
					...newArray[i],
					shade: newArray[i].shade,
					productCategoryList: data?.data,
					// ShadeCode: newArray[i].ShadeCode,
					LottypeCode:
						!initial && data?.data.length === 1
							? {
									label: cData.productDesc,
									value: cData.productCode,
									HsCode: cData.hsCode,
									yardage: cData.yardage,
									boxQty: cData.boxQty,
									uom: cData.uom,
									productCode: cData.productCode,
							  }
							: initial
							? newArray[i].LottypeCode
							: {},
					OrderQty: initial ? newArray[i]?.OrderQty : cData.boxQty,
					selectedYardage: { label: cData.yardage, value: cData.yardage, HsCode: cData.yardage },
					uom: cData.uom,
					productCode: cData.productCode,
				}

				console.log("record 2", i, newArray)

				dispatch(updateCart(newArray))
			})
			.catch((error) => console.log(error))

		setLaoding(false)
	}

	const addNewColumn = async () => {
		let isPreviousRowFilled = true
		cart?.length > 0 &&
			cart.map((itm) => {
				if (!itm?.LottypeCode?.label || !itm?.ShadeCode?.label || !itm.selectedYardage.label) {
					isPreviousRowFilled = false
				}
			})
		if (cart?.length === 0 || isPreviousRowFilled) {
			let shadeItemList = []
			// const productQty = products.find((product) => product.productCode === cart[cart.length - 1]?.LottypeCode?.value)
			// await executeApi(baseURL + variables.shades.url + `?productCode=${cart[cart.length - 1]?.LottypeCode?.value}`, {}, variables.shades.method, token, dispatch).then((data) => {
			// 	shadeItemList = data.data ? data.data : []
			// })
			let newCart = [
				...cart,
				{
					LottypeCode: cart.length > 0 ? cart[cart.length - 1]?.LottypeCode : {},
					shade: cart.length > 0 ? cart[cart.length - 1]?.shade : [],
					ShadeCode: cart.length > 0 ? cart[cart.length - 1]?.ShadeCode : { label: "", value: "", HsCode: "" },
					yardage: [],
					selectedYardage: cart.length > 0 ? cart[cart.length - 1].selectedYardage : "",
					OrderQty: cart.length > 0 ? cart[cart.length - 1].OrderQty : 0,
					price: "0",
					uuid: v4(),
					uom: cart.length > 0 ? cart[cart.length - 1].uom : "",
					productCode: cart.length > 0 ? cart[cart.length - 1].productCode : "",
					product: cart.length > 0 ? cart[cart.length - 1]?.product : {},
					productCategoryList: cart.length > 0 ? cart[cart.length - 1]?.productCategoryList : [],
				},
			]

			console.log("aidassod", newCart)

			apiCallFunction()
			dispatch(updateCart(newCart))
			debouncedApiCall()

			// if (newCart[newCart.length - 1]?.product) {
			// 	setShadesByCode(newCart[newCart.length - 1]?.product, newCart.length - 1 )
			// }
			// if (newCart[newCart.length - 1].ShadeCode?.label && newCart[newCart.length - 1].product?.label) {
			// 	console.log("shasdasdasdasdasdsada", newCart[newCart.length - 1] )
			// 	getProductDescriptionbyCode(newCart[newCart.length - 1].ShadeCode, newCart.length - 1, newCart, 'initail')
			// }
		} else {
			setSeverty("error")
			setMessage("Please Fill Row Data")
			setShowPopup(true)
		}
	}

	function getShades() {
		let array = [...newCart]
		array?.map((itm) => {
			let value = itm?.LottypeCode?.value

			executeApi(baseURL + variables.shades.url + `?productCode=${value}`, {}, variables.shades.method, token, dispatch)
				.then((data) => {
					itm.shade = data.data
				})
				.catch((error) => console.log(error))
		})

		dispatch(updateCart(array))
	}

	const addNewColumnMobile = async (isAdd) => {
		let isPreviousRowFilled = true
		console.log("SHADE CHECK KARO", cart)
		cart?.length > 0 &&
			cart.map((itm) => {
				if (!itm?.LottypeCode?.label || !itm?.ShadeCode?.label || !itm.selectedYardage.label) {
					isPreviousRowFilled = false
				}
			})
		// const productQty = products.find((product) => product.hsCode === cart[cart.length - 1]?.LottypeCode?.HsCode)
		if (cart?.length === 0 || isPreviousRowFilled) {
			// let shadeItemList = []
			// const productQty = products.find((product) => product.productCode === cart[cart.length - 1]?.LottypeCode?.value)
			// await executeApi(
			// 	baseURL + variables.shades.url + `?productCode=${cart[cart.length - 1]?.LottypeCode?.value}`,
			// 	{},
			// 	variables.shades.method,
			// 	token,
			// 	dispatch,
			// ).then((data) => {
			// 	shadeItemList = data.data
			// })
			let newCart = [
				...cart,
				// {
				// 	LottypeCode: cart?.length === 0 ? "" : cart[cart.length - 1]["LottypeCode"],
				// 	shade: cart?.length === 0 ? [] : shadeItemList,
				// 	ShadeCode: { label: "", value: "", HsCode: "" },
				// 	yardage: [],
				// 	selectedYardage: cart?.length === 0 ? [] : cart[cart.length - 1]["selectedYardage"],
				// 	OrderQty: productQty?.boxQty,
				// 	price: "0",
				// 	uom: productQty ? productQty?.uom : "",
				// 	productCode: productQty?.productCode,
				// 	uuid: v4(),
				// },
				{
					LottypeCode: cart.length > 0 ? cart[cart.length - 1]?.LottypeCode : {},
					shade: cart.length > 0 ? cart[cart.length - 1]?.shade : [],
					ShadeCode: cart.length > 0 ? cart[cart.length - 1]?.ShadeCode : { label: "", value: "", HsCode: "" },
					yardage: [],
					selectedYardage: cart.length > 0 ? cart[cart.length - 1].selectedYardage : "",
					OrderQty: cart.length > 0 ? cart[cart.length - 1].OrderQty : "",
					price: "0",
					uuid: v4(),
					uom: cart.length > 0 ? cart[cart.length - 1].uom : "",
					productCode: cart.length > 0 ? cart[cart.length - 1].productCode : "",
					product: cart.length > 0 ? cart[cart.length - 1]?.product : {},
					productCategoryList: cart.length > 0 ? cart[cart.length - 1]?.productCategoryList : [],
				},
			]

			const newArr = cart.filter((itm) => itm?.LottypeCode?.label && itm?.ShadeCode?.label && itm.selectedYardage.label)
			console.log("Mob add", newArr, newCart, cart)

			apiCallFunction(newArr)

			dispatch(updateCart(newCart))
			debouncedApiCall()
			setMobileItem(newCart.length - 1)
		} else {
			setSeverty("error")
			setMessage("Please Fill Row Data")
			setShowPopup(true)
		}
	}

	const handleClosePopup = () => {
		setShowPopup(false)
	}

	useEffect(() => {
		getAllProduct()
		executeInitial()
	}, [])

	const executeInitial = async () => {
		executeApi(baseURL + `${variables.Shopes.url}?branchCode=${branchcodeOrcl}`, {}, variables.Shopes.method, token, dispatch)
			.then((data) => setShopes(data.data))
			.catch((error) => console.log(error.message))

		executeInitails()

		//
	}

	const deleteExistingRow = (index1) => {
		setLoading(true)
		if (cart.length > 0) {
			let newRows = cart.filter((i, index) => {
				if (index !== index1) {
					return i
				}
			})

			dispatch(updateCart(newRows))
			debouncedApiCall()
			apiCallFunction(newRows)
		}
	}

	function validateOrder() {
		for (const orderDetail of cart) {
			if (!orderDetail.OrderQty || isNaN(orderDetail.OrderQty) || orderDetail.OrderQty <= 0) {
				return false
			}
			if (!orderDetail?.LottypeCode?.label || !orderDetail?.ShadeCode?.label || !orderDetail.selectedYardage.label) {
				return false
			}
		}
		return true
	}

	const moveToNext = async () => {
		let isPreviousRowFilled = true

		cart?.length > 0 &&
			cart.map((itm) => {
				if (!itm?.LottypeCode?.label || !itm?.ShadeCode?.label || !itm.selectedYardage.label) {
					isPreviousRowFilled = false
				}
			})

		if (isPreviousRowFilled) {
			apiCallFunction()
			if (count.length < 1) {
				setShowPopup(true)
			} else {
				navigate("/quickOrder/2")
			}
		} else {
			setSeverty("error")
			setMessage("Please Fill Row Data")
			setShowPopup(true)
		}
	}

	const apiCallFunction = async (newRows) => {
		let finalCart = []
		if (newRows) {
			for (const orderDetail of newRows) {
				finalCart.push({
					lottypecode: Object.values(orderDetail.LottypeCode)?.join("BTWOBJ"),
					shadecode: Object.values(orderDetail.ShadeCode)?.join("BTWOBJ"),
					qty: orderDetail.OrderQty,
					yardage: Object.values(orderDetail.selectedYardage)?.join("BTWOBJ"),
					yardagelist: orderDetail.yardage?.join("BTWOBJ"),
					shadecodelist: orderDetail.shade.map((obj) => `${obj.shadeCode}BTWOBJ${obj.shadeDesc}`)?.join("OBJEND"),
					uom: orderDetail.uom,
					productCode: orderDetail?.productCode,
					categoryCode: Object.values(orderDetail.product)?.join("BTWOBJ"),
					products: Object.values(orderDetail.product)?.join("BTWOBJ"),
				})
			}
		} else {
			for (const orderDetail of cart) {
				finalCart.push({
					// ...orderDetail,
					lottypecode: Object.values(orderDetail.LottypeCode)?.join("BTWOBJ"),
					shadecode: Object.values(orderDetail.ShadeCode)?.join("BTWOBJ"),
					qty: orderDetail.OrderQty,
					yardage: Object.values(orderDetail.selectedYardage)?.join("BTWOBJ"),
					yardagelist: orderDetail.yardage?.join("BTWOBJ"),
					shadecodelist: orderDetail.shade?.map((obj) => `${obj.shadeCode}BTWOBJ${obj.shadeDesc}`)?.join("OBJEND"),
					uom: orderDetail.uom,
					productCode: orderDetail?.productCode,
					categoryCode: Object.values(orderDetail.product)?.join("BTWOBJ"),
					products: Object.values(orderDetail.product)?.join("BTWOBJ"),
				})
			}
		}

		// dispatch(updateCart(finalCart))
		await executeApi(baseURL + variables.updateCart.url, finalCart, variables.updateCart.method, token, dispatch)
			.then((data) => {
				console.log(data)
				setLoading(false)
			})
			.catch((err) => console.log(err))

		setIsMobItemLoading(false)
	}

	function handleOrderSuccess(isOrderSuccess) {
		setOrderSuccess(isOrderSuccess)
	}

	function updatProductFromMobile(isNS) {
		if (isNS) {
			setMobileItem("NS")
			let newCart = [...cart]
			newCart.length > 0 && newCart.pop()
			console.log("cart fil", newCart, cart)
			dispatch(updateCart(newCart))
		} else {
			// setMobileItem(cart.length)

			// setShadesByCode(cart[mobileItem].product, mobileItem, cart)

			let isPreviousRowFilled = true
			// cart?.length > 0 &&
			// 	cart.map((itm) => {
			// 		if (!itm?.LottypeCode?.label || !itm?.ShadeCode?.label || !itm.selectedYardage.label) {
			// 			isPreviousRowFilled = false
			// 		}
			// 	})
			addNewColumnMobile()
			if (isPreviousRowFilled) {
				setIsMobItemLoading(true)
				apiCallFunction()
			} else {
				setSeverty("error")
				setMessage("Please Fill Row Data")
				setShowPopup(true)
			}
		}
	}

	const apiCallFunction1 = () => {}

	const debouncedApiCall = _.debounce(apiCallFunction1, 3000)

	function validateShadeCode(code, index) {}

	useEffect(() => {
		setProducts(products)
	}, [mobileItem])

	const executeInitails = async () => {
		const OldCartLenght = cart.length

		await executeApi(baseURL + variables.getCart.url, {}, variables.getCart.method, token, dispatch)
			.then((data) => {
				if (data.data != null) {
					var finalObject = data.data.map((item) => {
						let jsonData = item

						let dataArray = jsonData.shadecodelist.split("OBJEND")
						dataArray.pop()
						// Map the array elements back into objects
						let shadeList = []
						let parsedArray = dataArray.map((item) => {
							let [shadeCode, shadeDesc] = item.split("BTWOBJ")
							shadeList.push({ shadeCode: shadeCode, shadeDesc: shadeDesc })
						})
						console.log("parsedArray", shadeList)

						return {
							LottypeCode: {
								label: jsonData.lottypecode.split("BTWOBJ")[0],
								value: jsonData.lottypecode.split("BTWOBJ")[1],
								HsCode: jsonData.lottypecode.split("BTWOBJ")[2],
							},
							shade: shadeList,
							ShadeCode: {
								label: jsonData.shadecode.split("BTWOBJ")[0],
								value: jsonData.shadecode.split("BTWOBJ")[1],
							},
							yardage: jsonData.yardagelist.split("BTWOBJ"),
							selectedYardage: {
								label: jsonData.yardage.split("BTWOBJ")[0],
								value: jsonData.yardage.split("BTWOBJ")[1],
								HsCode: jsonData.yardage.split("BTWOBJ")[2],
							},
							OrderQty: jsonData.qty,
							uom: item.uom,
							price: 0,
							uuid: v4(),
							productCategoryList: [],
							product: {
								label: jsonData.categoryCode.split("BTWOBJ")[0],
								value: jsonData.categoryCode.split("BTWOBJ")[0],
								id: jsonData.categoryCode.split("BTWOBJ")[2],
							},
							productCode: jsonData.productCode,
						}
					})

					console.log("Get Latest Card", finalObject)

					// if(cart.length, finalObject.length)  s
					// dispatch(updateCart(finalObject))
					// cart = finalObject

					dispatch(updateCart(finalObject))
					cart?.map((ct, i) => {
						// if (ct?.product?.label) {
						// 	setShadesByCode(ct?.product, i, cart)
						// }
						if (ct?.ShadeCode?.label && ct?.product?.label) {
							getProductDescriptionbyCode(ct.ShadeCode, i, finalObject, "initial")
						}
					})
				} else {
					dispatch(updateCart(rows))
				}
			})
			.catch((err) => {
				console.log(err)
			})

		console.log("New  CARD HE BHAI 1", cart)
	}

	return !orderSuccess ? (
		<>
			<Grid container sm={12} sx={{ display: { xs: "none", sm: "none", md: "flex" } }}>
				<Grid item container md={3} sx={{ display: { sm: "none", md: "block" } }} className="quickOrderLeftSection">
					<Grid item md={12} sm={12} style={{ height: "20vh", color: "white" }}>
						<Typography variant="h3">Quick Order</Typography>
					</Grid>
					<Grid item container md={11} sm={12} className="quickOrderTab">
						<Grid item cotainer className={orderPage == 2 ? "quickOrderOptions opacity5" : "quickOrderOptions"}>
							<Grid item container>
								<Grid item md={4} sm={3} className="quickOrderOptionsCount">
									<Typography variant="h2">1</Typography>
								</Grid>
								<Grid item md={8} sm={9} className="quickOrderOptionsContent">
									<Typography variant="h5">Items List</Typography>
									{/* <Typography variant='p'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Typography> */}
								</Grid>
							</Grid>
						</Grid>
						<Grid item cotainer className={orderPage == 1 ? "quickOrderOptions opacity5" : "quickOrderOptions"}>
							<Grid item container>
								<Grid item md={4} sm={3} className="quickOrderOptionsCount">
									<Typography variant="h2">2</Typography>
								</Grid>
								<Grid item md={8} sm={9} className="quickOrderOptionsContent">
									<Typography variant="h5">Checkout</Typography>
									{/* <Typography variant='p'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Typography> */}
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid item container md={9} sm={12} style={{ display: "block" }}>
					{orderPage == 1 ? (
						<>
							<Grid container className="rightContent flex">
								<Grid item container md={11} sm={11}>
									<Grid item md={8}>
										<Typography variant="h3">Make Item List</Typography>
										{/* <Typography variant='p'>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed.</Typography> */}
									</Grid>
								</Grid>
							</Grid>
							<Grid container className="addItemMain flex">
								<Grid item container md={11} sm={11} className="addItemSection">
									<Grid container style={{ height: "40px" }}>
										<Grid item md={3} sm={3}>
											<Typography variant="body1" className="greyFont">
												Product
											</Typography>
										</Grid>
										<Grid item md={2} sm={2.5}>
											<Typography variant="body1" className="greyFont">
												Shades
											</Typography>
										</Grid>
										<Grid item md={3} sm={3}>
											<Typography variant="body1" className="greyFont">
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
										<Grid item md={2} sm={2.5}>
											<Typography variant="body1" className="greyFont">
												Quantity
											</Typography>
											<br />
										</Grid>
										{/* <Grid item md={2} sm={1.5} >
                                                    <Typography variant='body1' className='greyFont' >Price</Typography>
                                                </Grid> */}
									</Grid>
									<Grid item container className="addItemRowSection">
										{cart.map((item, index) => (
											<Grid
												container
												style={{
													marginBottom: "10px",
													height: "50px",
												}}
											>
												<Grid item md={3} sm={3}>
													<ProductBox
														debouncedApiCall={debouncedApiCall}
														token={token}
														baseURL={baseURL}
														options={allProduct}
														index={index}
														rows={cart}
														setRows={setRows}
														label="Select Product"
														setShadesByCode={setShadesByCode}
													/>
												</Grid>
												<Grid item md={2} sm={2.5}>
													<ShadeCodeBox
														debouncedApiCall={debouncedApiCall}
														label="Shades"
														options={item.shade}
														rows={cart}
														setRows={setRows}
														index={index}
														getProductDescriptionbyCode={getProductDescriptionbyCode}
													/>
												</Grid>
												<Grid item md={3} sm={3}>
													<CategoryBox
														debouncedApiCall={debouncedApiCall}
														token={token}
														baseURL={baseURL}
														options={item.productCategoryList}
														index={index}
														rows={cart}
														setRows={setRows}
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
												<Grid item md={2} sm={2.5}>
													<Quantity debouncedApiCall={debouncedApiCall} rows={cart} setRows={setRows} index={index} />
												</Grid>
												<Grid container item md={1.5} sm={1.5} className="quickOrderPriceColumn">
													<Typography variant="h6">{item.uom}</Typography>
													<Delete
														style={{
															color: "grey",
															cursor: "pointer",
														}}
														onClick={() => deleteExistingRow(index)}
													/>
												</Grid>
											</Grid>
										))}
									</Grid>
								</Grid>
								{/* <Grid
									item
									xs={2}></Grid> */}
								<Grid item md={11} sm={11}>
									<button className="addAnItemButton flex" onClick={() => addNewColumn()} style={{ textAlign: "center" }}>
										<Typography variant="h6" style={{ marginRight: "10px" }}>
											+
										</Typography>
										Add an Item
									</button>
								</Grid>
								<Grid item container md={11} sm={11} className="quickOrderBottomSection">
									<Grid item container md={3} sm={6} className="flex">
										<Grid ietm md={6} style={{ textAlign: "right" }}>
											{/* <Typography variant='body1' className='greyFont'>VAT:</Typography>
                                                    <Typography variant='h5' >Total Price:</Typography> */}
										</Grid>
										<Grid ietm md={6} style={{ paddingLeft: "10px" }}>
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
									<Grid item md={2} sm={3} className="flex">
										<Typography onClick={() => moveToNext()} variant="h6">
											Next &nbsp;
										</Typography>
										<button onClick={() => moveToNext()} className="nextButton flex">
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
				<PopupAlert open={showPopup} message={message} severty={severty} onClose={handleClosePopup} />
			</Grid>
			{orderPage == "1" ? (
				<Grid container xs={12} sx={{ display: { xs: "block", sm: "block", md: "none" } }}>
					<Grid item container style={{ height: "78px" }}>
						<Navbar />
					</Grid>
					{mobileItem === "NS" ? (
						<Grid item container  xs={12}>
							<Grid item container xs={12} style={{ height: "60px" }}>
								<Grid
									item
									xs={12}
									style={{
										paddingTop: "10px",
										paddingLeft: "20px",
										marginBottom: "10px",
									}}
								>
									<Typography variant="h3">Quick Order </Typography>
								</Grid>
								<Grid
									item
									xs={0}
									style={{
										paddingTop: "10px",
										display: "flex",
										alignItems: "center",
										justifyContent: "right",
									}}
								>
									{/* <CloseIcon /> */}
								</Grid>
							</Grid>
							<Grid
								container
								item
								xs={12}
								style={{
									height: "calc(100vh - 60px - 78px - 60px - 53px - 56px )",
									display: "flex",
									flexDirection: "rows",
									alignContent: "flex-start",
									justifyContent: "center",
									backgroundColor: "#f8f8f8",
									overflowY: "scroll",
								}}
							>
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
											}}
										>
											<Grid item xs={8} style={{ height: "90%" }}>
												<Typography variant="body1" color="grey">
													{item.LottypeCode?.label ?? "No Item Detail Selected, Edit to Select"}
												</Typography>
												<Typography variant="h4">{item.ShadeCode?.label}</Typography>
											</Grid>
											<Grid
												item
												xs={4}
												style={{
													height: "90%",
													textAlign: "right",
													paddingRight: "5px",
												}}
											>
												<ModeEditIcon
													onClick={() => setMobileItem(index)}
													style={{
														paddingRight: "5px",
													}}
												/>
												<Delete onClick={() => deleteExistingRow(index)} />
												<Typography variant="h6">
													{" "}
													<Typography
														style={{
															color: "grey",
															fontSize: "12px",
														}}
														variant="p"
													>
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
										className="flex"
									>
										<Typography variant="h4">No Items in the list !</Typography>
										<Typography variant="body2" color="grey">
											Please tap “Add an items” button below to add first item in your list.
										</Typography>
										<br />
										<Typography variant="body2" color="grey">
											<ArrowDownwardIcon />
										</Typography>
									</Grid>
								)}
							</Grid>
							<Grid item xs={12} className="flex" style={{ background: "transparent" }}>
								<button className="addAnItemButtonMobile flex" onClick={() => addNewColumnMobile(true)} style={{ textAlign: "center" }}>
									<Typography variant="h6" style={{ marginRight: "10px" }}>
										+
									</Typography>
									Add an Item
								</button>
							</Grid>
							<Grid item xs={12}  className="quickOrderBottomSectionMobile">
								<Typography onClick={() => moveToNext()} variant="h6">
									Next  &nbsp;
								</Typography>
								<button onClick={() => moveToNext()} className="nextButtonMobile  flex">
									<ArrowForwardIcon />
								</button>
							</Grid>
						</Grid>
					) : (
						<Grid item container xs={12}>
							<Grid item container xs={12} style={{ height: "40px" }}>
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
									}}
								>
									<ArrowBackIosIcon />
								</Grid>
								<Grid item xs={10.5} style={{ paddingTop: "10px", marginBottom: "15px" }}>
									<Typography variant="h3">Add An Item</Typography>
								</Grid>
								<Grid item container className="addItemRowSectionMobile">
									<Grid container style={{ marginBottom: "10px", height: "60px" }}>
										<Grid item container xs={12} className="flex" style={{ marginBottom: "10px" }}>
											<Grid
												item
												xs={12}
												style={{
													paddingLeft: "7%",
													marginBottom: "5px",
												}}
											>
												<Typography variant="body2"> Product </Typography>
											</Grid>

											<Grid item xs={12} className="flex">
												<ProductBox
													debouncedApiCall={debouncedApiCall}
													token={token}
													baseURL={baseURL}
													options={allProduct}
													index={mobileItem}
													rows={cart}
													setRows={setRows}
													label="Select Product"
													setShadesByCode={setShadesByCode}
													updateComp="update"
												/>
											</Grid>
										</Grid>

										<Grid item container xs={12} className="flex" style={{ marginBottom: "10px" }}>
											<Grid
												item
												xs={12}
												style={{
													paddingLeft: "7%",
													marginBottom: "5px",
												}}
											>
												<Typography variant="body2"> Shades</Typography>
											</Grid>
											<Grid item xs={12} className="flex">
												<ShadeCodeBox
													debouncedApiCall={debouncedApiCall}
													label="Shades"
													options={cart[mobileItem]?.shade}
													rows={cart}
													setRows={setRows}
													index={mobileItem}
													getProductDescriptionbyCode={getProductDescriptionbyCode}
												/>
											</Grid>
										</Grid>
										<Grid item container xs={12} className="flex" style={{ marginBottom: "10px" }}>
											<Grid
												item
												xs={12}
												style={{
													paddingLeft: "7%",
													marginBottom: "5px",
												}}
											>
												<Typography variant="body2"> Product Description </Typography>
											</Grid>
											{console.log("IM From IN JSX", mobileItem)}
											<Grid item xs={12} className="flex">
												<CategoryBox
													debouncedApiCall={debouncedApiCall}
													token={token}
													baseURL={baseURL}
													options={cart[mobileItem]?.productCategoryList}
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
										<Grid item container xs={12} className="flex" style={{ marginBottom: "10px" }}>
											<Grid
												item
												xs={12}
												style={{
													paddingLeft: "7%",
													marginBottom: "5px",
												}}
											>
												<Typography variant="body2"> Quantity</Typography>
											</Grid>
											<Grid item container xs={12} className="flex">
												<Quantity debouncedApiCall={debouncedApiCall} rows={cart} setRows={setRows} index={mobileItem} />
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Grid item  xs={12} className="placeOrderSubmitButton">
									<Grid item xs={12} style={{ width: "100%" }} className="flex">
										<button
											onClick={() => updatProductFromMobile()}
											className="addAnItemButtonMobile flex"
											style={{ position: "relative", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}
										>
											{isMobItemLoading ? (
												<CircularProgress
													size={24}
													style={{
														position: "absolute",
														top: "50%",
														left: "50%",
														marginTop: -12,
														marginLeft: -12,
													}}
												/>
											) : (
												<Typography variant="h6" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
													Add To Cart 
												</Typography>
											)}
										</button>
									</Grid>
									<Grid item xs={12} style={{width: "100%" }} className="flex">
										<button
											disabled={isMobItemLoading}
											onClick={() => updatProductFromMobile(true)}
											className="addAnItemButtonMobile flex"
											style={{ textAlign: "center" }}
										>
											<Typography variant="h6" style={{ marginRight: "10px" }}>
												Done
											</Typography>
										</button>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					)}

					<PopupAlert open={showPopup} message={message} severty={severty} onClose={handleClosePopup} />
				</Grid>
			) : orderPage == "2" ? (
				<Grid container xs={12} sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>
					<Grid item container style={{ height: "78px" }}>
						<Navbar />
					</Grid>
					<Grid item container xs={12} className="cartMainMobile">
						<Grid item container xs={12} className="yourcartmain2Mobile flex">
							<Grid item xs={11} style={{ height: "50px", backgroundColor: "white" }}>
								<Typography variant="h3">Your Cart</Typography>
							</Grid>
							<Grid container xs={12} className="flex cartProductMobile">
								{isLoading && (
									<Backdrop
										sx={{
											color: "#fff",
											zIndex: (theme) => theme.zIndex.drawer + 1,
										}}
										open={isLoading}
									>
										<CircularProgress color="inherit" />
									</Backdrop>
								)}

								<Grid container item xs={11.5} className="cartScrollSection">
									{cart.map((item, index) => {
										if (item.LottypeCode.value && item.ShadeCode.label && item.LottypeCode.HsCode && item.OrderQty && item.selectedYardage.label) {
											return (
												<Grid container className="yourCartRow">
													<Grid container item xs={8}>
														<Typography variant="h5">{item.LottypeCode.label}</Typography>
														<Grid item xs={12}>
															<Typography variant="p1" className="greyFont">
																Shades:{" "}
															</Typography>
															<Typography variant="p1">{item.ShadeCode.label}</Typography>
														</Grid>
														<Grid item xs={12}>
															<Typography variant="p1" className="greyFont">
																Yardage:
															</Typography>
															<Typography variant="p1">{item.selectedYardage.label}</Typography>
														</Grid>
													</Grid>
													<Grid item container xs={4}>
														<Grid
															item
															xs={11}
															style={{
																display: "flex",
																justifyContent: "end",
															}}
														>
															<Grid
																item
																md={4}
																style={{
																	cursor: "pointer",
																}}
																onClick={() => deleteExistingRow(index)}
															>
																<DeleteIcon />
															</Grid>
														</Grid>
														<Grid
															item
															xs={12}
															style={{
																marginTop: "10%",
															}}
														>
															<QuantityCheckout debouncedApiCall={debouncedApiCall} item={item} rows={cart} index={index} />
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
					<Grid item xs={12} className="quickOrderBottomSectionMobile">
						<Typography onClick={() => navigate("/quickOrder/3")} variant="h6">
							Next &nbsp;
						</Typography>
						<button onClick={() => navigate("/quickOrder/3")} className="nextButtonMobile  flex">
							<ArrowForwardIcon />
						</button>
					</Grid>
				</Grid>
			) : (
				<Grid container xs={12} sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}>
					<Grid item container style={{ height: "78px" }}>
						<Navbar />
					</Grid>
					<Checkout debouncedApiCall={debouncedApiCall} setStep={setStep} rows={cart} setOrderSuccess={setOrderSuccess} orderSuccess={orderSuccess} shopes={shopes} />
				</Grid>
			)}
		</>
	) : (
		<OrderPlaceCard firstName={firstName} debouncedApiCall={debouncedApiCall} />
	)
}

export default QuickOrder
