import * as React from "react";
import * as ReactDOM from "react-dom";
import { Fetcher, ScrapeResult } from "./data-fetching/fetcher";
import { XAxis, LineChart, BarChart, YAxis, CartesianGrid, Line, Tooltip, Bar } from "recharts";

interface IState {
    scrapeResult: ScrapeResult
}

interface IProps {
    scrapeResult: ScrapeResult
}
const data = [
    {
      name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
    },
    {
      name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
    },
    {
      name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
    },
    {
      name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
    },
    {
      name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
    },
    {
      name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
    },
    {
      name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
    },
  ];

class RootView extends React.PureComponent<IProps, any> {
    public render() {
        const subsetOfData = this.props.scrapeResult.rowResults.map(singleRow => {
            return {
                name: singleRow.state,
                total : singleRow.total,
            }
        })
        console.log(subsetOfData)
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

class RootLoadingView extends React.PureComponent<any, IState> {

    public state: IState = {
        scrapeResult: null
    };

    public componentDidMount() {
        const fetcher = new Fetcher()
        const a = fetcher.GetData()
        a.then(scrapeResult => {
            this.setState({scrapeResult})
        })
    }

    public render() {
        console.log(this.state)
        if (this.state.scrapeResult == null) {
            return (
                    <div className="ar-root-div">
                        hi
                    </div>
            );
        }
        return <RootView
            scrapeResult={this.state.scrapeResult}
        />
    }
}

export function renderApp(appElement: Element) {
    ReactDOM.render(<RootLoadingView />, appElement);
}

const app = document.getElementsByTagName("body")[0];
if (app != null) {
    renderApp(app);
}
