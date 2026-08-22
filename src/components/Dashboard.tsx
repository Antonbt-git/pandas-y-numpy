import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [section, setSection] = useState<"pandas" | "numpy" | "reports">("pandas");
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

  const changeSection = (value: "pandas" | "numpy" | "reports") => {
    setSection(value);
    setFiles(current => current.map(file => ({ ...file, result: undefined })));
  };
  const navigate = useNavigate();

  return (
    <div style={css.app}>

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
      </aside>

      <main style={css.content}>

        {section !== "reports" && (
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
                  borderColor: dragging ? "#2563eb" : "#cbd5e1",
                  backgroundColor: dragging ? "#eff6ff" : "#fff",
                }}
                onDragOver={e => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={dropFile}
                onClick={() => input.current?.click()}
              >
                Suelta aquí tu archivo CSV
              </div>

              <button style={css.upload} onClick={() => input.current?.click()}>
                + Cargar CSV
              </button>

              <button style={css.back} onClick={() => navigate(-1)}>
                ← Regresar
              </button>
            </div>

            {!files.length && (
              <div style={css.empty}>
                <h2>No hay archivos</h2>
                <p>Selecciona un CSV para comenzar a trabajar.</p>
              </div>
            )}

            {files.map(file => (
              <section key={file.key} style={css.card}>

                <header style={css.cardHeader}>
                  <div>
                    <h2>{section === "pandas" ? "Pandas" : "NumPy"}</h2>
                    <span>{file.name}</span>
                  </div>

                  <button
                    style={css.remove}
                    onClick={() => remove(file.key)}
                  >
                    Eliminar
                  </button>
                </header>

                <div style={css.tableBox}>
                  <table style={css.table}>
                    <thead>
                      <tr>
                        {file.columns.map(column => (
                          <th key={column}>{column}</th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {file.data.slice(0, 10).map((row, index) => (
                        <tr key={index}>
                          {file.columns.map((_, column) => (
                            <td key={column}>{row[column] || ""}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={css.actions}>
                  {section === "pandas" ? (
                    <>
                      <button onClick={() => describe(file.key)}>
                        Resumen
                      </button>

                      <button onClick={() => head(file.key)}>
                        Primeros datos
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => statistics(file.key)}>
                        Estadísticas
                      </button>

                      <button onClick={() => makeArray(file.key)}>
                        Crear Array
                      </button>
                    </>
                  )}
                </div>

                {file.result && (
                  <pre style={css.result}>{file.result}</pre>
                )}
              </section>
            ))}
          </>
        )}

        {section === "reports" && (
          <section style={css.card}>
            <h1>Historial</h1>

            {!history.length && (
              <p style={css.muted}>Todavía no hay operaciones realizadas.</p>
            )}

            {history.map(item => (
              <article key={item.key} style={css.history}>
                <div style={css.historyTop}>
                  <strong>
                    {item.lib} · {item.operation}
                  </strong>

                  <small>{item.time}</small>
                </div>

                <span>{item.file}</span>

                <pre style={css.result}>{item.result}</pre>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

const css: Record<string, React.CSSProperties> = {
  back: {
  marginBottom: "20px",
  padding: "9px 16px",
  background: "#fff",
  color: "#475569",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
  },


  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#f1f5f9",
    color: "#1e293b",
    fontFamily: "Arial, sans-serif",
  },

  menu: {
    width: "220px",
    padding: "25px 15px",
    background: "#172033",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  logo: {
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    padding: "10px",
    marginBottom: "20px",
  },

  menuButton: {
    padding: "13px",
    textAlign: "left",
    border: 0,
    borderRadius: "8px",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "14px",
  },

  selected: {
    padding: "13px",
    textAlign: "left",
    border: 0,
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  content: {
    flex: 1,
    padding: "30px",
    maxWidth: "1400px",
  },

  toolbar: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
  },

  upload: {
    padding: "12px 20px",
    border: 0,
    borderRadius: "8px",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  drop: {
    flex: 1,
    padding: "11px",
    border: "2px dashed #cbd5e1",
    borderRadius: "8px",
    textAlign: "center",
    color: "#64748b",
    cursor: "pointer",
  },

  empty: {
    padding: "70px",
    textAlign: "center",
    background: "#fff",
    borderRadius: "12px",
  },

  card: {
    padding: "22px",
    marginBottom: "20px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(15,23,42,.06)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  remove: {
    padding: "8px 12px",
    border: "1px solid #fecaca",
    borderRadius: "7px",
    background: "#fef2f2",
    color: "#dc2626",
    cursor: "pointer",
  },

  tableBox: {
    overflow: "auto",
    maxHeight: "320px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "18px",
  },

  result: {
    marginTop: "15px",
    padding: "15px",
    background: "#0f172a",
    color: "#67e8f9",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
    fontSize: "13px",
  },

  history: {
    padding: "15px 0",
    borderBottom: "1px solid #e2e8f0",
  },

  historyTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "7px",
  },

  muted: {
    color: "#64748b",
  },
};

export default Dashboard;