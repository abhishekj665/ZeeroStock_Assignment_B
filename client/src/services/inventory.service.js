import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const createSupplier = async (payload) => {
  try {
    const response = await API.post("/supplier", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating supplier:", error);
    throw error;
  }
};

export const fetchSuppliers = async () => {
  try {
    const response = await API.get("/supplier");
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

export const createInventory = async (payload) => {
  try {
    const response = await API.post("/inventory", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating inventory:", error);
    throw error;
  }
};

export const searchInventory = async (params) => {
  try {
    const response = await API.get("/inventory/search", { params });
    return response.data;
  } catch (error) {
    console.error("Error searching inventory:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await API.get("/inventory/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getGroupedInventory = async () => {
  try {
    const response = await API.get("/inventory");
    return response.data;
  } catch (error) {
    console.error("Error fetching grouped inventory:", error);
    throw error;
  }
};
