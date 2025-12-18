import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";
import { ToastMessage } from "./ToastMessage";

const UpdateProduct = ({ product, onClose, onUpdate }) => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    stock: product.stock || "",
    category: product.category || "",
  });

  const [toast, setToast] = useState({
    show: false,
    msg: "",
    color: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    try {
      const response = await apiFetch(`/products/${product._id}`, {
        method: "PATCH",
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          show: true,
          msg: data.error || "Error al actualizar el producto",
          color: "red",
        });
        return;
      }

      setToast({
        show: true,
        msg: "Producto actualizado correctamente",
        color: "green",
      });

      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1000);
    } catch (error) {
      setToast({
        show: true,
        msg: "Error de conexión con el servidor",
        color: "red",
      });
    } finally {
      setTimeout(() => {
        setToast({ show: false, msg: "", color: "" });
      }, 3000);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Editar producto</h2>

        <form className="form-container" onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} />
          <input name="description" value={formData.description} onChange={handleChange} />
          <input type="number" name="price" value={formData.price} onChange={handleChange} />
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} />
          <input name="category" value={formData.category} onChange={handleChange} />

          <button type="submit">Guardar</button>
        </form>

        <button className="close-btn" onClick={onClose}>
          Cancelar
        </button>

        {toast.show && (
          <ToastMessage msg={toast.msg} color={toast.color} />
        )}
      </div>
    </div>
  );
};

export default UpdateProduct;
