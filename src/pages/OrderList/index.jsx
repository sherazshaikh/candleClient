import { Grid } from '@mui/material';
import Navbar from '../../components/Navbar/Navbar';
import ProductBox from '../../components/ProductBox';
import ShadeCodeBox from '../../components/ShadeCodeBox';
import { variables } from '../../utils/config';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { executeApi } from "../../utils/WithAuth";
import { AutoComplete, Input } from 'antd';
import { useMediaQuery } from "@mui/material";

const OrderList = () => {
    const cardStyle = {
        width: '100%',
        height: '90%',
        backgroundColor: '#fff',
        margin: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        padding: '20px',
        borderRadius: '10px',
    };
    const fullWidthStyle = {
        width: '100% !imoportant',
    }

    const isMobile = useMediaQuery("(max-width: 600px)")




    //code ....... js.......
    let cart = useSelector((state) => state.cart);
    let {
        baseURL,
        auth: { token },
    } = useSelector((state) => state);
    const [allProduct, setAllProduct] = useState([]);
    const [allProductOptions, setAllProductOptions] = useState([]);
    const [allShades, setShades] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [productLabel, setProductLabel] = useState(null);

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
            baseURL + `/v1/Order/getShadeByCategoryId?categoryId=${product.id}`,
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

    const getProductDescriptionbyCode = async (shade, i, rows, initial) => {
        console.log('shade: ', shade, i, rows, initial);
    }

    const getProductListByParams = async (productCode, shadeCode, fromDate, toDate) => {
        console.log('productCode: ', productCode, shadeCode, fromDate, toDate);
        await executeApi(
            baseURL + variables.getProductListByParams.url,
            {
                productCode: productCode,
                shadeCode: shadeCode,
                fromDate: fromDate,
                toDate: toDate,
            },
            variables.getProductListByParams.method,
            token,
            dispatch
        )
            .then((data) => {
                console.log('data: ', data);
                setAllProduct(data.data);
            })
            .catch((error) => console.log(error));
    };

    const ShowAllOptions = () => {
		if (allProduct && allProduct.length > 0) {
			let abcd = allProduct?.map((option) => {
				return { label: option.categoryName, value: option.categoryName, id: option.categoryId }
			})
			setAllProductOptions(abcd)
		}
	}
	const updateProduct = (value, obj) => {
        console.log('value: ', value, obj);
		if (value) {
			setProductLabel(value)

			setShadesByCode(obj)
		}
        //else setProductLabel("")
		// let newArray = [...rows]


		// newArray[index] = {
		// 	...rows[index],
		// 	OrderQty: 0,
		// 	LottypeCode: { label: "", HsCode: "", value: "" },
		// 	ShadeCode: { label: "", HsCode: "", value: "" },
		// 	selectedYardage: { label: "", HsCode: "", value: "" },
		// 	shade: [],
		// 	product: obj,
		// 	// productCategoryList: [],
		// 	uom: "",
		// }
		// setTimeout(() => { setAllProduct(allOptions)}, 300)
		// dispatch(updateCart(newArray))
	}
    const searchProduct = () =>{
        let filteredProduct = allProduct.filter((option) => {
            return option.categoryName.toLowerCase().includes(productLabel.toLowerCase())
        })

        filteredProduct = filteredProduct.map((option) => {
            return { label: option.categoryName, value: option.categoryName, id: option.categoryId }
        })
        setAllProductOptions(filteredProduct)
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
                    <Grid container spacing={2} className="addItemRowSection">
                        <Grid item md={3} sm={3} >
                            {/* <ProductBox
                                    token={token}
                                    baseURL={baseURL}
                                    options={allProduct}
                                    index={0}
                                    rows={rows}
                                    setRows={setRows}
                                    label="Select Product"
                                    setShadesByCode={setShadesByCode}
                                /> */}
                            <AutoComplete
                                options={allProductOptions}
                                placeholder="Select Product"
                                allowClear={true}
                                value={productLabel}
                                onSelect={(e, v) => updateProduct(e, v)}
                                onSearch={(v) => setProductLabel(v)}
                                onClear={() => updateProduct()}
                                onFocus={ShowAllOptions}
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
                                        onInput={searchProduct}
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
                        <Grid item md={3} sm={3} >
                            <ShadeCodeBox
                                debouncedApiCall={null}
                                label="Shades"
                                options={allShades}
                                rows={rows}
                                setRows={setRows}
                                index={1}
                                getProductDescriptionbyCode={getProductDescriptionbyCode}
                            />
                        </Grid>
                        <Grid item md={3} sm={3} >
                            {/* <ShadeCodeBox
                                    debouncedApiCall={null}
                                    label="Shades"
                                    options={allShades}
                                    rows={rows}
                                    setRows={setRows}
                                    index={1}
                                    getProductDescriptionbyCode={getProductDescriptionbyCode}
                                /> */}
                            <input style={{ width: '90%', height: '40px', border: '1px solid #d9d9d9', borderRadius: '6px' }} value={fromDate} onInput={(e) => setFromDate(e.target.value)} type='date' placeholder='From Date' />
                        </Grid>
                        <Grid item md={3} sm={3} >
                            {/* <ShadeCodeBox
                                    debouncedApiCall={null}
                                    label="Shades"
                                    options={allShades}
                                    rows={rows}
                                    setRows={setRows}
                                    index={1}
                                    getProductDescriptionbyCode={getProductDescriptionbyCode}
                                /> */}
                            <input style={{ width: '90%', height: '40px', border: '1px solid #d9d9d9', borderRadius: '6px' }} value={toDate} onInput={(e) => setToDate(e.target.value)} type='date' placeholder='To Date' />
                        </Grid>

                    </Grid>
                    {/* </div> */}
                </div>
            </Grid>
        </Grid>
    );
};

export default OrderList;
