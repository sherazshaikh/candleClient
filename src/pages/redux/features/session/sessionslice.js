import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    sessionExpired: false,
    resetPassword: false,
    forgetPassword: false
};

export const sessionSlice = createSlice({
    name: 'sessionExpired',
    initialState,
    reducers: {
        setSessionTrue: (state) => {
            state.sessionExpired = true;
        },
        setSessionFlase: (state) => {
            state.sessionExpired = false;
        },
        setResetPasswordTrue: (state) => {
            state.resetPassword = true
        },
        setResetPasswordFalse: (state) => {
            state.resetPassword = false
        },
        setForgetPasswordFalse: (state) => {
            state.forgetPassword = false
        },
        setForgetPasswordTrue: (state) => {
            state.forgetPassword = true
        }
    },
})

// Action creators are generated for each case reducer function
export const { setSessionTrue, setSessionFlase, setResetPasswordTrue, setResetPasswordFalse, setForgetPasswordTrue, setForgetPasswordFalse } = sessionSlice.actions

export default sessionSlice.reducer