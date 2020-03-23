import * as React from "react";
import * as ReactDOM from "react-dom";
import { Fetcher, ScrapeResult } from "./data-fetching/fetcher";
import { LoadingView } from "./components/loading-views/loader";
import { GraphView } from "./components/core/graph";
import './index.scss';

class RootLoadingView extends React.PureComponent<any, any> {

    public render() {
        return (
            <LoadingView
                promise={new Fetcher().GetData()}
                renderCallback={this.renderCallBack}
            />
        )
    }

    public renderCallBack = (scrapeResult: ScrapeResult) => {
        return <GraphView
            scrapeResult={scrapeResult}
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
