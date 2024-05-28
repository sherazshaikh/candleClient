import Home from "./pages/Home/Home";
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import RecentOrder from "./pages/RecentOrder/RecentOrder";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import Checkout from "./pages/Checkout/Checkout";
import QuickOrder from "./pages/QuickOrder/QuickOrder";
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import { ProtectedAuthRoute, ProtectedRoute } from "./utils/WithAuth";
import { useSelector } from "react-redux";
import OrderPlaceCard from "./components/Card/OrderPlaceCard";
import AlertDialogSlide from "./components/AlertDialogue/AlertDialogue";
import ResponsiveDialog from "./components/PassDialogue/PassDialogue";
import ForgetDialogee from "./components/ForgetDialogue/ForgetDialogee";



function App() {
  let user = useSelector(state => state.auth.token)
  let theme = createTheme({
    typography: {
      fontFamily: [
        'Axiforma',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });
  theme = responsiveFontSizes(theme);



  const router = createBrowserRouter([
    {
      path: "/",
      element:
        <Home />
    },
    {
      path: "/signin",
      element: <ProtectedAuthRoute user={user} >
        <SignIn />
      </ProtectedAuthRoute>
    },
    {
      path: "/signUp",
      element:
        <SignUp />
    },
    {
      path: "/recentOrders",
      element:
        <ProtectedRoute user={user}>
          <RecentOrder />
        </ProtectedRoute>
    },
    {
      path: "/orderDetails/:orderId",
      element: <ProtectedRoute user={user}>
        <OrderDetails />
      </ProtectedRoute>
    },
    {
      path: "/quickOrder/:orderPage",
      element: <ProtectedRoute user={user}>
        <QuickOrder />
      </ProtectedRoute>
    },
    { path: "/orderSuccess", element: <OrderPlaceCard /> }
  ]);
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <AlertDialogSlide />
      <ResponsiveDialog />
      <ForgetDialogee />
    </ThemeProvider>
  );
}

export default App;
