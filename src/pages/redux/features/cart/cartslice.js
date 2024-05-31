import { createSlice } from '@reduxjs/toolkit'
import { v4 } from 'uuid';


const initialState = [{
    "LottypeCode": { label: "", value: "", HsCode: "" },
    "shade": [],
    "ShadeCode": { label: "", value: "", HsCode: "" },
    "yardage": [],
    "selectedYardage": { label: "", value: "", HsCode: "" },
    "OrderQty": 12,
    "price": "0",
    "uuid": v4()
}];


let count = 0
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        updateCart: (state, action) => {
            count += 1
            return action.payload;
        },
        emptyCart: (state) => {
            return initialState
        }
    },
})

// Action creators are generated for each case reducer function
export const { updateCart, emptyCart } = cartSlice.actions

export default cartSlice.reducer