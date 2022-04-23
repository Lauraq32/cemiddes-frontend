import axios from 'axios';

export class ReservationService {

    getPatients() {
        return axios.get('assets/demo/data/reservation.json').then(res => res.data.data);
    }
}