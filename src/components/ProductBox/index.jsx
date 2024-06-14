import { useMediaQuery } from "@mui/material"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AutoComplete, Input } from "antd"
import { updateCart } from "../../pages/redux/features/cart/cartslice"
import { useFetcher } from "react-router-dom"

function ProductBox({ options, rows, index, setShadesByCode, updateComp }) {
	let { cart } = useSelector((state) => state)
	const initialLabel = useSelector((state) => state.cart[index]?.product?.label)
	// const optionsList = useSelector((state) => state.cart[index].productCategoryList)

	const dispatch = useDispatch()
	const [infoLabel, setInfoLabel] = React.useState(initialLabel)
	const isMobile = useMediaQuery("(max-width: 600px)")
	const [ddOption, setDdOption] = React.useState([])

		const allOptions = options?.map((option, i) => {
			return { label: option.categoryName, value: option.categoryName, id: option.categoryId, key: `${index}-${i}` }
		})
	

	useEffect(() => {
		if (!infoLabel) {
			// updateProduct()
			let abcd = options.map((option, i) => {
				return { label: option.categoryName, value: option.categoryName, id: option.categoryId, key: `${index}-${i}` }
			})
			let newArray = [...rows]
			newArray[index] = {
				...newArray[index],
				LottypeCode: {},
				ShadeCode: {},
			}

			dispatch(updateCart(newArray))

			setDdOption(abcd)
		} else {
			// let abcd = [...options]
			let abcd = options?.filter((option) => {
				if (option.categoryName?.toLowerCase().includes(infoLabel?.toLowerCase())) {
					return option
				}
			})
			abcd = abcd.map((option) => {
				return { label: option.categoryName, value: option.categoryName, id: option.categoryId }
			})
			setDdOption(abcd)
		}
	}, [infoLabel])

	// useEffect(() => {

	// 	if (rows[index]["product"] && rows[index]["product"]["label"]) {
	// 		setInfoLabel(rows[index]["product"]["label"])
	// 	}
	// }, [rows[index]["product"]])

	useEffect(() => {
		if (options && options.length > 0) {
			let abcd = options?.map((option) => {
				// categoryId
				return { label: option.categoryName, value: option.categoryName, id: option.categoryId }
			})
			setDdOption(abcd)
		}
	}, [options])

	const updateProduct = (value, obj) => {
		if (value) {
			setInfoLabel(value)

			setShadesByCode(obj, index, rows)
		}
		let newArray = [...rows]

		if(updateComp){
			
			console.log("compoent Updated",newArray  )
		}

		newArray[index] = {
			...rows[index],
			OrderQty: 0,
			LottypeCode: { label: "", HsCode: "", value: "" },
			ShadeCode: { label: "", HsCode: "", value: "" },
			selectedYardage: { label: "", HsCode: "", value: "" },
			shade: [],
			product: obj,
			// productCategoryList: [],
			uom: "",
		}
		setTimeout(() => { setDdOption(allOptions)}, 300)
		dispatch(updateCart(newArray))
	}

	const ShowAllOptions = () => {
		if (options && options.length > 0) {
			let abcd = options?.map((option) => {
				return { label: option.categoryName, value: option.categoryName, id: option.categoryId }
			})
			setDdOption(abcd)
		}
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

export default ProductBox
