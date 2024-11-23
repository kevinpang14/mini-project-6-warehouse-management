import { useDispatch, useSelector } from "react-redux";
import {
  setFormData,
  resetFormData,
  resetStatus,
} from "../redux/products/productsSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  addProduct,
  updateProduct,
  fetchProductById,
} from "../redux/products/productsSlice";
import { useEffect, useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const ProductForm = () => {
  const dispatch = useDispatch();
  //products is the name of the slice in the reducer
  const { form } = useSelector((state) => state.products);
  const { name, description, price, stock, id } = form;
  const { error } = useSelector((state) => state.products);

  const navigate = useNavigate();
  const { productId } = useParams();

  // state for barcode scanner
  const [scanning, setScanning] = useState(false);

  // fetch product by id
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId)); //set it to the form
    } else {
      // reset the form data when navigating to the add product page
      dispatch(resetFormData());
    }
  }, [dispatch, productId]);

  // synchronous action
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ ...form, [name]: value }));
  };

  // asynchronous action handle add and update
  const handleSubmit = async (e) => {
    e.preventDefault();

    //after handlechange the form data, we need to dispatch the addProduct action
    const newProduct = {
      id: id,
      name: name,
      description: description,
      price: Number(price),
      stock: Number(stock),
    };

    try {
      if (productId) {
        // update product
        await dispatch(
          updateProduct({ ...newProduct, id: productId })
        ).unwrap();
      } else {
        // add product
        await dispatch(addProduct(newProduct)).unwrap();
      }

      // reset the form data after adding product
      dispatch(resetFormData());
      // reset the status after adding/edit product
      dispatch(resetStatus());
      // back to the home page after adding product
      navigate("/");
    } catch (error) {
      console.log("Error adding product: ", error);
    }
  };

  // if error
  if (error) {
    return <p className="text-red-500">{`Error: ${error.message}`}</p>;
  }

  // Handle barcode scan result
  const handleBarcodeScan = (result) => {
    if (result && result.text) {
      dispatch(setFormData({ ...form, id: result.text }));
      setScanning(false); // Stop scanning after getting the result
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 sm:w-full md:w-1/2 lg:w-1/3">
        <h2 className="text-2xl font-bold mb-4">
          {productId ? "Edit Product" : "Add New Product"}
        </h2>
        {/* Back Button */}
        <button
          onClick={() => navigate("/")} // Navigate back to product list
          className="mb-4 p-2 bg-orange-500 text-white rounded"
        >
          Back to Product List
        </button>

        {/* Barcode Scanner Button */}
        <div className="mb-4">
          <button
            onClick={() => setScanning(!scanning)} // Toggle scanning state
            className="p-2 bg-green-500 text-white rounded"
          >
            {scanning ? "Stop Scanning" : "Scan Barcode"}
          </button>
        </div>

        {/* Barcode Scanner Component */}
        {scanning && (
          <BarcodeScannerComponent
            onUpdate={(err, result) => handleBarcodeScan(result)} // Handle barcode scan
            width="100%" // Full width of container
            height="300px" // Adjust the height
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="id" className="block text-sm font-medium">
              Product ID
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={id || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              disabled={!!productId} // Disable if editing a product
              required
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={price || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium">
              Stock Quantity
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={stock || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            {productId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ProductForm;
