import Layout from "../components/Layout"

const AboutUs = () => {
  return (
    <Layout>
      <div className="page-banner">Sobre Nosotros</div>

      <section className="about-section">
        <div className="about-card">
          <h2>Nuestra Historia</h2>
          <p>
            Somos una compañía dedicada a ofrecer productos de alta calidad.
            Creemos en la innovación y la mejora continua, manteniendo siempre
            el compromiso con nuestros clientes y con la excelencia en cada
            proceso.
          </p>
        </div>

        <div className="about-card">
          <h2>Misión</h2>
          <p>
            Ofrecer soluciones confiables y accesibles que mejoren la vida
            cotidiana de las personas, priorizando la calidad y la
            transparencia.
          </p>
        </div>

        <div className="about-card">
          <h2>Visión</h2>
          <p>
            Convertirnos en referentes del sector a nivel nacional e
            internacional, apostando al crecimiento sostenible y a la
            innovación constante.
          </p>
        </div>
      </section>
    </Layout>
  )
}

export default AboutUs

