import React from 'react'
import './input.css'

const Input = ({ type, placeholder, className, value, setValue, border, maxlength, onKeyPress }) => {
    return (
        <input onKeyPress={onKeyPress} autoComplete='new-password' type={type} maxLength={maxlength} style={border ? { "border": "1.5px solid grey" } : {}} value={value} placeholder={placeholder} onChange={(e) => setValue(e.target.value)} className={className ? 'inputComponent width100' : 'inputComponent'} />
    )
}

export default Input