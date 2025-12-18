import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import UpdateProduct from "../components/UpdateProduct";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../constants/categories";
import { ToastMessage } from "../components/ToastMessage";
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
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    name: "",
    stock: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const [responseServer, setResponseServer] = useState(initialResponseState);

  const { user, token } = useAuth();

  const fetchingProducts = async (query = "") => {
    setLoading(true);
    setResponseServer(initialResponseState);

    try {
      const response = await apiFetch(`/products?${query}`);
      const data = await response.json();

      setProducts(data.data || []);
      setResponseServer({
        success: true,
        notification: "Productos cargados correctamente",
        error: { fetch: false, delete: null },
      });
    } catch (error) {
      setResponseServer({
        success: false,
        notification: "Error al cargar los productos",
        error: { fetch: true, delete: null },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm("¿Está seguro de que desea borrar el producto?")) return;

    try {
      const response = await apiFetch(`/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error al borrar el producto");
        return;
      }

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      alert("Error de conexión con el servidor");
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

    Object.entries(filters).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });

    fetchingProducts(query.toString());
  };

  const handleResetFilters = () => {
    setFilters({
      name: "",
      stock: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
    fetchingProducts();
  };

  return (
    <Layout>
      <div className="page-banner">Nuestros Productos</div>

      <section className="page-section">
        {user ? (
          <p>
            Bienvenido <strong>{user.email}</strong>.  
            Podés gestionar los productos desde esta sección.
          </p>
        ) : (
          <p>Explorá nuestro catálogo de productos disponibles.</p>
        )}
      </section>

      {/* FILTROS */}
      <section className="filters-section">
        <form className="filters-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Buscar por nombre"
            value={filters.name}
            onChange={handleChange}
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={filters.stock}
            onChange={handleChange}
          />

          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
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
            value={filters.minPrice}
            onChange={handleChange}
          />

          <input
            type="number"
            name="maxPrice"
            placeholder="Precio máximo"
            value={filters.maxPrice}
            onChange={handleChange}
          />

          <button type="submit">Aplicar filtros</button>
          <button type="button" onClick={handleResetFilters}>
            Limpiar
          </button>
        </form>
      </section>

      {/* MODAL UPDATE */}
      {selectedProduct && (
        <UpdateProduct
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={fetchingProducts}
        />
      )}

      {/* LISTADO */}
      <section className="products-grid">
        {loading && <p>Cargando productos...</p>}

        {!loading && products.length === 0 && (
          <p>No hay productos para mostrar.</p>
        )}

        {!loading &&
          products.map((p) => (
            <div key={p._id} className="product-card">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <p>
                <strong>Precio:</strong> ${p.price}
              </p>
              <p>
                <strong>Stock:</strong> {p.stock}
              </p>
              <p>
                <strong>Categoría:</strong> {p.category}
              </p>

              {user && (
                <div className="cont-btn">
                  <button onClick={() => handleUpdateProduct(p)}>
                    Actualizar
                  </button>
                  <button onClick={() => deleteProduct(p._id)}>
                    Borrar
                  </button>
                </div>
              )}
            </div>
          ))}
      </section>

      {responseServer.success && (
        <ToastMessage color="green" msg={responseServer.notification} />
      )}

      {responseServer.error.fetch && (
        <ToastMessage color="red" msg={responseServer.notification} />
      )}
    </Layout>
  );
};

export default Home;
