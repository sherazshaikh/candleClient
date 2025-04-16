import { Backdrop, CircularProgress, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './checkout.css'
import DeliveryDuration from '../../components/DeliveryDuration/DeliveryDuration'
import ShippingAddress from '../../components/ShippingAddress/ShippingAddress'
import PaymentMethod from '../../components/PaymentMethod/PaymentMethod'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import Input from '../../components/Input/Input'
import { useDispatch, useSelector } from 'react-redux'
import { variables } from '../../utils/config'
import { executeApi } from '../../utils/WithAuth'
import PopupAlert from '../../components/PopupAlert/PopupAlert'
import { updateCart } from '../redux/features/cart/cartslice'
import { useNavigate } from 'react-router-dom'
import { v4 } from 'uuid'
import Quantity from '../../components/Quantity/Quantity'
import QuantityCheckout from '../../components/Quantity/QuantityCheckout'
import { Button, Upload, message } from 'antd'
import { Spa, UploadOutlined } from '@mui/icons-material'
import CustomSelect from '../../components/CustomSelect'

const Checkout = ({ debouncedApiCall, setStep, rows, setOrderSuccess, orderSuccess, shopes }) => {
	const { userId, paymentType, branchcodeOrcl } = useSelector((state) => state.auth.user)
	let { cart } = useSelector(state => state)
	const [selectedPoint, setSelectedPoint] = useState(branchcodeOrcl)
	const navigate = useNavigate()
	const [attachment, setAttachment] = useState('')
	const [uploadProgress, setUploadProgress] = useState(false)
	const [message1, setMessage] = useState('')
	const [loadingState, setLoadingState] = useState(false)
	const [severty, setSeverty] = useState('')
	const [showPopup, setShowPopup] = useState(false)
	const [isLoading, setLoading] = useState(false)
	let {
		baseURL,
		auth: { token },
	} = useSelector((state) => state)
	const [rName, setRName] = useState('')
	const [paymntMethod, setPaymntMethod] = useState(paymentType)
	const dispatch = useDispatch()
	const [fileList, setFileList] = useState([])

	useEffect(() => {
		console.log("Checkout", rows)
	}, [rows])

	const setSelectedPointFun = (v) => {
		setSelectedPoint(v)
	}
	let orderDetailsRows = rows.filter((item, index) => {
		if (item.LottypeCode.value && item.ShadeCode.value && item.LottypeCode.HsCode && item.OrderQty && item.selectedYardage.label) {
			return item
		}
	})

	useEffect(() => {
		if (!branchcodeOrcl) {
			setSelectedPoint(shopes?.[0]?.['addCode'])
		}
	}, [shopes])

	const handleClosePopup = () => {
		setShowPopup(false)
	}
	const deleteExistingRow = async (index1) => {
		setLoading(true)
		if (rows.length > 0) {
			let newRows = rows.filter((i) => {
				if (index1 !== i.uuid) {
					return i
				}
			})
			console.log(newRows)
			dispatch(updateCart(newRows))
			let finalCart = []
			if (newRows.length > 0) {
				for (const orderDetail of newRows) {
					finalCart.push({
						lottypecode: Object.values(orderDetail.LottypeCode).join('BTWOBJ'),
						shadecode: Object.values(orderDetail.ShadeCode).join('BTWOBJ'),
						qty: orderDetail.OrderQty,
						yardage: Object.values(orderDetail.selectedYardage).join('BTWOBJ'),
						yardagelist: orderDetail.yardage.join('BTWOBJ'),
						shadecodelist: orderDetail.shade.map((obj) => `${obj.shadeCode}BTWOBJ${obj.shadeDesc}`).join('OBJEND'),
						uom: orderDetail.uom,
						productCode: orderDetail?.productCode,
						categoryCode: Object.values(orderDetail.product).join("BTWOBJ"),
						products: Object.values(orderDetail.product).join("BTWOBJ"),
					})
				}
			}

			await executeApi(baseURL + variables.updateCart.url, finalCart, variables.updateCart.method, token, dispatch)
				.then((data) => console.log(data))
				.catch((err) => console.log(err))
			setLoading(false)
		}
		// else {
		//     let newRows = [{
		//         "LottypeCode": { label: "", value: "", HsCode: "" },
		//         "shade": [],
		//         "ShadeCode": { label: "", value: "", HsCode: "" },
		//         "yardage": [],
		//         "selectedYardage": { label: "", value: "", HsCode: "" },
		//         "OrderQty": 12,
		//         "price": 0,
		//         "uuid": v4()
		//     }]
		//     dispatch(updateCart(newRows));
		//     debouncedApiCall()
		// }
	}

	function validateOrder(order) {
		// Check if the required properties exist
		if (!order.CustomerCode || !order.Ordertype || !order.RecName || !order.HsCode || !order.orderDetails) {
			return false
		}

		// Check if orderDetails is an array and has at least one element
		if (!Array.isArray(order.orderDetails) || order.orderDetails.length === 0) {
			return false
		}

		// Validate each order detail in the array
		for (const orderDetail of order.orderDetails) {
			// Check if OrderQty is a positive number
			if (!orderDetail.OrderQty || isNaN(orderDetail.OrderQty) || orderDetail.OrderQty <= 0) {
				return false
			}

			// Additional validation for specific properties in orderDetail
			if (!orderDetail.LottypeCode || !orderDetail.ShadeCode || !orderDetail.HsCode || !orderDetail.Yardage) {
				return false
			}

			// Add more validation rules for other properties as needed
		}

		// If all checks pass, the object is considered valid
		return true
	}

	const props = {
		onRemove: (file) => {
			const index = fileList.indexOf(file)
			const newFileList = fileList.slice()
			newFileList.splice(index, 1)
			setFileList(newFileList)
		},
		beforeUpload: (file) => {
			setFileList([file])
			return false
		},
		fileList,
		accept: '.pdf',
		maxCount: 1,
	}

	const uploadFile = (order) => {
		setUploadProgress(true)
		const formData = new FormData()
		formData.append('File', fileList[0])
		formData.append('AttachmentUrl', '')
		executeApi(baseURL + variables.UploadPOAttachment.url + `?rowuid=${order.rowuid}&branchCode=${order.branchcode}`, formData, variables.UploadPOAttachment.method, token, dispatch)
			.then((result) => {
				updateCartData()
				setOrderSuccess(true)
				// setAttachment(result.data.attachmentUrl);
				// setUploadProgress(false);
				setLoadingState(false)
				setShowPopup(true)
			})
			.catch((error) => {
				setUploadProgress(false)
				console.log(error)
			})
	}

	const placeOrder = () => {
		setLoadingState(true)
		let TblorderMaster = {
			CustomerCode: userId,
			Ordertype: paymntMethod,
			RecName: rName,
			HsCode: '0000',
			PoAttachment: attachment,
			orderDetails: [],
			Branchcode: selectedPoint,
		}
		rows.filter((item, index) => {
			if (item.LottypeCode.value && item.ShadeCode.value && item.LottypeCode.HsCode && item.OrderQty && item.selectedYardage.label) {
				console.log(item)
				TblorderMaster.orderDetails.push({
					LottypeCode: item.LottypeCode.value,
					ShadeCode: item.ShadeCode.label,
					HsCode: item.LottypeCode.HsCode,
					OrderQty: item.OrderQty,
					Yardage: item.selectedYardage.label,
				})
			}
		})
		if (!validateOrder(TblorderMaster)) {
			setSeverty('error')
			setMessage('Please fill all the fields to place an order!')
			setShowPopup(true)
			setLoadingState(false)
		} else {
			executeApi(baseURL + variables.saveOrder.url, TblorderMaster, variables.saveOrder.method, token, dispatch)
				.then((data) => {
					setSeverty(data.success ? 'success' : 'error')
					setMessage(data.message)

					if (data.success) {
						dispatch(
							updateCart([
								{
									LottypeCode: { label: '', value: '', HsCode: '' },
									shade: [],
									ShadeCode: { label: '', value: '', HsCode: '' },
									yardage: [],
									selectedYardage: { label: '', value: '', HsCode: '' },
									OrderQty: 12,
									price: '0',
									uuid: v4(),
								},
							]),
						)
						if (fileList.length > 0) {
							uploadFile(data.data)
						} else {
							updateCartData()
							setLoadingState(false)
							setShowPopup(true)
							setOrderSuccess(true)
						}
					}
				})
				.catch((error) => {
					setSeverty('error')
					setMessage(error.message)
					setShowPopup(true)
					setLoadingState(false)
				})
		}
	}

	async function updateCartData() {
		await executeApi(baseURL + variables.updateCart.url, [], variables.updateCart.method, token, dispatch)
			.then((data) => console.log(data))
			.catch((err) => console.log(err))
	}

	return (
		<Grid container>


			{isLoading &&
				<Backdrop
					sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={isLoading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
			}

			<Grid
				item
				md={12}
				sxm={12}
				xs={12}
				sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}
				style={{ paddingLeft: '15px', height: '70px' }}>
				<br />
				<Typography variant="h3">Checkout</Typography>
				<br />
			</Grid>
			<Grid
				item
				container
				md={8}
				sm={12}
				sx={{ maxHeight: { xs: 'calc(100vh - 148px)', sm: '100vh' }, paddingTop: '10px', background: { xs: '#f8f8f8' } }}
				xs={12}
				className="checkoutMain flex">
				<Grid
					item
					container
					md={10}
					sm={11}
					xs={11}>
					<Grid
						item
						md={12}
						sm={12}
						sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
						disable={isLoading}
						onClick={() => navigate('/')}
						className="checkoutLogo"></Grid>
					<Grid
						item
						md={12}
						sxm={12}
						xs={12}
						sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
						<br />
						<Typography variant="h3">Checkout</Typography>
						<br />
					</Grid>
					<Grid
						item
						md={12}
						sm={12}
						xs={12}
						sx={{ paddingBottom: { xs: '10px' } }}>
						<Typography variant="h5">Pickup Points</Typography>
					</Grid>
					<Grid
						container
						columnSpacing={2}>
						{shopes &&
							shopes?.map((item, index) => (
								<DeliveryDuration
									key={index}
									label={item.addDesc}
									code={item?.addCode}
									selected={selectedPoint}
									setSeleted={setSelectedPointFun}
								/>
							))}
						{/* <DeliveryDuration label="New Karachi" selected={selectedPoint} setSeleted={setSelectedPointFun} />
                        <DeliveryDuration label="Baloch Colony" selected={selectedPoint} setSeleted={setSelectedPointFun} />
                        <DeliveryDuration label="Orangi Town" selected={selectedPoint} setSeleted={setSelectedPointFun} /> */}
					</Grid>
					<Grid
						container
						md={12}
						sm={12}
						style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
						<br />
						<Grid
							item
							md={3.5}
							sx={{ display: { xs: 'none', sm: 'block' } }}>
							<Typography
								variant="p"
								style={{ color: 'grey' }}>
								<span style={{ color: '#e46e39' }}>Enter Reciever Name:</span>
							</Typography>
						</Grid>
						<Grid
							item
							md={4}
							sx={{ marginTop: { xs: '10px', sm: '0px' } }}>
							{/* <Input
								type="text"
								placeholder="Enter Reciever Name"
								value={rName}
								setValue={setRName}
								border={true}
							/> */}
							<CustomSelect data={[]} label='Enter Reciever Name' />
							
						</Grid>
					</Grid>
					<Grid
						item
						md={12}
						sm={12}
						sx={{ paddingBottom: { xs: '10px' } }}>
						<br />
						<Typography variant="h5">Delivery Type</Typography>
					</Grid>
					<Grid
						container
						columnSpacing={2}>
						<ShippingAddress />
						{/* <ShippingAddress /> */}
					</Grid>
					<Grid
						item
						md={12}
						sm={12}
						sx={{ paddingBottom: { xs: '10px' } }}>
						<br />
						<Typography variant="h5">Payment Method</Typography>
					</Grid>
					<Grid
						container
						columnSpacing={2}>
						{paymentType == 'Cash' ? (
							<>
								<PaymentMethod
									label="Online"
									selected={paymntMethod}
									setSeleted={setPaymntMethod}
								/>
								<PaymentMethod
									label="Cash"
									selected={paymntMethod}
									setSeleted={setPaymntMethod}
								/>
							</>
						) : (
							<>
								<PaymentMethod
									label="Credit"
									selected={paymntMethod}
									setSeleted={setPaymntMethod}
								/>
								<PaymentMethod
									label="Cash"
									selected={paymntMethod}
									setSeleted={setPaymntMethod}
								/>
							</>
						)}
					</Grid>
					<Grid
						container
						xs={12}>
						<Grid
							item
							md={12}
							sm={12}
							s={12}>
							<br />
							<Upload {...props}>
								<Typography variant="p">
									If you have any PO click here to{' '}
									<Typography
										variant="p"
										sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
										ATTACH
									</Typography>{' '}
								</Typography>
							</Upload>
						</Grid>
					</Grid>
					<Grid
						item
						container
						md={12}
						sm={12}
						className="checkoutPageCheckoutButtons">
						<button
							disabled={isLoading}
							onClick={() => navigate('/quickOrder/1')}
							className="checkoutButtonBack flex">
							<KeyboardArrowLeftIcon />
							Back
						</button>
						<button
							className="checkoutButton flex"
							style={loadingState ? { backgroundColor: 'transparent', border: '1px solid #e46e39' } : {}}
							onClick={() => placeOrder()}>
							{!loadingState ? <b> Place Order</b> : <CircularProgress style={{ color: '#e46e39', width: '25px', height: '25px' }} />}
						</button>
					</Grid>
				</Grid>
			</Grid>
			<Grid
				item
				container
				md={4}
				sm={4}
				sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}
				style={{ overflowY: 'scroll' }}
				className="cartMain">
			
				<Grid
					item
					md={11}
					className="yourcartmain2">
					<Typography variant="h4">Your Cart</Typography>
					<Grid
						container
						className="flex">
						<Grid
							container
							item
							md={12}
							className="cartScrollSection">
							{rows.map((item, index) => {
								if (item.LottypeCode.value && item.ShadeCode.label && (item.LottypeCode.HsCode || item.LottypeCode.hsCode) && item.OrderQty && item.selectedYardage.label) {
									return (

										<Grid
											container
											key={index}
											className="yourCartRow">

											<Grid
												container
												item
												md={6}
												sm={6}>
												<Typography variant="body1">{item.LottypeCode.label}</Typography>
												<Grid>
													<Typography
														variant="p1"
														className="greyFont">
														Shades:
													</Typography>
													<Typography variant="p1">{item.ShadeCode.label}</Typography>
												</Grid>
												<Grid>
													<Typography
														variant="p1"
														className="greyFont">
														Yardage:
													</Typography>
													<Typography variant="p1">{item.selectedYardage.label}</Typography>
												</Grid>
											</Grid>
											<Grid
												item
												md={4}
												sm={4}>
												<QuantityCheckout
													debouncedApiCall={debouncedApiCall}
													item={item}
													rows={rows}
													index={index}
												/>
											</Grid>
											<Grid
												item
												container
												md={1}
												sm={1}>
												<Grid
													item
													md={4}
													style={{ cursor: 'pointer' }}
													onClick={() => deleteExistingRow(item.uuid)}>
													<DeleteIcon />
												</Grid>
											</Grid>
										</Grid>
									)
								}
							})}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<PopupAlert
				open={showPopup}
				message={message1}
				severty={severty}
				onClose={handleClosePopup}
			/>
		</Grid>
	)
}

export default Checkout
