import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from "react-toastify"; // import ToastContainer
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux';
import { store } from './redux/store.js';


createRoot(document.getElementById('root')).render(
    <Provider store={store}>
    <App />
     <ToastContainer 
      position="top-right"       // vị trí hiển thị
      autoClose={3000}           // tự động ẩn sau 3 giây
      hideProgressBar={false}    // có/không hiển thị thanh tiến trình
      newestOnTop={false}        
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    </Provider >
)
