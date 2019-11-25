import axios from 'axios';

export class Resource {
    private apiUrl: string = process.env.REACT_APP_API_URL as string;
    private apiKey: string = process.env.REACT_APP_API_KEY as string;

    getAllResource(): Promise<any> {
        return axios.get(`${this.apiUrl}/sources?apiKey=${this.apiKey}`)
    }
    getArticels(id: string): Promise<any> {
        return axios.get(`${this.apiUrl}/articles?source=${id}&apiKey=${this.apiKey}`);
    }
    getSortedArticles(id: string, type: string): Promise<any> {
        return axios.get(`${this.apiUrl}/articles?source=${id}&sortBy=${type}&apiKey=${this.apiKey}`);
    }
}