import React from "react";
import ErrorBoundary from "./components/ErrorBoundary"; // Import ErrorBoundary

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DetallesCancha from "./routes/DetallesCancha";
import Actualizar from "./routes/Actualizar";
import Home from "./routes/Home";
import { CanchasContextProvider } from "./context/contextCanchas";

const App = () => {
  return (
    <CanchasContextProvider>

    <Router>
      <div className="container">
        <ErrorBoundary>
            <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/canchas/:id/actualizar" element={<Actualizar/>} />
          <Route path="/canchas/:id" element={<DetallesCancha/>} />
            </Routes>
        </ErrorBoundary>

      </div>
    </Router>

    </CanchasContextProvider>
   
  );
};

export default App;
