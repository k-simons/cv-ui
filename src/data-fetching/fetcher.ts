

export interface ScrapeResult {
    scrapeTime: string;
    rowResults: Array<RowResult>;
}

export interface RowResult {
    state: string;
    total: number;
    newCases: number;
    totalDeaths: number;
    newDeaths: number;
    totalRecovered: number;
    activeCases: number;
}

export class Fetcher {

    public async GetData() {
        const response = await fetch(
            "http://localhost:8000/barJson"
        );
        const body: ScrapeResult = await response.json();
        console.log(body)
        return body
    }

}