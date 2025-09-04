import axios from "axios";

const NetworkInstance = () => {
  return axios.create({
    baseURL: "https://ticketingplatform-m9on.onrender.com/api",
  });
};

export default NetworkInstance;
