import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/home";
import Oto from "./pages/home/Oto";
import Bike from "./pages/home/Bike";
import Pin from "./pages/home/Pin";
import AllProduct from "./pages/home/AllProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />, // layout ngoài
    children: [
      {
        index: true,
        element: <AllProduct />, // trang chủ (mặc định) hiển thị trong layout ngoài
      },
      {
        path: "oto",
        element: <Oto/>,
      },
      {
        path: "bike",
        element: <Bike/>,
      },
      {
        path: "pin",
        element: <Pin/>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
