import { Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";
import { ScrapeResult } from "../../data-fetching/fetcher";
import { GraphView } from "./graph";

interface IProps {
    scrapeResult: ScrapeResult
}

  // http://recharts.org/en-US/examples/SimpleBarChart
export class TabSplit extends React.PureComponent<IProps, any> {

    public render() {
        return (
            <div className="cv-tabsplit">
                <div className="cv-tabsplit-title">
                    View the spread coronavirus over time
                </div>
                <Tabs id="TabsExample" >
                    <Tab id="ng" title="World" panel={this.wrapTab(this.getGraphView())} />
                    <Tab id="mb" title="United States" panel={this.wrapTab(<div>a</div>)} panelClassName="ember-panel" />
                </Tabs>
            </div>
        )
    }

    private wrapTab(el: JSX.Element) {
        return (
            <div className="cv-tabsplit-wrapper">
                {el}
            </div>
        );
    }

    private getGraphView() {
        return (
            <GraphView
                scrapeResult={this.props.scrapeResult}
            />
        );
    }

}