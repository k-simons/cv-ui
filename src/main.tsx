import * as React from "react";
import * as ReactDOM from "react-dom";
import { Fetcher, ScrapeResult } from "./data-fetching/fetcher";
import { LoadingView } from "./components/loading-views/loader";
import { FocusStyleManager } from "@blueprintjs/core";
import './index.scss';
import { RootView } from "./components/core/root";

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
        return <RootView scrapeResult={scrapeResult}/>
    }
}

export function renderApp(appElement: Element) {
    FocusStyleManager.onlyShowFocusOnTabs();
    ReactDOM.render(<RootLoadingView />, appElement);
}

const app = document.getElementsByTagName("body")[0];
if (app != null) {
    renderApp(app);
}
