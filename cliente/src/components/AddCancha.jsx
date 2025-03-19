import React, { useState, useContext } from "react";
import { toast } from 'react-toastify'; // Moved import for consistency
import { canchasAPI } from '../services/api'; 
import { CanchasContext } from "../context/contextCanchas"; // Import the context


function AddCancha() {
  const [nombre, setNombre] = useState("");
  const [locacion, setLocacion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const { setCanchas, notify } = useContext(CanchasContext); // Get setCanchas and notify from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       // setLoading(true);

              const canchasResponse = await canchasAPI.create({
                nombre,
                locacion,
                direccion,
                descripcion
              });

      setCanchas(canchasResponse.data); // Update the context with the new list

      // Notify user of successful addition
      notify("Cancha creada"); // Updated message

      // Clear input fields
      setNombre("");
      setLocacion("");
      setDireccion("");
      setDescripcion("");
    } catch (error) {
      toast.error("Error al añadir cancha."); // User-friendly error message using toast

    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" onSubmit={handleSubmit}>

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
                value={locacion}
                onChange={(e) => {
                  const value = e.target.value;
                  setLocacion(value);
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
              <button className="btn btn-primary w-100" type="submit">Añadir</button>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCancha;
