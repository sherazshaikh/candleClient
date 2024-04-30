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
				return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty, uom:option.uom, productCode: option.productCode }
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
				return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty, uom:option.uom, productCode: option.productCode  }
			})
			setDdOption(abcd)
		}
		setOpen(true)
	}, [infoLabel])

	React.useEffect(() => {
		if (infoLabel == '') {
			let abcd = options.map((option) => {
				return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty, uom:option.uom, productCode: option.productCode  }
			})
			setDdOption(abcd)
		} else {
			// let abcd = []
			let abcd = options.filter((option) => {
				if (option.productDesc?.toLowerCase().includes(infoLabel?.toLowerCase())) {
					return option
				}
			})
			abcd = abcd.map((option) => {
				return { label: option.productDesc, value: option.productCode, HsCode: option.hsCode, yardage: option.yardage, boxQty: option.boxQty, uom:option.uom, productCode: option.productCode  }
			})

			setDdOption(abcd)
		}
		setOpen(true)
	}, [options])

	const updateProduct = (value, e) => {
		console.log('3', options, rows, e)
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
			executeApi(baseURL + variables.shades.url + `?productCode=${e.value}`, {}, variables.shades.method, token, dispatch)
				.then((data) => {
					newArray[index] = { ...newArray[index], shade: data.data ? data.data : [] }
				})
				.then(() => {
					// executeApi(baseURL + variables.yardage.url + `?productCode=${e.value}`, {}, variables.yardage.method, token, dispatch)
					//   .then(data => {
					//     newArray[index] = { ...newArray[index], yardage: data.data ? data.data : [], selectedYardage: { label: data.data[0], value: data.data[0], HsCode: data.data[0] } }
					dispatch(updateCart(newArray))
					//   })
					//   .catch(error => console.log(error))
				})
				.catch((error) => console.log(error))
		} else {
			setInfoLabel('')
			// rows[index].OrderQty = 0
			newArray[index] = {
				...rows[index],
				OrderQty: 0,
				LottypeCode: { label: '', HsCode: '', value: '' },
				ShadeCode: { label: '', HsCode: '', value: '' },
				selectedYardage: { label: '', HsCode: '', value: '' },
				shade: [],
				uom: "",
			
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

export function ShadeBox({ debouncedApiCall, label, index, rows, setRows, options = [], baseURL, token }) {
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
			newArray[index] = { ...rows[index], ShadeCode: { label: '', HsCode: '', value: '' } }
			dispatch(updateCart(newArray))
			let abcd = options.map((option, ind) => {
				return { label: option.shadeCode, value: option.shadeDesc, key: ind }
			})
			setDdOption(abcd)
		} else {
			console.log('2', options, rows, infoLabel, cart)
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
			console.log('3', options, rows, infoLabel, cart)
			if (rows[index]['ShadeCode']['label']) {
				setInfoLabel(rows[index]['ShadeCode']['label'])
			}
			let abcd = options.map((option, ind) => {
				return { label: option.shadeCode, value: option.shadeDesc, key: ind }
			})
			setDdOption(abcd)
		} else {
			// let abcd = []
			let abcd = options.filter((option) => {
				if (option.shadeCode.includes(infoLabel.toString())) {
					return option
				} else return option
			})
			abcd = abcd.map((option, ind) => {
				return { label: option.shadeCode, value: option.shadeDesc, key: ind }
			})

			setDdOption(abcd)
			console.log('4', options, rows, infoLabel, cart)
		}
	}, [options])

	const updateProduct = (value, e) => {
		console.log('5', options, rows)
		let newArray = [...rows]

		setInfoLabel(e ? e.label : '')
		// const validShadeCode = rows[index].shade.some(shade => shade.shadeCode === infoLabel)
		// console.log("validShadeCode", validShadeCode, rows)
		// if(validShadeCode){
		newArray[index] = { ...rows[index], ShadeCode: value ? e : { label: '', HsCode: '', value: '' } }
		// }else {
		//   newArray[index] = { ...rows[index], ShadeCode: { label: "", HsCode: "", value: "" } }
		// }

		dispatch(updateCart(newArray))
		console.log('6', options, rows, newArray)
	}

	React.useEffect(() => {
		if (!rows[index]['LottypeCode']['label']) {
			setInfoLabel('')
		}
	}, [rows[index]['LottypeCode']['label']])

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
