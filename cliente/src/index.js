import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
document.addEventListener('DOMContentLoaded', function() {
    // Realiza la solicitud al servidor en el endpoint definido
    fetch('http://localhost:3000/api/metricas')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then(data => {
        const resultadosDiv = document.getElementById('resultados');
        // Se muestra la información de forma formateada
        resultadosDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      })
      .catch(error => {
        console.error('Error en fetch:', error);
        const resultadosDiv = document.getElementById('resultados');
        resultadosDiv.innerHTML = `<p>Error al cargar las métricas.</p>`;
      });
  });
  