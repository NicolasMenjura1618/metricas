import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import BuscaCanchas from "../apis/BuscaCanchas"; // Ensure this import is present
import { CanchasContext } from "../context/contextCanchas"; // Import the context

const ListaCancha = () => {
  const { canchas, setCanchas } = useContext(CanchasContext);
  const navigate = useNavigate(); // Use navigate for navigation

  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        const { data } = await BuscaCanchas.get("/"); 
        console.log("API Response:", data);
        setCanchas(data.data.Canchas); 
      } catch (error) {
        console.error("Error al obtener canchas:", error);
      }
    };

    fetchCanchas();
  }, [setCanchas]); 

  const { notify } = useContext(CanchasContext); // Get notify from context

const handleDelete = async (e, id) => { 

    e.stopPropagation();
    try {
      const resultado  = await BuscaCanchas.delete(`/${id}`); 
      setCanchas(canchas.filter((cancha) => cancha.id !== id)); // Update state after successful deletion
      notify("Cancha deleted successfully!"); // Notify user of successful deletion
      navigate("/"); // Redirect to the home page after deletion
      alert("Cancha deleted successfully!"); // Alert user of successful deletion
      console.log("Deleting cancha with:", resultado);
      console.log("Deleting cancha with ID:", id);
    } catch (error) {
      console.error("Errorsazzzo al eliminar la cancha:", error);
    }
  };

  const handleUpdate = (e, id) => {

    navigate(`/canchas/${id}/actualizar`);
  };

  const handleSelect = (id) => {
    navigate(`/canchas/${id}`); // Use backticks for template string
  };

  return ( 
    <div className="list-group">
      <table className="table table-hover table-dark">
        <thead>
          <tr className="bg-primary">
            <th scope="col">Nombre</th>
            <th scope="col">Ubicación</th>
            <th scope="col">Dirección</th>
            <th scope="col">Descripción</th>
            <th scope="col">Ranking</th>
            <th scope="col">Editar</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {canchas && canchas.length > 0 ? (
            canchas.map((cancha) => (
              <tr onClick={() => handleSelect(cancha.id)} key={cancha.id}>
                <td>{cancha.nombre}</td>
                <td>{cancha.locacion}</td>
                <td>{cancha.direccion}</td>
                <td>{cancha.descripcion}</td>
                <td>rank</td>
                <td>
                  <button className="btn btn-warning" onClick={(e) => handleUpdate(e, cancha.id)}>Actualizar</button>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={(e) => handleDelete(e,cancha.id)}>Borrar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No hay canchas disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaCancha;
