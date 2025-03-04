import React, { useState, useContext } from "react";
import { CanchasContext } from "../context/contextCanchas"; // Import the context
import BuscaCanchas from "../apis/BuscaCanchas";

function AddCancha() {
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const { setCanchas, notify } = useContext(CanchasContext); // Get setCanchas and notify from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await BuscaCanchas.post("/", {
        nombre,
        ubicacion,
        direccion,
        descripcion,
      });
      console.log("API Response:", response);

      // Refresh the list of canchas after adding a new one
      const newResponse = await BuscaCanchas.get("/");
      setCanchas(newResponse.data.data.Canchas); // Update the context with the new list

      // Notify user of successful addition
      notify("Cancha añadida");
    } catch (error) {
      alert("Error al añadir cancha."); // User-friendly error message

    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 border rounded shadow bg-light">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="col mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre de la cancha"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="col mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Ubicación de la cancha" 
                value = {ubicacion}
                required
                onChange={(e) => {
                  const value = e.target.value;
                  setUbicacion(value);
                }}
              />
            </div>
            <div className="col mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Dirección de la cancha"
                value={direccion}
                required
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>
            <div className="col mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Descripción de la cancha"
                value={descripcion}
                required
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
            <div className="col text-center">
              <button className="btn btn-primary w-100">Añadir</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCancha;
