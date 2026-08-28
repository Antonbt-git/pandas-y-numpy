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
