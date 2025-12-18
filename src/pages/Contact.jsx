import { useState } from "react";
import Layout from "../components/Layout";
import { apiFetch } from "../services/api";

const Contact = () => {
  const [form, setForm] = useState({
    subject: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: null,
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, message: "" });

    try {
      const response = await apiFetch("/email/send", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Error al enviar el mensaje");
      }

      setStatus({
        loading: false,
        success: true,
        message: "Mensaje enviado correctamente. Gracias por contactarnos.",
      });

      setForm({
        subject: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setStatus({
        loading: false,
        success: false,
        message: "No se pudo enviar el mensaje. Intente nuevamente.",
      });
    }
  };

  return (
    <Layout>
      <div className="page-banner">Contacto</div>

      <section className="page-section">
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Escribinos</h3>

          <div>
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Asunto</label>
            <input
              type="text"
              name="subject"
              required
              value={form.subject}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Mensaje</label>
            <textarea
              name="message"
              rows="4"
              required
              value={form.message}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={status.loading}>
            {status.loading ? "Enviando..." : "Enviar"}
          </button>

          {status.message && (
            <p
              style={{
                marginTop: "12px",
                color: status.success ? "green" : "red",
                fontWeight: 500,
              }}
            >
              {status.message}
            </p>
          )}
        </form>
      </section>
    </Layout>
  );
};

export default Contact;
