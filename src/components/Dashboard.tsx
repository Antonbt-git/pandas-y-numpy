<<<<<<< HEAD
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageModel from "./ImageModel";
import AudioModel from "./AudioModel";
import PoseModel from "./PoseModel";

type Lib = "Pandas" | "NumPy";

type CsvData = {
  key: string;
  name: string;
  columns: string[];
  data: string[][];
  result?: string;
};

type History = {
  key: string;
  lib: Lib;
  operation: string;
  file: string;
  time: string;
  result: string;
};

const Dashboard = (): React.ReactElement => {
  const [section, setSection] = useState<"pandas" | "numpy" | "reports" | "imagen" | "audio" | "postura">("pandas");
  const [files, setFiles] = useState<CsvData[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const parse = (text: string): string[][] =>
    text
      .trim()
      .split(/\r?\n/)
      .map(line =>
        line
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map(value => value.replace(/^"|"$/g, "").trim())
      );

  const loadFile = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = event => {
      const content = event.target?.result;

      if (typeof content !== "string") return;

      const matrix = parse(content);
      if (!matrix.length) return;

      setFiles(current => [
        {
          key: crypto.randomUUID(),
          name: file.name,
          columns: matrix[0],
          data: matrix.slice(1),
        },
        ...current,
      ]);
    };

    reader.readAsText(file);
  };

  const chooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    loadFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const dropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const updateResult = (key: string, result: string) => {
    setFiles(current =>
      current.map(file =>
        file.key === key ? { ...file, result } : file
      )
    );
  };

  const saveHistory = (
    lib: Lib,
    operation: string,
    file: CsvData,
    result: string
  ) => {
    setHistory(current => [
      {
        key: crypto.randomUUID(),
        lib,
        operation,
        file: file.name,
        time: new Date().toLocaleTimeString(),
        result,
      },
      ...current,
    ]);
  };

  const getFile = (key: string) => files.find(file => file.key === key);

  const describe = (key: string) => {
    const file = getFile(key);
    if (!file) return;

    const result =
      `DataFrame\n` +
      `Filas: ${file.data.length}\n` +
      `Columnas: ${file.columns.length}\n` +
      `Campos: ${file.columns.join(", ")}`;

    updateResult(key, result);
    saveHistory("Pandas", ".describe()", file, result);
  };

  const head = (key: string) => {
    const file = getFile(key);
    if (!file) return;

    const result = file.data
      .slice(0, 5)
      .map(row => row.join(" | "))
      .join("\n");

    updateResult(key, `Primeros registros:\n${result}`);
    saveHistory("Pandas", ".head()", file, result);
  };

  const statistics = (key: string) => {
    const file = getFile(key);
    if (!file) return;

    const index = file.columns.findIndex((_, i) =>
      file.data.some(row => row[i] !== "" && !isNaN(Number(row[i])))
    );

    if (index < 0) {
      const result = "No existen datos numéricos.";
      updateResult(key, result);
      return;
    }

    const values = file.data
      .map(row => Number(row[index]))
      .filter(value => !isNaN(value));

    const average =
      values.reduce((sum, value) => sum + value, 0) / values.length;

    const result =
      `Columna: ${file.columns[index]}\n` +
      `Promedio: ${average.toFixed(2)}\n` +
      `Máximo: ${Math.max(...values)}\n` +
      `Mínimo: ${Math.min(...values)}`;

    updateResult(key, result);
    saveHistory("NumPy", "Estadísticas", file, result);
  };

  const makeArray = (key: string) => {
    const file = getFile(key);
    if (!file) return;

    const result =
      `ndarray creado\n` +
      `Dimensiones: ${file.data.length} x ${file.columns.length}\n` +
      `Elementos: ${file.data.length * file.columns.length}`;

    updateResult(key, result);
    saveHistory("NumPy", "Crear ndarray", file, result);
  };

  const remove = (key: string) => {
    setFiles(current => current.filter(file => file.key !== key));
  };

  const changeSection = (value: "pandas" | "numpy" | "reports" | "imagen" | "audio" | "postura") => {
    setSection(value);
    setFiles(current => current.map(file => ({ ...file, result: undefined })));
  };
  const navigate = useNavigate();

  return (
    <div style={css.app}>
      {/* MENÚ LATERAL */}
      <aside style={css.menu}>
        <div style={css.logo}>DASHBOARD</div>

        <button
          style={section === "pandas" ? css.selected : css.menuButton}
          onClick={() => changeSection("pandas")}
        >
          Pandas
        </button>

        <button
          style={section === "numpy" ? css.selected : css.menuButton}
          onClick={() => changeSection("numpy")}
        >
          NumPy
        </button>

        <button
          style={section === "reports" ? css.selected : css.menuButton}
          onClick={() => changeSection("reports")}
        >
          Reportes
        </button>

        <button
          style={section === "imagen" ? css.selected : css.menuButton}
          onClick={() => changeSection("imagen")}
        >
          Imagen
        </button>

        <button
          style={section === "audio" ? css.selected : css.menuButton}
          onClick={() => changeSection("audio")}
        >
          Audio
        </button>

        <button
          style={section === "postura" ? css.selected : css.menuButton}
          onClick={() => changeSection("postura")}
        >
          Postura
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={css.content}>

        {/* ================= PANDAS / NUMPY ================= */}
        {(section === "pandas" || section === "numpy") && (
          <>
            <div style={css.toolbar}>
              <input
                ref={input}
                type="file"
                accept=".csv"
                hidden
                onChange={chooseFile}
              />

              <div
                style={{
                  ...css.drop,
                  borderColor: dragging
                    ? "rgba(56, 189, 248, 0.6)"
                    : "rgba(56, 189, 248, 0.3)",
                  backgroundColor: dragging
                    ? "rgba(30, 41, 59, 0.8)"
                    : "rgba(30, 41, 59, 0.6)",
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={dropFile}
                onClick={() => input.current?.click()}
              >
                Suelta aquí tu archivo CSV
              </div>

              <button
                style={css.upload}
                onClick={() => input.current?.click()}
              >
                + Cargar CSV
              </button>

              <button
                style={css.back}
                onClick={() => navigate(-1)}
              >
                ← Regresar
              </button>
            </div>

            {!files.length && (
              <div style={css.empty}>
                <h2>No hay archivos</h2>
                <p>Selecciona un CSV para comenzar a trabajar.</p>
              </div>
            )}

            {files.map((file) => (
              <section key={file.key} style={css.card}>

                <header style={css.cardHeader}>
                  <div>
                    <h2>
                      {section === "pandas" ? "Pandas" : "NumPy"}
                    </h2>

                    <span>{file.name}</span>
                  </div>

                  <button
                    style={css.remove}
                    onClick={() => remove(file.key)}
                  >
                    Eliminar
                  </button>
                </header>

                {/* TABLA */}
                <div style={css.tableBox}>
                  <table style={css.table}>
                    <thead>
                      <tr>
                        {file.columns.map((column) => (
                          <th
                            key={column}
                            style={css.tableHeader}
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {file.data.slice(0, 10).map((row, index) => (
                        <tr key={index}>
                          {file.columns.map((column, columnIndex) => (
                            <td
                              key={column}
                              style={css.tableCell}
                            >
                              {row[columnIndex] ?? ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* BOTONES */}
                <div style={css.actions}>

                  {section === "pandas" ? (
                    <>
                      <button
                        style={css.actionButton}
                        onClick={() => describe(file.key)}
                      >
                        Resumen
                      </button>

                      <button
                        style={css.actionButton}
                        onClick={() => head(file.key)}
                      >
                        Primeros datos
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        style={css.actionButton}
                        onClick={() => statistics(file.key)}
                      >
                        Estadísticas
                      </button>

                      <button
                        style={css.actionButton}
                        onClick={() => makeArray(file.key)}
                      >
                        Crear Array
                      </button>
                    </>
                  )}

                </div>

                {/* RESULTADO */}
                {file.result && (
                  <pre style={css.result}>
                    {file.result}
                  </pre>
                )}

              </section>
            ))}
          </>
        )}

        {/* ================= REPORTES ================= */}
        {section === "reports" && (
          <section style={css.card}>
            <h1>Historial de operaciones</h1>

            {!history.length ? (
              <p style={css.muted}>
                Todavía no hay operaciones realizadas.
              </p>
            ) : (
              history.map((item) => (
                <article
                  key={item.key}
                  style={css.history}
                >
                  <div style={css.historyTop}>
                    <strong>
                      {item.lib} · {item.operation}
                    </strong>

                    <small>{item.time}</small>
                  </div>

                  <span>{item.file}</span>

                  <pre style={css.result}>
                    {item.result}
                  </pre>
                </article>
              ))
            )}
          </section>
        )}

        {/* ================= IMAGEN ================= */}
        {section === "imagen" && (
          <section style={css.card}>
            <ImageModel />

            <div style={{ marginTop: "25px" }}>
              <button
                style={css.back}
                onClick={() => navigate(-1)}
              >
                ← Regresar
              </button>
            </div>
          </section>
        )}

        {/* ================= AUDIO ================= */}
        {section === "audio" && (
          <section style={css.card}>
            <AudioModel />

            <div style={{ marginTop: "25px" }}>
              <button
                style={css.back}
                onClick={() => navigate(-1)}
              >
                ← Regresar
              </button>
            </div>
          </section>
        )}

        {/* ================= POSTURA ================= */}
        {section === "postura" && (
          <section style={css.card}>
            <PoseModel />

            <div style={{ marginTop: "25px" }}>
              <button
                style={css.back}
                onClick={() => navigate(-1)}
              >
                ← Regresar
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

const css: Record<string, React.CSSProperties> = {
  back: {
    padding: "10px 18px",
    background: "rgba(30, 41, 59, 0.8)",
    color: "#ffffff",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
  },

  app: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    color: "#ffffff",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    overflowX: "hidden",
  },

  menu: {
    width: "220px",
    padding: "25px 15px",
    background: "rgba(15, 23, 42, 0.95)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    zIndex: 100,
    borderRight: "1px solid rgba(56, 189, 248, 0.2)",
    boxShadow: "4px 0 15px rgba(0, 0, 0, 0.3)",
  },

  logo: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "bold",
    padding: "10px",
    marginBottom: "30px",
    textShadow: "0 0 10px rgba(56, 189, 248, 0.5)",
    letterSpacing: "0.5px",
  },

  menuButton: {
    padding: "13px",
    textAlign: "left",
    border: "1px solid transparent",
    borderRadius: "8px",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s ease",
  },

  selected: {
    padding: "13px",
    textAlign: "left",
    border: "1px solid rgba(255, 1, 1, 0.3)",
    borderRadius: "8px",
    background: "rgba(255, 1, 1, 0.2)",
    color: "#ff0101",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 0 15px rgba(255, 1, 1, 0.4)",
    transition: "all 0.2s ease",
  },

  content: {
    flex: 1,
    padding: "40px",
    maxWidth: "1400px",
    marginLeft: "220px",
    minHeight: "100vh",
    boxSizing: "border-box",
  },

  toolbar: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  upload: {
    padding: "12px 24px",
    border: 0,
    borderRadius: "8px",
    background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(56, 189, 248, 0.4)",
    borderBlock: "1px solid rgba(56, 189, 248, 0.3)",
    transition: "all 0.2s ease",
    fontSize: "14px",
  },

  drop: {
    flex: 1,
    padding: "20px",
    border: "2px dashed rgba(56, 189, 248, 0.3)",
    borderRadius: "16px",
    textAlign: "center",
    color: "#94a3b8",
    cursor: "pointer",
    background: "rgba(30, 41, 59, 0.6)",
    transition: "all 0.3s ease",
    fontSize: "15px",
    minHeight: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  empty: {
    padding: "80px",
    textAlign: "center",
    background: "rgba(30, 41, 59, 0.7)",
    borderRadius: "24px",
    border: "1px solid rgba(56, 189, 248, 0.2)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(10px)",
  },

  card: {
    padding: "30px",
    marginBottom: "25px",
    background: "rgba(30, 41, 59, 0.7)",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(56, 189, 248, 0.2)",
    backdropFilter: "blur(10px)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  remove: {
    padding: "8px 14px",
    border: "1px solid rgba(255, 1, 1, 0.3)",
    borderRadius: "8px",
    background: "rgba(255, 1, 1, 0.2)",
    color: "#ff0101",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 0 10px rgba(255, 1, 1, 0.3)",
    transition: "all 0.2s ease",
  },

  tableBox: {
    overflow: "auto",
    maxHeight: "350px",
    border: "1px solid rgba(56, 189, 248, 0.2)",
    borderRadius: "12px",
    background: "rgba(15, 23, 42, 0.8)",
    boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.2)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },

  tableHeader: {
    color: "#ffffff",
    fontWeight: "bold",
    padding: "10px",
  },

  tableCell: {
    color: "#e2e8f0",
    padding: "10px",
  },

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
  },

  actionButton: {
    padding: "10px 18px",
    background: "rgba(56, 189, 248, 0.2)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    borderRadius: "8px",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s ease",
    fontSize: "14px",
  },

  result: {
    marginTop: "20px",
    padding: "20px",
    background: "rgba(15, 23, 42, 0.9)",
    color: "#56ccf2",
    borderRadius: "12px",
    whiteSpace: "pre-wrap",
    fontSize: "14px",
    border: "1px solid rgba(56, 189, 248, 0.2)",
    boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.3)",
    fontFamily: "monospace",
  },

  history: {
    padding: "20px 0",
    borderBottom: "1px solid rgba(56, 189, 248, 0.2)",
  },

  historyTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  muted: {
    color: "#94a3b8",
    fontSize: "13px",
  },
};

export default Dashboard;
=======
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageModel from "./ImageModel";
import AudioModel from "./AudioModel";
import PoseModel from "./PoseModel";

type Lib = "Pandas" | "NumPy";

type CsvData = {
  key: string;
  name: string;
  columns: string[];
  data: string[][];
  result?: string;
};

type History = {
  key: string;
  lib: Lib;
  operation: string;
  file: string;
  time: string;
  result: string;
};

const Dashboard = (): React.ReactElement => {
  const [section, setSection] = useState<"pandas" | "numpy" | "reports" | "imagen" | "audio" | "postura">("pandas");
  const [files, setFiles] = useState<CsvData[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const parse = (text: string): string[][] =>
    text
      .trim()
      .split(/\r?\n/)
      .map(line =>
        line
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map(value => value.replace(/^"|"$/g, "").trim())
      );

  const loadFile = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = event => {
      const content = event.target?.result;

      if (typeof content !== "string") return;

      const matrix = parse(content);
      if (!matrix.length) return;

      setFiles(current => [
        {
          key: crypto.randomUUID(),
          name: file.name,
          columns: matrix[0],
          data: matrix.slice(1),
        },
        ...current,
      ]);
    };

    reader.readAsText(file);
  };

  const chooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    loadFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const dropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const updateResult = (key: string, result: string) => {
    setFiles(current =>
      current.map(file =>
        file.key === key ? { ...file, result } : file
      )
    );
  };

  const saveHistory = (
    lib: Lib,
    operation: string,
    file: CsvData,
    result: string
  ) => {
    setHistory(current => [
      {
        key: crypto.randomUUID(),
        lib,
        operation,
        file: file.name,
        time: new Date().toLocaleTimeString(),
        result,
      },
      ...current,
    ]);
  };

  const getFile = (key: string) => files.find(file => file.key === key);

  const describe = (key: string) => {
    const file = getFile(key);
    if (!file) return;

    const result =
      `DataFrame\n` +
      `Filas: ${file.data.length}\n` +
      `Columnas: ${file.columns.length}\n` +
      `Campos: ${file.columns.join(", ")}`;

    updateResult(key, result);
    saveHistory("Pandas", ".describe()", file, result);
  };

  const head = (key: string) => {
    const file = getFile(key);
    if (!file) return;

    const result = file.data
      .slice(0, 5)
      .map(row => row.join(" | "))
      .join("\n");

    updateResult(key, `Primeros registros:\n${result}`);
    saveHistory("Pandas", ".head()", file, result);
  };

  const statistics = (key: string) => {
    const file = getFile(key);
    if (!file) return;

    const index = file.columns.findIndex((_, i) =>
      file.data.some(row => row[i] !== "" && !isNaN(Number(row[i])))
    );

    if (index < 0) {
      const result = "No existen datos numéricos.";
      updateResult(key, result);
      return;
    }

    const values = file.data
      .map(row => Number(row[index]))
      .filter(value => !isNaN(value));

    const average =
      values.reduce((sum, value) => sum + value, 0) / values.length;

    const result =
      `Columna: ${file.columns[index]}\n` +
      `Promedio: ${average.toFixed(2)}\n` +
      `Máximo: ${Math.max(...values)}\n` +
      `Mínimo: ${Math.min(...values)}`;

    updateResult(key, result);
    saveHistory("NumPy", "Estadísticas", file, result);
  };

  const makeArray = (key: string) => {
    const file = getFile(key);
    if (!file) return;

    const result =
      `ndarray creado\n` +
      `Dimensiones: ${file.data.length} x ${file.columns.length}\n` +
      `Elementos: ${file.data.length * file.columns.length}`;

    updateResult(key, result);
    saveHistory("NumPy", "Crear ndarray", file, result);
  };

  const remove = (key: string) => {
    setFiles(current => current.filter(file => file.key !== key));
  };

  const changeSection = (value: "pandas" | "numpy" | "reports" | "imagen" | "audio" | "postura") => {
    setSection(value);
    setFiles(current => current.map(file => ({ ...file, result: undefined })));
  };
  const navigate = useNavigate();

  const menuItems: { key: typeof section; label: string }[] = [
    { key: "pandas", label: "Pandas" },
    { key: "numpy", label: "NumPy" },
    { key: "reports", label: "Reportes" },
    { key: "imagen", label: "Imagen" },
    { key: "audio", label: "Audio" },
    { key: "postura", label: "Postura" },
  ];

  return (
    <div className="dash-shell">
      {/* MENÚ LATERAL */}
      <aside className="dash-sidebar">
        <div className="dash-logo">DASH<span>BOARD</span></div>

        {menuItems.map((item) => (
          <button
            key={item.key}
            className={section === item.key ? "dash-nav-btn is-active" : "dash-nav-btn"}
            onClick={() => changeSection(item.key)}
          >
            {item.label}
          </button>
        ))}
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="dash-content">

        {/* ================= PANDAS / NUMPY ================= */}
        {(section === "pandas" || section === "numpy") && (
          <>
            <div className="dash-toolbar">
              <input
                ref={input}
                type="file"
                accept=".csv"
                hidden
                onChange={chooseFile}
              />

              <div
                className={dragging ? "dash-drop is-dragging" : "dash-drop"}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={dropFile}
                onClick={() => input.current?.click()}
              >
                Suelta aquí tu archivo CSV
              </div>

              <button
                className="dash-upload-btn"
                onClick={() => input.current?.click()}
              >
                + Cargar CSV
              </button>

              <button
                className="dash-back-btn"
                onClick={() => navigate(-1)}
              >
                ← Regresar
              </button>
            </div>

            {!files.length && (
              <div className="dash-empty">
                <h2>No hay archivos</h2>
                <p>Selecciona un CSV para comenzar a trabajar.</p>
              </div>
            )}

            {files.map((file) => (
              <section key={file.key} className="dash-card">

                <header className="dash-card-header">
                  <div>
                    <h2>
                      {section === "pandas" ? "Pandas" : "NumPy"}
                    </h2>

                    <span>{file.name}</span>
                  </div>

                  <button
                    className="dash-remove-btn"
                    onClick={() => remove(file.key)}
                  >
                    Eliminar
                  </button>
                </header>

                {/* TABLA */}
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        {file.columns.map((column) => (
                          <th key={column}>
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {file.data.slice(0, 10).map((row, index) => (
                        <tr key={index}>
                          {file.columns.map((column, columnIndex) => (
                            <td key={column}>
                              {row[columnIndex] ?? ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* BOTONES */}
                <div className="dash-actions">

                  {section === "pandas" ? (
                    <>
                      <button
                        className="dash-action-btn"
                        onClick={() => describe(file.key)}
                      >
                        Resumen
                      </button>

                      <button
                        className="dash-action-btn"
                        onClick={() => head(file.key)}
                      >
                        Primeros datos
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="dash-action-btn"
                        onClick={() => statistics(file.key)}
                      >
                        Estadísticas
                      </button>

                      <button
                        className="dash-action-btn"
                        onClick={() => makeArray(file.key)}
                      >
                        Crear Array
                      </button>
                    </>
                  )}

                </div>

                {/* RESULTADO */}
                {file.result && (
                  <pre className="dash-result">
                    {file.result}
                  </pre>
                )}

              </section>
            ))}
          </>
        )}

        {/* ================= REPORTES ================= */}
        {section === "reports" && (
          <section className="dash-card">
            <h1>Historial de operaciones</h1>

            {!history.length ? (
              <p className="dash-muted">
                Todavía no hay operaciones realizadas.
              </p>
            ) : (
              history.map((item) => (
                <article key={item.key} className="dash-history">
                  <div className="dash-history-top">
                    <strong>
                      {item.lib} · {item.operation}
                    </strong>

                    <small>{item.time}</small>
                  </div>

                  <span>{item.file}</span>

                  <pre className="dash-result">
                    {item.result}
                  </pre>
                </article>
              ))
            )}
          </section>
        )}

        {/* ================= IMAGEN ================= */}
        {section === "imagen" && (
          <section className="dash-card">
            <ImageModel />

            <div style={{ marginTop: "25px" }}>
              <button
                className="dash-back-btn"
                onClick={() => navigate(-1)}
              >
                ← Regresar
              </button>
            </div>
          </section>
        )}

        {/* ================= AUDIO ================= */}
        {section === "audio" && (
          <section className="dash-card">
            <AudioModel />

            <div style={{ marginTop: "25px" }}>
              <button
                className="dash-back-btn"
                onClick={() => navigate(-1)}
              >
                ← Regresar
              </button>
            </div>
          </section>
        )}

        {/* ================= POSTURA ================= */}
        {section === "postura" && (
          <section className="dash-card">
            <PoseModel />

            <div style={{ marginTop: "25px" }}>
              <button
                className="dash-back-btn"
                onClick={() => navigate(-1)}
              >
                ← Regresar
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
>>>>>>> master
