import { Grid } from "@mui/material"
import { AutoComplete, Input } from "antd"
// import Input from "../Input/Input"
import { useState } from "react"



const CustomSelect = ({data, label, emit}) => {
    const [value, setValue] = useState('')
    const [options, setOptions] = useState([ ])


    const updateProduct = (val, obj)=>{
        setValue(val)
        emit(val)
    }
    const searchProduct = ()=>{
        console.log('a')
    }
    const showAllOptions = ()=>{
            if (data && data.length > 0) {
                let abcd = data?.map((receiverName) => {
                    return { label: receiverName, value: receiverName }
                })
                setOptions(abcd)
            }

          
            // setOptions([
            //     { label: "ABC", value: "ABC"},
            //     { label: "AFD", value: "AFD"},
            //     { label: "DFG", value: "DFG" },
            // ])
        
    }

    return (
        <>
            <AutoComplete
                key={1}
                options={options}
                placeholder={label} 
                allowClear={true}
                value={value}
                onSelect={(e, v) => updateProduct(e, v, true)}
                onSearch={(v) => setValue(v)}
                onClear={() => updateProduct(null, null, true)}
                onFocus={() => showAllOptions(true)}
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
    </>
    )
}


export default CustomSelect