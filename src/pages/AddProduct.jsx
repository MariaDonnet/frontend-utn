import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: ""
  });

  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    try {
      const response = await apiFetch("/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        alert("❌ Error al cargar el producto");
        return;
      }

      alert("✅ Producto creado correctamente");
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: ""
      });

      navigate("/");
    } catch (error) {
      alert("❌ Error de conexión con el servidor");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <div className="page-banner">Agregar Nuevo Producto</div>

      <section className="page-section">
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="number"
            placeholder="Precio"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />

          <input
            type="number"
            placeholder="Stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Categoría"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />

          <button type="submit">Agregar</button>
        </form>
      </section>
    </Layout>
  );
};

export default AddProduct;
