import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import UpdateProduct from "../components/UpdateProduct";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../constants/categories.js";
import { ToastMessage } from "../components/ToastMessage.jsx";
import { apiFetch } from "../services/api";

const Home = () => {
  const initialResponseState = {
    success: null,
    notification: null,
    error: {
      fetch: null,
      delete: null,
    },
  };

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    stock: 0,
    category: "",
    minPrice: 0,
    maxPrice: 0,
  });
  const [responseServer, setResponseServer] = useState(initialResponseState);

  const { user, token } = useAuth();

  const fetchingProducts = async (query = "") => {
    setResponseServer(initialResponseState);
    try {
      const response = await apiFetch(`/products?${query}`);
      const dataProducts = await response.json();

      setProducts(dataProducts.data.reverse());
      setResponseServer({
        success: true,
        notification: "Éxito al cargar los productos",
        error: { fetch: true, delete: null },
      });
    } catch (error) {
      setResponseServer({
        success: false,
        notification: "Error al traer los datos",
        error: { fetch: false, delete: null },
      });
    }
  };

  useEffect(() => {
    fetchingProducts();
  }, []);

  const deleteProduct = async (idProduct) => {
    if (!confirm("¿Está seguro de que desea borrar el producto?")) return;

    try {
      const response = await apiFetch(`/products/${idProduct}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const dataResponse = await response.json();

      if (!response.ok) {
        throw new Error(dataResponse.error || "Error al borrar el producto");
      }

      setProducts(products.filter((p) => p._id !== idProduct));
      alert(`${dataResponse.data.name} borrado con éxito.`);
    } catch (error) {
      setResponseServer({
        success: false,
        notification: "Error al borrar el producto",
        error: { fetch: true, delete: true },
      });
    }
  };

  const handleUpdateProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const query = new URLSearchParams();

    if (filters.name) query.append("name", filters.name);
    if (filters.stock) query.append("stock", filters.stock);
    if (filters.category) query.append("category", filters.category);
    if (filters.minPrice) query.append("minPrice", filters.minPrice);
    if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);

    fetchingProducts(query.toString());
  };

  const handleResetFilters = () => {
    setFilters({
      name: "",
      stock: 0,
      category: "",
      minPrice: 0,
      maxPrice: 0,
    });
    fetchingProducts();
  };

  return (
    <Layout>
      <div className="page-banner">Nuestros Productos</div>

      <section className="page-section">
        <p>
          Bienvenido {user && user.id} a nuestra tienda. Aquí encontrarás una amplia
          variedad de productos diseñados para satisfacer tus necesidades.
        </p>
      </section>

      <section>
        <form className="filters-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Buscar por nombre"
            onChange={handleChange}
            value={filters.name}
          />
          <input
            type="number"
            name="stock"
            placeholder="Ingrese el stock"
            onChange={handleChange}
            value={filters.stock}
          />
          <select
            name="category"
            onChange={handleChange}
            value={filters.category}
          >
            <option value="">Todas las categorías</option>
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.value}>
                {category.content}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="minPrice"
            placeholder="Precio mínimo"
            onChange={handleChange}
            value={filters.minPrice}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Precio máximo"
            onChange={handleChange}
            value={filters.maxPrice}
          />
          <button type="submit">Aplicar filtros</button>
          <button type="button" onClick={handleResetFilters}>
            Cancelar
          </button>
        </form>
      </section>

      {selectedProduct && (
        <UpdateProduct
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={fetchingProducts}
        />
      )}

      <section className="products-grid">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p><strong>Precio:</strong> ${p.price}</p>
            <p><strong>Stock:</strong> {p.stock}</p>
            <p><strong>Categoría:</strong> {p.category}</p>
            {user && (
              <div className="cont-btn">
                <button onClick={() => handleUpdateProduct(p)}>Actualizar</button>
                <button onClick={() => deleteProduct(p._id)}>Borrar</button>
              </div>
            )}
          </div>
        ))}
      </section>

      {responseServer.error.fetch === false && (
        <ToastMessage color="red" msg={responseServer.notification} />
      )}

      {responseServer.success && (
        <ToastMessage color="green" msg={responseServer.notification} />
      )}
    </Layout>
  );
};

export default Home;