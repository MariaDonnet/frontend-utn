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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 👉 FormData (CLAVE)
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("category", formData.category);

    try {
      const response = await apiFetch("/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ NO Content-Type
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        alert(data.error || "Error al crear el producto");
        return;
      }

      alert("✅ Producto creado correctamente");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("❌ Error de conexión con el servidor");
    }
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
            required
            onChange={handleChange}
            value={formData.name}
          />

          <input
            type="text"
            placeholder="Descripción"
            name="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="number"
            placeholder="Precio"
            name="price"
            min={0}
            required
            onChange={handleChange}
            value={formData.price}
          />

          <input
            type="number"
            placeholder="Stock"
            name="stock"
            min={0}
            required
            onChange={handleChange}
            value={formData.stock}
          />

          <input
            type="text"
            placeholder="Categoría"
            name="category"
            required
            onChange={handleChange}
            value={formData.category}
          />

          <button type="submit">Agregar</button>
        </form>
      </section>
    </Layout>
  );
};

export default AddProduct;
