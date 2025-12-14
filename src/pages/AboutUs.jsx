import Layout from "../components/Layout"

const AboutUs = () => {
  return (
    <Layout>
      <div className="page-banner">Sobre Nosotros</div>

      <section className="page-section">
        <h2>Nuestra Historia</h2>
        <p>
          Somos una compañía dedicada a ofrecer productos de alta calidad. Creemos en la innovación y la mejora
          constante, manteniendo siempre el compromiso con nuestros clientes.
        </p>

        <h2>Misión</h2>
        <p>
          Ofrecer soluciones confiables que mejoren la vida cotidiana de las personas.
        </p>

        <h2>Visión</h2>
        <p>
          Convertirnos en referentes del sector a nivel nacional e internacional.
        </p>
      </section>
    </Layout>
  )
}

export default AboutUs
