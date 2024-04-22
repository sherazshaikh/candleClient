import React, { useEffect, useState } from 'react';
import './Quantity.css'
import { useDispatch } from 'react-redux';
import { updateCart } from '../../pages/redux/features/cart/cartslice';

const Quantity = ({ rows, setRows, index, debouncedApiCall }) => {
  const [value, setValue] = useState(rows[index]['OrderQty']);
  const dispatch = useDispatch();
  const increment = () => {
    setValue((prevValue) => parseInt(prevValue) + 1);
  };

  const decrement = () => {
    setValue((prevValue) => (prevValue > 1 ? prevValue - 1 : 1));
  };

  const handleInputChange = (e) => {
    // Use a regular expression to allow only numeric values
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setValue(numericValue);
  };

  useEffect(() => {
    let newArray = [...rows];
    newArray[index] = { ...rows[index], OrderQty: value };
    dispatch(updateCart(newArray));
    debouncedApiCall()
  }, [value])

  useEffect(() => {
    setValue(rows[index]['OrderQty'])
  }, [rows])
  

  return (
    <div style={{width:"100%"}} className='flex' >
      <div className="quantity-input">
        <button className="quantity-input__modifier quantity-input__modifier--left" onClick={decrement}>
          &mdash;
        </button>
        <input  className="quantity-input__screen" type="number" value={value} pattern="[0-9]+" onChange={(e) => handleInputChange(e)} />
        <button className="quantity-input__modifier quantity-input__modifier--right" onClick={increment}>
          &#xff0b;
        </button>
      </div>
    </div>
  );
};

export default Quantity;
