import CategoryGrid from "./components/header/categoryGrid";
import Navbar from "./components/header/navbar";
import Banner from "./components/header/banner";
import ItemCard from "./components/body/item";
import HomePage from "./pages/home";
import ViewCar from "./pages/viewCar";
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar/>
      <Banner/>
      <CategoryGrid/>
      <ItemCard/> */}
      {/* <HomePage/> */}
      <ViewCar/>
    </div>
  );
}

export default App;
