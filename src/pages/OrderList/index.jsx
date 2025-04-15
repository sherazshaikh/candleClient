import { CircularProgress, Grid } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import { variables } from '../../utils/config';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { executeApi } from "../../utils/WithAuth";
import { AutoComplete, Input } from 'antd';
import { useMediaQuery } from "@mui/material";
import PopupAlert from '../../components/PopupAlert/PopupAlert';
import MuiSearchTable from '../../components/MuiSearchTable'

const OrderList = () => {
    const cardStyle = {
        width: '100%',
        height: 'auto',
        backgroundColor: '#fff',
        margin: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        padding: '20px',
        borderRadius: '10px',
        // overflow: 'hidden'
    };





    //code ....... js.......
    const isMobile = useMediaQuery("(max-width: 600px)")
    // let cart = useSelector((state) => state.cart);
    let {
        baseURL,
        auth: { token },
    } = useSelector((state) => state);
    const [allProduct, setAllProduct] = useState([]);
    const [allProductOptions, setAllProductOptions] = useState([]);
    const [allShades, setShades] = useState([]);
    const [allShadesOptions, setShadesOptions] = useState([]);
    const [message, setMessage] = useState("To Date Must Be Greater then From Date")
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [productLabel, setProductLabel] = useState(null);
    const [shadeLabel, setShadeLabel] = useState(null);
    const [loadingState, setLoadingState] = useState(false);
    const [showPopup, setShowPopup] = useState(false)
    const [severty, setSeverty] = useState("error");
    const [orderData, setOrderData] = useState([]);



    const dispatch = useDispatch();


    //GET ALL PRODUCT
    const getAllProduct = async () => {
        await executeApi(
            baseURL + variables.getAllProduct.url,
            {},
            variables.shades.method,
            token,
            dispatch
        )
            .then((data) => {
                console.log('data: ', data);
                setAllProduct(data.data);
            })
            .catch((error) => console.log(error));
    };

    // GET SHADES BY PRODUCT CODE
    const setShadesByCode = async (product) => {
        console.log('rows: ', product);


        executeApi(
            baseURL + `/v1/Order/getShadeByCategoryId?categoryId=${product?.id}`,
            {},
            variables.shades.method,
            token,
            dispatch
        )
            .then((data) => {
                setShades(data.data);

            })
            .catch((error) => console.log(error));
    };

    const getProductListByParams = async () => {
        setShowPopup(false)
        if (toDate < fromDate) {
            setShowPopup(true)
            return
        }

        setLoadingState(true)
        let shadeCode = allShadesOptions?.filter(shd => shd.value == shadeLabel)[0]?.label || ''
        let productCode = allProductOptions?.filter(prdct => prdct.value == productLabel)[0]?.id || ''

        await executeApi(
            baseURL + `${variables.getProductListByParams.url}?productCode=${productCode}&shadeCode=${shadeCode}&fromDate=${fromDate || ''}&toDate=${toDate || ''}`,
            {},
            variables.getProductListByParams.method,
            token,
            dispatch
        )
            .then((data) => {
                console.log('data: ', data);
                setOrderData(data.data);
            })
            .catch((error) => console.log(error));
        setLoadingState(false)
    };

    const ShowAllOptions = (isShade) => {
        if (isShade) {
            if (allShades && allShades.length > 0) {
                let abcd = allShades?.map((option) => {
                    return { label: option.shadeCode, value: option.shadeDesc }
                })
                setShadesOptions(abcd)
            }
        } else {
            if (allProduct && allProduct.length > 0) {
                let abcd = allProduct?.map((option) => {
                    return { label: option.categoryName, value: option.categoryName, id: option.categoryId }
                })
                setAllProductOptions(abcd)
            }
        }
    }
    const updateProduct = (value, obj, isShade) => {
        console.log('value: ', value);
        if (value) {
            if (isShade) {
                setShadeLabel(value)
            } else {
                setProductLabel(value)
                setShadeLabel('')
                setShadesByCode(obj)

            }
        } else {
            if (!isShade) {
                setShadeLabel('')
                setShades([])
                setShadesOptions([])
            }
        }

    }
    const searchProduct = (isShade) => {

        if (isShade) {
            let filteredShades = allShades.filter((option) => {
                return option.categoryName.toLowerCase().includes(productLabel.toLowerCase())
            })

            filteredShades = filteredShades.map((option) => {
                return { label: option.shadeCode, value: option.shadeDesc }
            })
            setShadesOptions(filteredShades)

        } else {
            let filteredProduct = allProduct.filter((option) => {
                return option.categoryName.toLowerCase().includes(productLabel.toLowerCase())
            })
            filteredProduct = filteredProduct.map((option) => {
                return { label: option.categoryName, value: option.categoryName, id: option.categoryId }
            })
            setAllProductOptions(filteredProduct)
        }
    }

    const handleClosePopup = () => {
        setShowPopup(false)
    }
    // INITIAL API CALL
    useEffect(() => {
        getAllProduct();
    }, []);

    return (
        <Grid container>
            <Grid item container className="recentOrderNabar">
                <Navbar />
            </Grid>
            <Grid container className="recentOrderHero">
                <div style={cardStyle} className="order-list">
                    <h2>Order List</h2>

                    {/* <div> */}
                    <Grid style={{ height: 'auto', overflow: 'hidden' }} container spacing={2} className="">
                        <Grid item md={3} sm={3} >
                            <AutoComplete
                                options={allProductOptions}
                                placeholder="Select Product"
                                allowClear={true}
                                value={productLabel}
                                onSelect={(e, v) => updateProduct(e, v)}
                                onSearch={(v) => setProductLabel(v)}
                                onClear={() => updateProduct()}
                                onFocus={() => ShowAllOptions()}
                                style={{
                                    width: "90%",
                                    height: "40px",
                                    boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08);",
                                    background: isMobile ? "white" : "transparent",
                                    borderRadius: { xs: "8px" },
                                }}
                                children={
                                    <Input
                                        type="text"
                                        onInput={() => searchProduct()}
                                        style={{
                                            height: "40px",
                                            boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08);",
                                            background: isMobile ? "white" : "transparent",
                                            borderRadius: { xs: "8px" },
                                        }}
                                    />
                                }
                            />
                        </Grid>
                        <Grid item md={2} sm={2} >
                            <AutoComplete
                                key={1}
                                options={allShadesOptions}
                                placeholder="Select Shade"
                                allowClear={true}
                                value={shadeLabel}
                                onSelect={(e, v) => updateProduct(e, v, true)}
                                onSearch={(v) => setShadeLabel(v)}
                                onClear={() => updateProduct(null, null, true)}
                                onFocus={() => ShowAllOptions(true)}
                                style={{
                                    width: "90%",
                                    height: "40px",
                                    boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08);",
                                    background: isMobile ? "white" : "transparent",
                                    borderRadius: { xs: "8px" },
                                }}
                                children={
                                    <Input
                                        type="text"
                                        onInput={() => searchProduct(true)}
                                        style={{
                                            height: "40px",
                                            boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08);",
                                            background: isMobile ? "white" : "transparent",
                                            borderRadius: { xs: "8px" },
                                        }}
                                    />
                                }
                            />
                        </Grid>
                        <Grid item md={2} sm={2} >
                            <input style={{ width: '90%', height: '40px', border: '1px solid #d9d9d9', borderRadius: '6px', fontSize: '16px' }}
                                value={fromDate} onInput={(e) => setFromDate(e.target.value)} type='date' placeholder='From Date' />
                        </Grid>
                        <Grid item md={2} sm={2} >
                            <input style={{ width: '90%', height: '40px', border: '1px solid #d9d9d9', borderRadius: '6px', fontSize: '16px' }}
                                value={toDate} onInput={(e) => setToDate(e.target.value)} type='date' placeholder='To Date' />
                        </Grid>

                        <Grid item md={3} sm={3}>
                            <button

                                className="checkoutButton flex"
                                style={loadingState ? { backgroundColor: 'transparent', border: '1px solid #e46e39', margin: 0 } : { margin: 0 }}
                                onClick={() => getProductListByParams()}>
                                {!loadingState ? <b> Get Data</b> : <CircularProgress style={{ color: '#e46e39', width: '25px', height: '25px' }} />}
                            </button>
                        </Grid>
                        <Grid item md={12} sm={12} >
                            <MuiSearchTable list={orderData} />
                        </Grid>
                    </Grid>
                    <PopupAlert open={showPopup} message={message} severty={severty} onClose={handleClosePopup} />
                </div>
            </Grid>
        </Grid>
    );
};

export default OrderList;
