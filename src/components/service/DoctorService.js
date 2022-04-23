import axios from 'axios';

export class DoctorService {

    getDoctors() {
        // return axios.get('assets/demo/data/doctors.json').then(res => res.data.data);
        return axios.get('http://localhost:8080/api/doctoras/information/:doctora').then(res => res.data.data);

    }
}