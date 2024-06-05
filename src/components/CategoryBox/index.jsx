import React from "react"
import "../Input/input.css"
import { FormControl, InputLabel, MenuItem, Select, useMediaQuery } from "@mui/material"
import { updateCart } from "../../pages/redux/features/cart/cartslice"
import { useDispatch, useSelector } from "react-redux"

import { AutoComplete, Input } from "antd"

const CategoryBox = ({ debouncedApiCall, label, index, rows, setRows, options = [], baseURL, token }) => {
	const dispatch = useDispatch()
	const [infoLabel, setInfoLabel] = React.useState("")
	const isMobile = useMediaQuery("(max-width: 600px)")
	const [open, setOpen] = React.useState(false)
	const [ddOption, setDdOption] = React.useState([{ label: "loading...", value: "loading..." }])

	const optionsList = useSelector((state) => state.cart[index]?.productCategoryList)

	const GetUpdatedLabel = () => {
		const initialLabel = useSelector((state) => state.cart[index]?.LottypeCode?.label)
		return initialLabel
	}
	const initialLabel = GetUpdatedLabel()

	const OptionState = () => {
		let list = optionsList?.map((option, i) => {
			return {
				label: option.productDesc,
				value: option.productCode,
				HsCode: option.hsCode,
				yardage: option.yardage,
				boxQty: option.boxQty,
				uom: option.uom,
				productCode: option.productCode,
				key: `${index}-${i}`,
			}
		})
		return list
	}

	React.useEffect(() => {
		setInfoLabel(initialLabel)
	}, [initialLabel])

	React.useEffect(() => {
		let list = optionsList?.map((option, i) => {
			return {
				label: option.productDesc,
				value: option.productCode,
				HsCode: option.hsCode,
				yardage: option.yardage,
				boxQty: option.boxQty,
				uom: option.uom,
				productCode: option.productCode,
				key: `${index}-${i}`,
			}
		})

		setDdOption(list)
	}, [optionsList])

	React.useEffect(() => {

		let abcd = optionsList.filter((option) => {
			if (infoLabel) {
				if (option.productDesc.includes(infoLabel)) {
					return option
				}
			} else return option
		})

		abcd = abcd.map((option, ind) => {
			return {
				label: option.productDesc,
				value: option.productCode,
				HsCode: option.hsCode,
				yardage: option.yardage,
				boxQty: option.boxQty,
				uom: option.uom,
				productCode: option.productCode,
				key: `${index}-${ind}`,
			}
		})
		setDdOption(abcd)

	}, [infoLabel])

	// React.useEffect(() => {
	// 	// console.log("initial label working", rows[index])
	// 	if (!infoLabel) {
	// 		updateProduct()
	// 		let abcd = options.map((option) => {
	// 			return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty, uom: option.uom, productCode: option.productCode }
	// 		})

	// 		setDdOption(abcd)
	// 	} else {
	// 		// let abcd = [...options]
	// 		let abcd = options.filter((option) => {
	// 			if (option.productDesc?.toLowerCase().includes(infoLabel?.toLowerCase())) {
	// 				return option
	// 			}
	// 		})
	// 		abcd = abcd.map((option) => {
	// 			return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty, uom: option.uom, productCode: option.productCode }
	// 		})
	// 		// if(infoLabel.includes('')){
	// 		// 	setInfoLabel(rows[index]?.LottypeCode?.label)
	// 		// }
	// 		setDdOption(abcd)
	// 	}

	// 	if(ddOption.length > 0){

	// 		let newArray = [...rows]
	// 			newArray[index] = {
	// 				...rows[index],
	// 				LottypeCode:  ddOption[0],
	// 				selectedYardage: { label: ddOption[0].yardage, value: ddOption[0].yardage, HsCode: ddOption[0].yardage },
	// 				OrderQty: ddOption[0].boxQty,
	// 				uom:  ddOption[0].uom ,
	// 				productCode: ddOption[0]?.productCode
	// 			}
	// 			setInfoLabel(ddOption[0].label)
	// 			dispatch(updateCart(newArray))
	// 	}

	// 	setOpen(true)
	// }, [infoLabel])

	// React.useEffect(() => {
	// 	if (infoLabel == '') {
	// 		let abcd = options.map((option) => {
	// 			return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty, uom: option.uom, productCode: option.productCode }
	// 		})

	// 		setDdOption(abcd)
	// 	} else {
	// 		if (rows[index]['ShadeCode']['label']) {
	// 			let abcd = options.filter((option) => {
	// 				if (option.productDesc?.toLowerCase().includes(infoLabel?.toLowerCase())) {
	// 					return option
	// 				}
	// 			})
	// 			abcd = abcd.map((option) => {
	// 				return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty, uom: option.uom, productCode: option.productCode }
	// 			})

	// 			setDdOption(abcd)

	// 		} else {
	// 			setInfoLabel("")
	// 		}
	// 	}

	// 	if(options.length === 1){
	// 		setInfoLabel(options[0].label)
	// 	}

	// 	setOpen(true)
	// }, [options])

	// React.useEffect(()=> {
	// 	console.log("NEW CATEGORY BOX", [rows[index]['LottypeCode']['label']])
	// }, [rows[index]['LottypeCode']['label']])

	const updateProduct = (value, e) => {
		let newArray = [...rows]
		if (value) {
			newArray[index] = {
				...rows[index],
				LottypeCode: value ? e : { label: "", HsCode: "", value: "" },
				selectedYardage: { label: e.yardage, value: e.yardage, HsCode: e.yardage },
				OrderQty: e.boxQty,
				uom: value ? e.uom : "",
				productCode: e?.productCode,
			}
			setInfoLabel(e.label)

			dispatch(updateCart(newArray))
		} else {
			setInfoLabel("")
			newArray[index] = {
				...rows[index],
				OrderQty: 0,
				LottypeCode: { label: "", HsCode: "", value: "" },
				selectedYardage: { label: "", value: "", HsCode: "" },
				uom: "",
				productCode: "",
			}

			dispatch(updateCart(newArray))
		}

		// validateShadeCode(value, index)
	}

	return (
		<>
			<AutoComplete
				options={ddOption}
				placeholder="Select Product"
				allowClear={true}
				value={infoLabel}
				onSelect={(e, v) => updateProduct(e, v)}
				onSearch={(v) => setInfoLabel(v)}
				onClear={() => updateProduct()}
				style={{
					width: "90%",
					height: "40px",
					boxShadow: "0 3px 13px 0 rgba(0, 0, 0, 0.08);",
					background: isMobile ? "white" : "transparent",
					borderRadius: { xs: "8px" },
				}}
			/>
		</>
	)
}

export default CategoryBox
