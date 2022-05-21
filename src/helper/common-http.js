import axios from 'axios';
export default axios.create({
    baseURL: `${process.env.BACKEND_URI}/api/v1`,
    headers: {
        'Content-Type': 'application/json'
    }
});