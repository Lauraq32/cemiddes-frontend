import axios from 'axios';

// export class ProductService {

//     getProducts() {
//         return axios.get('assets/demo/data/products.json').then(res => res.data.data);
//     }
// } 

export default axios.create({
    baseURL: "http://localhost:8080/api/productos",
    Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MjU1YmFmMDI2ZTljZGRkYmU0ZTczNTciLCJpYXQiOjE2NDk4MTEwNzIsImV4cCI6MTY0OTg5NzQ3Mn0.kWqWecwiLNi3pVhuYWfitaInmJKN4jRQOVqYOOXAKq0"
})