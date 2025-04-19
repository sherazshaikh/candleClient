import { CircularProgress, Grid, TextField } from '@mui/material';
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
        height: 'auto',
        backgroundColor: '#fff',
        margin: '10px 0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        padding: '20px',
        borderRadius: '10px',
    };

    const isMobile = useMediaQuery("(max-width: 600px)");

    let {
        baseURL,
        auth: { token },
    } = useSelector((state) => state);
    const [allProduct, setAllProduct] = useState([]);
    const [allProductOptions, setAllProductOptions] = useState([]);
    const [allShades, setShades] = useState([]);
    const [allShadesOptions, setShadesOptions] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [productLabel, setProductLabel] = useState(null);
    const [shadeLabel, setShadeLabel] = useState(null);
    const [loadingState, setLoadingState] = useState(false);
    const [showPopup, setShowPopup] = useState(false)
    const [severty, setSeverty] = useState("error");
    const [orderData, setOrderData] = useState([]);
    const [allShadesList, setAllShadesList] = useState([]);
    const [shadePlaceholder, setShadePlaceholder] = useState("Select Shade");

    const message = "To Date Must Be Greater then From Date"
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
                setAllProduct(data.data);
            })
            .catch((error) => console.log(error));
    };

    // GET SHADES BY PRODUCT CODE
    const setShadesByCode = async (product) => {
        executeApi(
            baseURL + `/v1/Order/getShadeByCategoryId?categoryId=${product?.id}`,
            {},
            variables.shades.method,
            token,
            dispatch
        )
            .then((data) => {
                // FILTER DUPLICATE SHADES VALUES FROM SHADES
                // const uniqueArray = data?.data?.filter((obj, index, self) =>
                //     index === self.findIndex(o =>
                //         o.shadeCode === obj.shadeCode
                //     )
                // );
                setShades(data.data);
            })
            .catch((error) => console.log(error));
    };

    //GET ORDER LIST BY PARAMS
    const getProductListByParams = async () => {
        setShowPopup(false)
        if (toDate < fromDate) {
            setShowPopup(true)
            return
        }

        setLoadingState(true)
        let shadeCode = shadeLabel ? allShadesOptions?.filter(shd => shd.value == shadeLabel)[0]?.label || '' : ""
        let productCode = allProductOptions?.filter(prdct => prdct.value == productLabel)[0]?.id || ''

        await executeApi(
            baseURL + `${variables.getProductListByParams.url}?categoryId=${productCode}&shadeCode=${shadeCode}&fromDate=${fromDate || ''}&toDate=${toDate || ''}`,
            {},
            variables.getProductListByParams.method,
            token,
            dispatch
        )
            .then((data) => {
                setOrderData(data.data);
            })
            .catch((error) => console.log(error));
        setLoadingState(false)
    };

    // SHOW OPTIONS FROM DATA
    const ShowAllOptions = (isShade) => {
        if (isShade) {
            let list = productLabel ? allShades : allShadesList
            if (!productLabel) {
                setShades(allShadesList)
            }
            if ((list && list.length > 0)) {
                let abcd = list?.map((option) => {
                    return { label: option.shadeCode, value: option.shadeCode }
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

    // HANDLE CHANGE VALUE OR REMOVE
    const updateProduct = (value, obj, isShade) => {
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
                setShades(allShadesList)
                setShadesOptions([])
            } else setShadeLabel('')
        }
    }


    //SEARCH FILTER ON ALL DROPDOWN
    const searchProduct = (isShade) => {
        if (isShade) {
            let filteredShades = allShades.filter((option) => {
                return option.shadeCode?.toLowerCase().includes(shadeLabel?.toLowerCase())
            })

            filteredShades = filteredShades.map((option) => {
                return { label: option.shadeCode, value: option.shadeCode }
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

    // ERROR TOASTER SHOW 
    const handleClosePopup = () => {
        setShowPopup(false)
    }

    //GET ALL SHADES WITHOUTH PARAMS
    const getAllShadesCode = async () => {
        setShadePlaceholder('Loading....')
        executeApi(
            baseURL + variables.allShades.url,
            {},
            variables.allShades.method,
            token,
            dispatch
        )
            .then((data) => {
                // FILTER DUPLICATE SHADES VALUES FROM SHADES
                // const uniqueArray = data?.data?.filter((obj, index, self) =>
                //     index === self.findIndex(o =>
                //         o.shadeCode === obj.shadeCode
                //     )
                // );
                setAllShadesList(data.data);
                setShadePlaceholder('Select Shade')
            })
            .catch((error) => console.log(error));

    };

    // INITIAL API CALL ON MOUNT COMPONENT
    useEffect(() => {
        getAllProduct();
        getAllShadesCode()
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
                                placeholder={shadePlaceholder}
                                allowClear={true}
                                value={shadeLabel}
                                onSelect={(e, v) => updateProduct(e, v, true)}
                                onSearch={(v) => setShadeLabel(v)}
                                onClear={() => updateProduct(null, null, true)}
                                onFocus={() => ShowAllOptions(true)}
                                disabled={shadePlaceholder == 'Loading....'}
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
                            {/* <input
                                style={{
                                    width: isMobile ? '95%' : '100%',
                                    height: '40px',
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    padding: '0 10px',
                                    boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08)",
                                    background: '#fff'
                                }}
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                type='date'
                                placeholder='From Date'
                            /> */}
                            <TextField
                                fullWidth
                                type="date"
                                label="From Date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    disableUnderline: true,
                                    style: {
                                      background: '#fff',
                                      borderRadius: '8px',
                                      height: '40px',
                                      padding: '0 10px',
                                      boxShadow: '0 3px 13px 0 rgba(0, 0, 0, 0.08)',
                                      fontSize: '16px',
                                      border: 'none',
                                      outline: "none"
                                    },
                                  }}
                            />
                        </Grid>

                        {/* To Date */}
                        <Grid item xs={12} sm={5.6} md={2}>
                            <TextField
                                fullWidth
                                type="date"
                                label="To Date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    disableUnderline: true,
                                    style: {
                                      background: '#fff',
                                      borderRadius: '8px',
                                      height: '40px',
                                      padding: '0 10px',
                                      boxShadow: '0 3px 13px 0 rgba(0, 0, 0, 0.08)',
                                      fontSize: '16px',
                                    },
                                  }}
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