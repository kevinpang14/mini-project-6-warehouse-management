import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//for products
const API_URL = "http://localhost:3000/products";

// test aync thunk
// fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get(API_URL);
    console.log("fetch response.data", response.data);
    return response.data;
  }
);

// add product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product) => {
    console.log("adding product: ", product);
    const response = await axios.post(API_URL, product);
    console.log("add product response.data", response.data);
    return response.data;
  }
);

// update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (product) => {
    console.log("updating product: ", product);
    const response = await axios.put(`${API_URL}/${product.id}`, product);
    console.log("update product response.data", response.data);
    return response.data;
  }
);

// delete product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId) => {
    console.log("deleting product: ", productId);
    const response = await axios.delete(`${API_URL}/${productId}`);
    console.log("delete product response.data", response.data);
    return productId;
  }
);

//fetch product by ID

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId) => {
    console.log("fetching product by ID: ", productId);
    const response = await axios.get(`${API_URL}/${productId}`);
    console.log("fetch product by ID response.data", response.data);
    return response.data;
  }
);

// slice

const defaultFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
};

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    status: "idle", // open for resetting status
    error: null,
    form: defaultFormState, // open for resetting form data
    isUpdate: false,
  },
  reducers: {
    // for syncronous actions
    setFormData: (state, action) => {
      state.form = action.payload;
    },
    resetFormData: (state) => {
      //reset form data to initial state after adding product
      state.form = defaultFormState;
      state.isUpdate = false;
    },

    // for resetting status
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  // for asyncronous actions
  extraReducers: (builder) => {
    builder

      // fetch products start
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // fetch products end

      // add product start
      .addCase(addProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // add product end

      // update product start

      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (product) => product.id === updatedProduct.id
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // update product end

      // delete product start

      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = state.products.filter(
          (product) => product.id !== action.payload // payload only returns id
        );
        console.log("status after delete", state.status);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // delete product end

      // fetch product by ID start
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        // set the form data to the fetched product data
        state.form = action.payload;
        state.isUpdate = true;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    // fetch product by ID end
  },
});

// for syncronous actions
export const { setFormData, resetFormData, resetStatus } =
  productsSlice.actions;

// for asyncronous actions
export default productsSlice.reducer;
