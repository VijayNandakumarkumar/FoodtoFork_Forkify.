import axios from "axios";
export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(query) {
        try {
            const res = await axios(
                `https://forkify-api.herokuapp.com/api/search?&q=${this.query}`
            );
            this.result = res;
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }
}