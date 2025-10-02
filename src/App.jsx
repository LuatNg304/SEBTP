import CategoryGrid from "./components/header/categoryGrid";
import Navbar from "./components/header/navbar";
import Banner from "./components/header/banner";
import ItemCard from "./components/body/item";
import HomePage from "./pages/home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";
import { ToastContainer } from "react-toastify";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
