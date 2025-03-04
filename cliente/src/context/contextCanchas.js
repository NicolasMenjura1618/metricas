import { useState, createContext, useEffect } from "react"; // Import useEffect for notifications

export const CanchasContext = createContext({
  notify: () => {}, // Default notify function
});

export const CanchasContextProvider = ({ children }) => {
  const [canchas, setCanchas] = useState([]);
  const [canchaSelect, setSelectCancha] = useState(null); // State for current can

  const notify = (message) => {
    // Logic to display notification (e.g., alert, toast, etc.)
    // Implement a more user-friendly notification system here
    console.log(message); // Placeholder for a more sophisticated notification system

  };

  useEffect(() => {
    // Notify when canchas are updated
    if (canchas.length > 0) {
    notify("Canchas have been updated!"); // Notify user of updates
    // Consider using a toast notification or modal for better user experience

    }
  }, [canchas]);

  return (
    <CanchasContext.Provider value={{ canchas, setCanchas, notify ,canchaSelect, setSelectCancha}}>
      {children}
    </CanchasContext.Provider>
  );
};
