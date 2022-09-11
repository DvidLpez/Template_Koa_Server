import fetch from 'node-fetch';

export default class ApiExample {

    private domain: string;
    private apiKey: string;

    constructor() {
        if (!process.env.ENDPOINT || !process.env.APIKEY) {
            throw new Error('ApiExample is not configured, environment variables required.')
        }
        this.domain = process.env.ENDPOINT;
        this.apiKey = process.env.APIKEY;
    }

    /**
     * Example Query
     * @param {string} param1 For example dogs
     * @returns {Promise<any>}
     */
    public async getExampleQuery(param1: string): Promise<any> {
        let response = await fetch(`${this.domain}/path/${param1}?apikey=${this.apiKey}`, {
            method: 'GET'
        });
        return response.json();
    }
}
