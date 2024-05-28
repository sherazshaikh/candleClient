import * as React from 'react'
import TextField from '@mui/material/TextField'
import { executeApi } from '../../utils/WithAuth'
import { variables } from '../../utils/config'
import { useDispatch, useSelector } from 'react-redux'
import { updateCart } from '../../pages/redux/features/cart/cartslice'
import { FormControl, InputLabel, MenuItem, Select, useMediaQuery } from '@mui/material'
import '../Input/input.css'
import { AutoComplete, Input } from 'antd'

export default function ComboBox({ debouncedApiCall, label, index, rows, setRows, options = [], baseURL, token }) {
	const dispatch = useDispatch()
	const [infoLabel, setInfoLabel] = React.useState(rows[index]['LottypeCode']['label'])
	const isMobile = useMediaQuery('(max-width: 600px)')
	const [open, setOpen] = React.useState(false)
	const [ddOption, setDdOption] = React.useState([{ label: 'loading...', value: 'loading...' }])

	React.useEffect(() => {
		if (!infoLabel) {
			updateProduct()
			let abcd = options.map((option) => {
				return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty, uom: option.uom, productCode: option.productCode }
			})
			setDdOption(abcd)
		} else {
			// let abcd = [...options]
			let abcd = options.filter((option) => {
				if (option.productDesc?.toLowerCase().includes(infoLabel?.toLowerCase())) {
					return option
				}
			})
			abcd = abcd.map((option) => {
				return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty, uom: option.uom, productCode: option.productCode }
			})
			setDdOption(abcd)
		}
		setOpen(true)
	}, [infoLabel])

	React.useEffect(() => {
		if (infoLabel == '') {
			let abcd = options.map((option) => {
				return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty, uom: option.uom, productCode: option.productCode }
			})
			setDdOption(abcd)
		} else {
			if (rows[index]['ShadeCode']['label']) {
				let abcd = options.filter((option) => {
					if (option.productDesc?.toLowerCase().includes(infoLabel?.toLowerCase())) {
						return option
					}
				})
				abcd = abcd.map((option) => {
					return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty, uom: option.uom, productCode: option.productCode }
				})

				setDdOption(abcd)

			} else {
				setInfoLabel("")
			}
		}
		setOpen(true)
	}, [options])

	// React.useEffect(() => {
	// 	let abcd = options.map((option) => {
	// 		return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty, uom: option.uom, productCode: option.productCode }
	// 	})
	// 	setDdOption(abcd)
	// }, [options])

	const updateProduct = (value, e) => {
		let newArray = [...rows]
		if (value) {
			newArray[index] = {
				...rows[index],
				LottypeCode: value ? e : { label: '', HsCode: '', value: '' },
				selectedYardage: { label: e.yardage, value: e.yardage, HsCode: e.yardage },
				OrderQty: e.boxQty,
				uom: value ? e.uom : "",
				productCode: e?.productCode
			}
			setInfoLabel(e.label)

			dispatch(updateCart(newArray))

		} else {
			setInfoLabel('')
			console.log("hello 2")
			newArray[index] = {
				...rows[index],
				OrderQty: 0,
				LottypeCode: { label: '', HsCode: '', value: '' },
				selectedYardage: { label: "", value: "", HsCode: "" },
				uom: "",
				productCode: ""

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
				style={{ width: '90%', height: '40px', boxShadow: '0 3px 13px 0 rgba(0, 0, 0, 0.08);', background: isMobile ? 'white' : 'transparent', borderRadius: { xs: '8px' } }}
			/>
		</>
	)
}

export function ShadeBox({ debouncedApiCall, label, index, rows, setRows, options = [], baseURL, token, getProductDescriptionbyCode }) {
	// let {
	//   cart,

	// } = useSelector((state) => state)

	let { cart } = useSelector((state) => state)

	const dispatch = useDispatch()
	const [infoLabel, setInfoLabel] = React.useState('')
	const isMobile = useMediaQuery('(max-width: 600px)')
	const [ddOption, setDdOption] = React.useState(options)

	React.useEffect(() => {
		if (!infoLabel) {
			let newArray = [...rows]
			dispatch(updateCart(newArray))
			let abcd = options.map((option, ind) => {
				return { label: option.shadeCode, value: option.shadeDesc, key: ind }
			})
			setDdOption(abcd)
		} else {

			let abcd = options.filter((option) => {
				if (option.shadeCode?.includes(infoLabel.toString())) {
					return option
				}
			})
			if (abcd.length === 0) {
				abcd = []
			} else {
				abcd = abcd.map((option, ind) => {
					return { label: option.shadeCode, value: option.shadeDesc, key: ind }
				})
			}
			setDdOption(abcd)

			// setTimeout(()=> abcd?.length === 0 && setInfoLabel(""), 1100)
		}
	}, [infoLabel])

	React.useEffect(() => {
		if (!infoLabel) {
			if (rows[index]['ShadeCode']['label']) {
				setInfoLabel(rows[index]['ShadeCode']['label'])
			}
			let abcd = options.map((option, ind) => {
				return { label: option.shadeCode, value: option.shadeDesc, key: ind }
			})
			setDdOption(abcd)
		} else {
			if (rows[index]['product'] && rows[index]['product']['label']) {
				let abcd = options.filter((option) => {
					if (option.shadeCode.includes(infoLabel.toString())) {
						return option
					} else return option
				})
				abcd = abcd.map((option, ind) => {
					return { label: option.shadeCode, value: option.shadeDesc, key: ind }
				})

				setDdOption(abcd)
			} else setInfoLabel("")
		}
	}, [options])
	// React.useEffect(() => {
	// 	setInfoLabel("")
	// }, [rows[index]['']['label']])
	//



	const updateProduct = (value, e) => {

		let newArray = [...rows]
		if (value) {
			setInfoLabel(e ? e.label : '')
			newArray[index] = { ...rows[index], ShadeCode: e, LottypeCode: { label: '', HsCode: '', value: '' } }
			dispatch(updateCart(newArray))
			getProductDescriptionbyCode(e, index, newArray)
		} else {

			newArray[index] = {
				...rows[index],
				OrderQty: 0,
				LottypeCode: { label: '', HsCode: '', value: '' },
				selectedYardage: { label: "", value: "", HsCode: "" },
				ShadeCode: { label: '', HsCode: '', value: '' },
				productCategoryList: [],
				uom: "",
				productCode: ""

			}
			dispatch(updateCart(newArray))
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
				style={{ width: '90%', height: '40px', boxShadow: '0 3px 13px 0 rgba(0, 0, 0, 0.08);', background: isMobile ? 'white' : 'transparent', borderRadius: { xs: '8px' } }}
				children={
					<Input
						type="number"
						style={{ height: '40px', boxShadow: '0 3px 13px 0 rgba(0, 0, 0, 0.08);', background: isMobile ? 'white' : 'transparent', borderRadius: { xs: '8px' } }}
					/>
				}
			/>
		</>
	)
}

export function YardageBox({ debouncedApiCall, label, index, rows, setRows, options = [], baseURL, token }) {
	const dispatch = useDispatch()
	const [infoLabel, setInfoLabel] = React.useState('')
	const isMobile = useMediaQuery('(max-width: 600px)')
	const [ddOption, setDdOption] = React.useState([])

	React.useEffect(() => {
		if (!infoLabel) {
			let abcd = options.map((option) => {
				return { label: option, value: option }
			})
			setDdOption(abcd)
		} else {
			let abcd = options.filter((option) => {
				if (option.includes(infoLabel)) {
					return option
				}
			})
			abcd = abcd.map((option) => {
				return { label: option, value: option }
			})
			setDdOption(abcd)
		}
	}, [infoLabel])

	const updateProduct = (value, e) => {
		let newArray = [...rows]
		newArray[index] = { ...rows[index], selectedYardage: value ? e : { label: '', HsCode: '', value: '' } }
		dispatch(updateCart(newArray))
	}

	return (
		<>
			<AutoComplete
				options={ddOption}
				placeholder="Select Yardage"
				allowClear={true}
				disabled={true}
				value={rows[index]['selectedYardage']['label']}
				// onSelect={(e, v) => updateProduct(e, v)}
				// onSearch={(v) => setInfoLabel(v)}
				style={{ width: '90%', height: '40px', boxShadow: '0 3px 13px 0 rgba(0, 0, 0, 0.08);', background: isMobile ? 'white' : 'transparent', borderRadius: { xs: '8px' } }}
			/>
		</>
	)
}
