import React, { useEffect, useState } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useDispatch } from 'react-redux';
import { updateCart } from '../../pages/redux/features/cart/cartslice';

const QuantityCheckout = ({ debouncedApiCall, item, rows, index }) => {
    const [value, setValue] = useState(item.OrderQty);
    const dispatch = useDispatch();

    const increment = () => {
        setValue((prevValue) => parseInt(prevValue) + 1);
    };

    const decrement = () => {
        setValue((prevValue) => (prevValue > 1 ? prevValue - 1 : 1));
    };

    useEffect(() => {
        let newArray = [...rows];
        console.log("yahan se chala hai");
        newArray[index] = { ...rows[index], OrderQty: value };
        dispatch(updateCart(newArray));
        debouncedApiCall()
    }, [value])

    return (
        <div style={{ display: "flex", justifyContent: "space-evenly" }} >  <span style={{ cursor: "pointer" }} onClick={() => decrement()} > <RemoveCircleIcon /></span> {value} <span style={{ cursor: "pointer" }} onClick={() => increment()} > <AddCircleIcon /></span>  </div>
    )
}

export default QuantityCheckout