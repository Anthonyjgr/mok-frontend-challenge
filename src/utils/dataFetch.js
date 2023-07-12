import axios from "axios";

export const fetchData = async () => {
  try {
    const response = await axios.get("https://randomuser.me/api/?results=100");
    return response.data.results;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


