import * as React from "react";
import { ScrapeResult } from "../../data-fetching/fetcher";
import { XAxis, LineChart, BarChart, YAxis, CartesianGrid, Line, Tooltip, Bar } from "recharts";


interface IProps {
    scrapeResult: ScrapeResult
}

  // http://recharts.org/en-US/examples/SimpleBarChart
export class GraphView extends React.PureComponent<IProps, any> {
    public render() {
        const subsetOfData = this.props.scrapeResult.rowResults.map(singleRow => {
            return {
                name: singleRow.state,
                total : singleRow.total,
            }
        })
        return (
            <div className="ar-root-div">
                <BarChart
                    width={1500}
                    height={800}
                    data={subsetOfData}
                    margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
            </div>
        )
    }
}
