export const variables = {
    signin: {
        "url": "/v1/Auth/AuthenticateUser",
        "method": "POST"
    },
    signup: {
        "url": "/v1/Auth/SignUp",
        "method": "POST"
    },
    product: {
        "url": "/v1/Order/GetAllProducts",
        "method": "GET"
    },
    shades: {
        "url": "/v1/Order/GetShades",
        "method": "GET"
    },
    yardage: {
        "url": "/v1/Order/GetYardage",
        "method": "GET"
    },
    saveOrder: {
        "url": "/v1/Order/SaveOrder",
        "method": "POST"
    },
    PrevOrders: {
        "url": "/v1/Order/GetAllOrders",
        "method": "GET"
    },
    Shopes: {
        "url": "/v1/Order/GetShops",
        "method": "GET"
    },
    SpecificOrder: {
        "url": "/v1/Order/GetOrderById?orderId={{orderId}}",
        "method": "GET"
    },
    UploadPOAttachment: {
        "url": "/v1/Order/UploadPOAttachment",
        "method": "POST"
    },
    GetAllUsers: {
        "url": "/v1/UserSettings/GetAllUsers",
        "method": "GET"
    },
    ResetPassword: {
        "url": "/v1/UserSettings/ResetPassword",
        "method": "POST"
    },
    ForgetPassword: {
        "url": "/v1/UserSettings/ForgetPassword",
        "method": "POST"
    },
    DownloadFile: {
        "url": "/v1/Order/downloadFile",
        "method": "GET"
    },
    getCart: {
        url: "/v1/Cart/GetCartProducts",
        method: "GET"
    },
    updateCart: {
        url: "/v1/Cart/UpdateCartProducts",
        method: "POST"
    },
    getAllProduct: {
        url: "/v1/Order/getAllProductCategory",
        method: "GET"
    },
    getProductListByParams: {
        url: "/v1/Order/getOrderListByParams",
        method: "GET"
    },
    getReceiverNames: {
        url: "/v1/Order/getReceiverByUserId",
        method: "GET"
    },
    allShades: {
        "url": "/v1/Order/GetAllShades",
        "method": "GET"
    },
    //
}