import { createSlice } from '@reduxjs/toolkit'


let response = await fetch('/config.json');
let configData = await response.json();

const initialState = await configData.BaseURL;

export const utilSlice = createSlice({
    name: 'baseURL',
    initialState,
    reducers: {
        initiate: (state) => {
            state.baseURL = null;
        }
    },
})

// Action creators are generated for each case reducer function
export const { initiate } = utilSlice.actions

export default utilSlice.reducer