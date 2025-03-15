import axios from "axios";

const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

export default axios.create({
      baseURL: "http://localhost:3000/api/v1/Canchas",
      headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
      }




})
