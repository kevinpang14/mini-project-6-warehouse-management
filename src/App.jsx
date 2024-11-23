import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/view/:productId" element={<ProductForm />} />
          <Route path="/add" element={<ProductForm />} />
          <Route path="/edit/:productId" element={<ProductForm />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
