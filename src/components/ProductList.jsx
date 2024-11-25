import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
  resetStatus,
} from "../redux/products/productsSlice";
import { Link } from "react-router-dom";

function ProductList() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  // initally fetch products when the component mounts and when the status is idle
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  //-------------------------------------------------------------------

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(id)).unwrap(); // use unwrap to handle the promise returned by dispatch, even already handled by the thunk
        dispatch(resetStatus()); // reset the status after deleting product
      } catch (error) {
        console.log("Error deleting product:", error);
      } // pass the id to the deleteProduct action
    }
  };

  if (status === "loading") {
    return (
      <button
        type="button"
        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
      >
        <span
          className="animate-spin inline-block size-4 border-[3px] border-current border-t-transparent text-white rounded-full"
          role="status"
          aria-label="loading"
        ></span>
        Loading
      </button>
    );
  }
  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4 text-center">Product List</h1>
        <div className="flex flex-row-reverse items-center mb-4">
          <Link
            to="/add"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Product
          </Link>
        </div>
        {status === "succeeded" && (
          <div className="overflow-x-auto mt-8">
            <table className="table-auto w-full border-collapse shadow-lg rounded-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border-b text-left">ID</th>
                  <th className="px-4 py-2 border-b text-left">Name</th>
                  <th className="px-4 py-2 border-b text-left">Description</th>
                  <th className="px-4 py-2 border-b text-left">Price</th>
                  <th className="px-4 py-2 border-b text-left">Stock</th>
                  <th className="px-4 py-2 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{product.id}</td>
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2">{product.description}</td>
                    <td className="border px-4 py-2">IDR {product.price}</td>
                    <td className="border px-4 py-2">{product.stock}</td>
                    <td className="border px-4 py-2">
                      {/* edit button */}
                      <div className="flex items-center">
                        <Link
                          to={`/edit/${product.id}`}
                          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(product.id)} //pass the id to the handleDelete function
                          className="px-4 py-2 bg-red-500 text-white rounded ml-2  hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductList;
