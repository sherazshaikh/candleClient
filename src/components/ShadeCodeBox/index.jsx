import React, { useEffect } from "react"
import "../Input/input.css"
import { FormControl, InputLabel, MenuItem, Select, useMediaQuery } from "@mui/material"
import { updateCart } from "../../pages/redux/features/cart/cartslice"
import { useDispatch, useSelector } from "react-redux"
import { AutoComplete, Input } from "antd"

function ShadeBox({ debouncedApiCall, label, index, rows, setRows, options = [], baseURL, token, getProductDescriptionbyCode }) {
    const optionsList = useSelector((state) => state.cart[index]?.shade)
    const initialLabel = useSelector((state) => state.cart[index]?.ShadeCode)
    const dispatch = useDispatch()
    const [infoLabel, setInfoLabel] = React.useState(initialLabel)
    const isMobile = useMediaQuery("(max-width: 600px)")
    const [ddOption, setDdOption] = React.useState([])

	const GetCategoryLabl = () => {
		const initialLabel = useSelector((state) => state.cart[index]?.product?.label)
		return initialLabel
	}

	const allOptionsList = optionsList?.map((option, ind) => {
		return { label: option.shadeCode, value: option.shadeCode, key: ind }
	})

	const GetInfoLabl = () => {
		const initialLabel = useSelector((state) => state.cart[index]?.ShadeCode?.label)
		return initialLabel
	}

	const shadeLabel = GetInfoLabl()

	const categoryLabel = GetCategoryLabl()

	React.useEffect(() => {
		setInfoLabel("")
	}, [categoryLabel])

    useEffect(() => {
        setInfoLabel(initialLabel?.label)
    }, [initialLabel])

    useEffect(() => {

        let abcd = optionsList?.filter((option) => {
            if (infoLabel) {
                if (option.shadeCode?.includes(infoLabel)) {
                    return option
                }
            } else return option
        })

        abcd = abcd?.map((option, ind) => {
            return { label: option.shadeCode, value: option.shadeCode, key: ind }
        })
        setDdOption(abcd)

    }, [infoLabel])

    useEffect(() => {
        const list = optionsList?.map((opt, i) => {
            return { label: opt.shadeCode, value: opt.shadeCode, key: `${index}-${i}` }
        })
        setDdOption(list)
    }, [optionsList])

    const updateProduct = (value, e) => {
        console.log('value: ', value);
        let newArray = [...rows]
        if (value) {
            setInfoLabel(e ? e.label : '')
            newArray[index] = { ...rows[index], ShadeCode: e, LottypeCode: { label: "", HsCode: "", value: "" } }
            dispatch(updateCart(newArray))
            getProductDescriptionbyCode(e, index, newArray)
        } else {
            newArray[index] = {
                ...newArray[index],
                OrderQty: 0,
                LottypeCode: { label: "", HsCode: "", value: "" },
                selectedYardage: { label: "", value: "", HsCode: "" },
                ShadeCode: { label: "", HsCode: "", value: "" },
                productCategoryList: [],
                uom: "",
                productCode: "",
            }
            dispatch(updateCart(newArray))
        }
		setTimeout(() => { setDdOption(allOptionsList)}, 300)
        console.log("record 1", newArray)
    }

	const ShowAllOptions = () => {
		if (options && options.length > 0) {
			let abcd = options?.map((option, i) => {
				// categoryId
				return { label: option.shadeCode, value: option.shadeCode, key: `${index}-${i}` }
			})
			setDdOption(abcd)
		}
	}

    return (
        <>
            <AutoComplete
                options={ddOption}
                placeholder="Select Shade"
                allowClear={true}
                value={infoLabel}
                onSelect={(e, v) => updateProduct(e, v)}
                onSearch={(v) => setInfoLabel(v)}
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
                        style={{
                            height: "40px",
                            boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08);",
                            background: isMobile ? "white" : "transparent",
                            borderRadius: { xs: "8px" },
                        }}
                    />
                }
            />
        </>
    )
}

export default ShadeBox
