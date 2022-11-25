import axios from 'axios';

export default axios.create({
  baseURL: "http://51.222.106.58:8000",
  headers: {
    'Content-Type': 'application/json',
  }
});
