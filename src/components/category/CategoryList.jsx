// src/components/category/CategoryList.jsx
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import CategoryForm from "./CategoryForm";
import axios from "axios";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    _id: null,
    name: "",
    description: "",
    status: "active",
  });

  // Fetch all categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/categories/all"
      );
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditMode(false);
    setCurrentCategory({
      _id: null,
      name: "",
      description: "",
      status: "active",
    });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditMode(true);
    setCurrentCategory({
      _id: category._id,
      name: category.name,
      description: category.description,
      status: category.status,
    });
    setShowModal(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/delete/${id}`);
        setCategories(categories.filter((category) => category._id !== id));
      } catch (err) {
        console.error("Error deleting category:", err);
        alert("Failed to delete category");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        // Update existing category
        const response = await axios.put(
          `http://localhost:5000/api/categories/update/${currentCategory._id}`,
          {
            name: currentCategory.name,
            description: currentCategory.description,
            status: currentCategory.status,
          }
        );

        setCategories(
          categories.map((category) =>
            category._id === currentCategory._id ? response.data : category
          )
        );
      } else {
        // Create new category
        const response = await axios.post(
          "http://localhost:5000/api/categories/add",
          {
            name: currentCategory.name,
            description: currentCategory.description,
            status: currentCategory.status,
          }
        );

        setCategories([...categories, response.data]);
      }

      setShowModal(false);
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Failed to save category");
    }
  };

  return (
    <div className="p-6 overflow-auto h-full bg-background">
      <div className="flex justify-between items-center mb-8 mt-6 ">
        <h1 className="text-3xl font-extrabold text-[#1f2937]">
          Room Categories
        </h1>
        <button
          onClick={handleAddCategory}
          className="bg-secondary text-dark px-4 py-2  cursor-pointer rounded-lg hover:shadow-lg transition-shadow font-medium"
        >
          <Plus size={18} className="w-4 h-4 inline mr-2" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading categories...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className="bg-white divide-y divide-gray-200 overflow-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {category.name}
                  </td>
                  <td className="px-6 py-4">{category.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          category.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {category.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-1 rounded-full text-blue-600 hover:bg-blue-50"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="p-1 rounded-full text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No categories found. Add a new category to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Use the separated CategoryForm component */}
      <CategoryForm
        showModal={showModal}
        setShowModal={setShowModal}
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
        handleSubmit={handleSubmit}
        editMode={editMode}
      />
    </div>
  );
};

export default CategoryList;
