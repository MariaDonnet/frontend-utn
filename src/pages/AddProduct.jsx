import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { ToastMessage } from "../components/ToastMessage";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [toast, setToast] = useState({
    show: false,
    msg: "",
    color: "",
  });

  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const showToast = (msg, color = "green") => {
    setToast({ show: true, msg, color });
    setTimeout(() => {
      setToast({ show: false, msg: "", color: "" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔑 FormData (necesario para multer)
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
          // ❌ NO Content-Type (multipart)
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        showToast(data.error || "Error al crear el producto", "red");
        return;
      }

      showToast("Producto creado correctamente", "green");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      console.error(error);
      showToast("Error de conexión con el servidor", "red");
    } finally {
      setLoading(false);
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

          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Agregar"}
          </button>
        </form>
      </section>

      {toast.show && (
        <ToastMessage msg={toast.msg} color={toast.color} />
      )}
    </Layout>
  );
};

export default AddProduct;
