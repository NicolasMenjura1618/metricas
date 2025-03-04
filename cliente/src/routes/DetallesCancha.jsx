import React, { useContext, useEffect, useState } from 'react';
import AddReview from '../components/AddReview'; // Import AddReview
import Reviews from '../components/Reviews'; // Import Reviews
import BuscaCanchas from '../apis/BuscaCanchas'; // Import BuscaCanchas
import { useParams } from 'react-router-dom'; // Import useParams
import { CanchasContext } from '../context/contextCanchas'; // Import CanchasContext

const DetallesCancha = () => {
  const { id } = useParams();
  const { canchaSelect, setSelectCancha } = useContext(CanchasContext);
  const [error, setError] = useState(null); // State to manage error messages

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BuscaCanchas.get(`/${id}`);
        const cancha = response.data; // Access the Cancha object from the nested data
        setSelectCancha(cancha); // Update the selected cancha
      } catch (error) {
        setError("Error al obtener los datos de la cancha"); // Set error message
      }
    };

    fetchData();
  }, [id, setSelectCancha]);

  return ( 
    <div>
      {error && <div className="error">{error}</div>} {/* Display error message */}
      {canchaSelect && ( 
        <>
          <h1>{canchaSelect.name}</h1> {/* Display the name of the cancha */}
          <AddReview cancha={canchaSelect} /> {/* Show only one AddReview component */}
          <Reviews reviews={canchaSelect.reviews} /> {/* Show only one Reviews component */}
        </>
      )}
    </div>
  );
}

export default DetallesCancha;
