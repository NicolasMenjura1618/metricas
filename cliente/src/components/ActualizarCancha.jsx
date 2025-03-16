import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; // Moved import for consistency
import BuscaCanchas from "../apis/BuscaCanchas";

const ActualizarCancha = () => {
  const { id } = useParams();
  console.log("Fetching data for cancha with ID:", id);
  
  let navigate = useNavigate();

  // Estados para las variables (similares al de restaurantes)
  const [nombre, setNombre] = useState("");
  const [locacion, setLocacion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Obtención de datos en el useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BuscaCanchas.get(`/${id}`);
        console.log("Response data cancha:", response.data.data.Cancha);
  
        const CanchaX = response.data.data.Cancha; // Extrae la cancha correctamente
        setNombre(CanchaX?.nombre || "");
        setLocacion(CanchaX?.locacion || ""); 
        setDireccion(CanchaX?.direccion || ""); 
        setDescripcion(CanchaX?.descripcion || "");

      } catch (error) {
        console.error("Error al obtener los datos de la cancha", error);
        toast.error("Error al obtener los datos de la cancha."); // User-friendly error message
      }
    };

    fetchData();
  }, [id]);

  // Función para actualizar la cancha
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      console.log("Token value:", token); // Log the token value for debugging

      await BuscaCanchas.put(`/${id}`, {
        nombre,
        locacion,
        direccion,
        descripcion,
      }, {
          headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request
          },
      });
      toast.success("Cancha actualizada exitosamente."); // Notify user of successful update
      navigate("/");
    } catch (error) {
      console.error("Error al actualizar la cancha", error);
      toast.error("Error al actualizar la cancha."); // User-friendly error message using toast
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            id="nombre"
            className="form-control"
            type="text"
          />
        </div>
        <div className="form-group">
          <label htmlFor="locacion">Locación</label>
          <input
            value={locacion}
            onChange={(e) => setLocacion(e.target.value)}
            id="locacion"
            className="form-control"
            type="text"
          />
        </div>
        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            id="direccion"
            className="form-control"
            type="text"
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            rows="4"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            id="descripcion"
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Actualizar Cancha
        </button>
      </form>
    </div>
  );
};

export default ActualizarCancha;
