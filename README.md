# SEBTP

Một project web frontend được xây dựng với React + Vite, tối ưu cho phát triển SPA với TailwindCSS, Redux, Supabase và các thư viện UI/phục vụ dashboard.

<!-- Badges / Icons -->

[![Vite](https://img.shields.io/badge/Vite-FFDB4E?logo=vite&logoColor=000)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&labelColor=20232A)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=ffffff)](https://tailwindcss.com)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?logo=redux&logoColor=fff)](https://redux-toolkit.js.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=fff)](https://supabase.com)
[![Ant Design](https://img.shields.io/badge/Ant_Design-0170FE?logo=ant-design&logoColor=fff)](https://ant.design)
[![Axios](https://img.shields.io/badge/Axios-5A29AB?logo=axios&logoColor=fff)](https://axios-http.com)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chart.js&logoColor=fff)](https://www.chartjs.org)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=fff)](https://reactrouter.com)
[![React Icons](https://img.shields.io/badge/React_Icons-61DAFB?logo=react&logoColor=000)](https://react-icons.github.io/react-icons)
[![React Toastify](https://img.shields.io/badge/React_Toastify-FF8C00?logo=react-toastify&logoColor=fff)](https://fkhadra.github.io/react-toastify)
[![Lucide](https://img.shields.io/badge/Lucide-000000?logo=lucide&logoColor=white)](https://lucide.dev)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=fff)](https://eslint.org)

---

## Mô tả

`SEBTP` là một boilerplate / project frontend Vue/React (trong repo này dùng React) được cấu trúc sẵn cho dashboard, pages người bán, trang xem sản phẩm, và tính năng upload hình ảnh. Thiết kế hướng đến:

- Nhanh khi phát triển (Vite + HMR)
- Styling tiện lợi (TailwindCSS)
- State management rõ ràng (Redux Toolkit)
- Backend nhẹ, realtime-ready (Supabase)
- UI components nhanh (Ant Design)

## Tính năng chính

- Quản lý người dùng và bài đăng
- Dashboard admin với biểu đồ (Chart.js)
- Đăng tải hình ảnh và quản lý bài viết
- Xác thực OAuth (Google)
- Thông báo toast cho UX (React Toastify)

## Kiến trúc thư mục (tóm tắt)

- `src/` — mã nguồn ứng dụng
  - `components/` — các thành phần giao diện tái sử dụng
  - `pages/` — các trang chính (home, seller, admin, view...)
  - `config/` — thiết lập axios & supabase
  - `redux/` — slices và cấu hình store

## Yêu cầu

- Node.js >= 16
- npm hoặc yarn

## Cài đặt & Chạy (local)

Mở terminal và chạy:

```powershell
npm install
npm run dev
```

Trang sẽ chạy mặc định tại http://localhost:5173 (hoặc cổng do Vite chọn).

## Biến môi trường (ví dụ `.env`)

Tạo file `.env` hoặc `.env.local` ở gốc project với các biến (ví dụ tên biến dùng Vite):

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
```

Kiểm tra `src/config/supabase.js` và `src/config/axios.js` để biết cách repo đọc các biến này.

## Scripts hữu ích

- `npm run dev` — chạy môi trường phát triển (Vite)
- `npm run build` — tạo bản build sản phẩm
- `npm run preview` — preview bản build cục bộ
- `npm run lint` — chạy ESLint

## Cách đóng góp

1. Fork repo
2. Tạo branch: `feature/<mô-tả>`
3. Commit và PR mô tả rõ thay đổi

Vui lòng tuân thủ quy ước code style sẵn có (Tailwind + ESLint).

## Tài nguyên & Liên kết

- Vite: https://vitejs.dev
- React: https://reactjs.org
- TailwindCSS: https://tailwindcss.com
- Redux Toolkit: https://redux-toolkit.js.org
- Supabase: https://supabase.com
- Ant Design: https://ant.design

## Liên hệ

Nếu cần hỗ trợ nhanh, tạo issue hoặc liên hệ trực tiếp với tác giả trong repo.

---

Chúc bạn phát triển nhanh và vui vẻ với project!
