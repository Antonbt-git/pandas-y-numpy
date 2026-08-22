const styles: { [key: string]: React.CSSProperties } = {
  mainContainer: {
    padding: "60px 0",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    marginBottom: "40px",
  },
  headerHero: {
    textAlign: "center",
    marginBottom: "60px",
    position: "relative",
    overflow: "hidden",
    padding: "40px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  titleHero: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "15px",
    position: "relative",
    zIndex: 1,
  },
  subtitleHero: {
    fontSize: "20px",
    color: "#4b5563",
    maxWidth: "800px",
    margin: "0 auto",
    lineHeight: "1.6",
    position: "relative",
    zIndex: 1,
  },
  pandasLogoHero: {
    position: "absolute",
    right: "-30px",
    top: "-30px",
    width: "180px",
    opacity: 0.15,
    zIndex: 0,
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "30px",
    marginBottom: "60px",
    padding: "0 40px",
  },
  featureCard: {
    background: "#f9fafb",
    padding: "30px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
  },
  featureCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
  },
  featureIcon: {
    width: "60px",
    height: "60px",
    marginBottom: "20px",
  },
  featureTitle: {
    fontSize: "22px",
    marginBottom: "12px",
    color: "#111827",
  },
  featureText: {
    color: "#374151",
    lineHeight: "1.6",
    flex: 1,
  },
  codeSection: {
    backgroundColor: "#1e293b",
    color: "#f8fafc",
    padding: "30px",
    borderRadius: "10px",
    marginBottom: "60px",
    marginLeft: "40px",
    marginRight: "40px",
    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",
  },
  codeHeader: {
    fontSize: "18px",
    marginBottom: "15px",
    color: "#38bdf8",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  codeBlock: {
    fontFamily: "monospace, monospace",
    overflowX: "auto",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#e2e8f0",
  },
  moreInfoSection: {
    padding: "40px",
    background: "#fdfefe",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "40px",
    marginLeft: "40px",
    marginRight: "40px",
  },
  infoFlex: {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
    alignItems: "flex-start",
  },
  infoTextList: {
    listStyleType: "square",
    paddingLeft: "20px",
    color: "#000000",
    lineHeight: "1.8",
  },
};

function Home(): React.ReactElement {
  return (
    <section className="page">
        <h2>Bienvenido</h2>
        <p>Este es el incio de nuestro proyecto React + TypeScript.</p>
      
      <article style={styles.moreInfoSection}>
        <h3
          style={{
            ...styles.featureTitle,
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          ¿Qué es Pandas en Python?
        </h3>
        <div style={styles.infoFlex}>
          
          <div style={{ flex: 1 }}>
            <p style={styles.featureText}>
              Pandas es una biblioteca de Python de código abierto usada para 
              la manipulación y el análisis de datos. Permite trabajar de forma 
              rápida y flexible con datos en forma de tablas (como hojas de 
              cálculo de Excel o tablas SQL), facilitando tareas como limpiar, 
              filtrar, unir y resumir información numérica y estadística
            </p>
            <h4 style={{ ...styles.featureTitle, marginTop: "30px" }}>
              Estructuras principales de Pandas:
            </h4>
            <ul style={styles.infoTextList}>
              <li>
                <strong>Series:</strong> Una columna o vector de datos 
                unidimensional con etiquetas (índices).</li>
              <li>
                <strong>DataFrame:</strong>  Una tabla bidimensional de 
                filas y columnas, muy parecida a una tabla de Excel.
              </li>
              <li>
                <strong>Limpieza de Datos:</strong> Herramientas inigualables
                para tratar valores nulos, duplicados y datos inconsistentes.
              </li>
              <li>
                <strong>I/O Extenso:</strong> Lee y escribe datos de una
                variedad enorme de fuentes y formatos (CSV, Excel, SQL, JSON,
                Parquet, etc.).
              </li>
            </ul>
            
          </div>
        </div>
      </article>
    </section>
  );
}

export default Home;