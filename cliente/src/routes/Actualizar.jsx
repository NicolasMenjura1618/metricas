import React from 'react'
import ActualizarCancha from '../components/ActualizarCancha'
import ErrorBoundary from '../components/ErrorBoundary' // Import ErrorBoundary


const Actualizar = () => {
  return (
    <div>
      
    <ErrorBoundary>
        <ActualizarCancha/>
    </ErrorBoundary>

    </div>
  )
}

export default Actualizar
