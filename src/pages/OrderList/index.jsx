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
        // width: '100%',   
        height: 'auto',
        backgroundColor: '#fff',
        margin: '10px 0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        padding: '20px',
        borderRadius: '10px',
    };

    const isMobile = useMediaQuery("(max-width: 600px)");
    const isTablet = useMediaQuery("(max-width: 900px)");
    
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
        <Grid container style={{ padding: isMobile ? '0 10px' : '0 20px' }}>
            <Grid item xs={12} className="recentOrderNabar">
                <Navbar />
            </Grid>
            <Grid item xs={12} className="recentOrderHero">
                <div style={cardStyle} className="order-list">
                    <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>Order List</h2>

                    <Grid container spacing={isMobile ? 1 : 2} style={{ marginBottom: '20px' }}>
                        {/* Product Selector */}
                        <Grid item xs={12} sm={6} md={3}>
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
                                    width: "100%",
                                    height: "40px",
                                    boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08)",
                                    background: "white",
                                    borderRadius: "8px",
                                }}
                                children={
                                    <Input
                                        type="text"
                                        onInput={() => searchProduct()}
                                        style={{
                                            height: "40px",
                                            boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08)",
                                            background: "white",
                                            borderRadius: "8px",
                                        }}
                                    />
                                }
                            />
                        </Grid>

                        {/* Shade Selector */}
                        <Grid item xs={12} sm={6} md={2}>
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
                                    width: "100%",
                                    height: "40px",
                                    boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08)",
                                    background: "white",
                                    borderRadius: "8px",
                                }}
                                children={
                                    <Input
                                        type="text"
                                        onInput={() => searchProduct(true)}
                                        style={{
                                            height: "40px",
                                            boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08)",
                                            background: "white",
                                            borderRadius: "8px",
                                        }}
                                    />
                                }
                            />
                        </Grid>

                        {/* From Date */}
                        <Grid item xs={12} sm={5.6} md={2}>
                            <input 
                                style={{ 
                                    width: isMobile ? '95%': '100%', 
                                    height: '40px', 
                                    border: '1px solid #d9d9d9', 
                                    borderRadius: '6px', 
                                    fontSize: '16px',
                                    padding: '0 10px',
                                    boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08)",
                                }}
                                value={fromDate} 
                                onChange={(e) => setFromDate(e.target.value)} 
                                type='date' 
                                placeholder='From Date' 
                            />
                        </Grid>

                        {/* To Date */}
                        <Grid item xs={12} sm={5.6} md={2}>
                            <input 
                                style={{ 
                                    width: isMobile ? '95%': '100%', 
                                    height: '40px', 
                                    border: '1px solid #d9d9d9', 
                                    borderRadius: '6px', 
                                    fontSize: '16px',
                                    padding: '0 10px',
                                    boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08)",
                                    marginLeft: isMobile ? '' : '20px'
                                }}
                                value={toDate} 
                                onChange={(e) => setToDate(e.target.value)} 
                                type='date' 
                                placeholder='To Date' 
                            />
                        </Grid>

                        {/* Get Data Button */}
                        <Grid item xs={12} sm={12} md={3} style={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end' }}>
                            <button
                                className="checkoutButton flex"
                                style={{
                                    width: isMobile ? '100%' : 'auto',
                                    minWidth: '120px',
                                    margin: 0,
                                    ...(loadingState ? { 
                                        backgroundColor: 'transparent', 
                                        border: '1px solid #e46e39' 
                                    } : {})
                                }}
                                onClick={() => getProductListByParams()}>
                                {!loadingState ? <b>Get Data</b> : <CircularProgress style={{ color: '#e46e39', width: '25px', height: '25px' }} />}
                            </button>
                        </Grid>
                    </Grid>

                    {/* Table */}
                    <Grid item xs={12}>
                        <div style={{ overflowX: 'auto' }}>
                            <MuiSearchTable list={orderData} />
                        </div>
                    </Grid>

                    <PopupAlert open={showPopup} message={message} severty={severty} onClose={handleClosePopup} />
                </div>
            </Grid>
        </Grid>
    );
};

export default OrderList;