import axios from 'axios';
import URI from '../helper/uri-list.js';

export default axios.create({
    baseURL: `${URI.baseUri}/api/v1`,
    headers: {
        'Content-Type': 'application/json'
    }
});