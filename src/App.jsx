import CategoryGrid from "./components/header/categoryGrid";
import Navbar from "./components/header/navbar";
import Banner from "./components/header/banner";
import ItemCard from "./components/body/item";
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <Banner/>
      <CategoryGrid/>
      <ItemCard/>
    </div>
  );
}

export default App;
