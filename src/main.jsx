import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify"; // import ToastContainer
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<div>Đang tải dữ liệu...</div>} persistor={persistor}>
      <App />
    </PersistGate>
    <ToastContainer
      position="top-right" // vị trí hiển thị
      autoClose={3000} // tự động ẩn sau 3 giây
      hideProgressBar={false} // có/không hiển thị thanh tiến trình
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </Provider>
);
