import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import BuscaCanchas from "../apis/BuscaCanchas";

const UpdateCancha = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchData = async () => {
      try {
        const response = await BuscaCanchas.get(`/${id}`);
        console.log(response.data);
        const cancha = response.data.cancha; // Access the Cancha object

        console.log("Fetched cancha data:", cancha);

        setNombre(cancha?.nombre || "");
        setLocacion(cancha?.locacion || "");
        setDireccion(cancha?.direccion || "");
        setDescripcion(cancha?.descripcion || "");
      } catch (error) {
        console.error("Error al obtener los datos de la cancha", error);
      }
    };

    fetchData();
  }, [id, nombre, locacion, direccion, descripcion]);

  // Función para actualizar la cancha
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await BuscaCanchas.put(`/${id}`, {
        nombre,
        locacion,
        direccion,
        descripcion,
      });
      navigate("/");
    } catch (error) {
      console.error("Error al actualizar la cancha", error);
    }
  };

  return (
    <div>
      <form action="">
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
        <button type="submit" onClick={handleSubmit} className="btn btn-primary">
          Actualizar Cancha
        </button>
      </form>
    </div>
  );
};

export default UpdateCancha;
