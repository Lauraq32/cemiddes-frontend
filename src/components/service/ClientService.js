import axios from 'axios';

export class ClientService {

    getClients() {
        return axios.get('assets/demo/data/clients.json').then(res => res.data.data);
    }
}