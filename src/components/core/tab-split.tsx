import { Tab, Tabs, TabId } from "@blueprintjs/core";
import * as React from "react";
import { ScrapeResult } from "../../data-fetching/fetcher";
import { GraphView } from "./graph";

interface IProps {
    scrapeResult: ScrapeResult
}

interface IState {
    activeRegion: TabId
}
  // http://recharts.org/en-US/examples/SimpleBarChart
export class TabSplit extends React.PureComponent<IProps, IState> {

    public state: IState = {
        activeRegion: "",
    };

    public render() {
        const sortedRegions = Object.keys(this.props.scrapeResult).sort()
        console.log(this.state)
        return (
            <div className="cv-tabsplit">
                <div className="cv-tabsplit-title">
                    View the spread coronavirus over time
                </div>
                <Tabs id="TabsExample" onChange={this.onChange} selectedTabId={this.getActiveRegion(sortedRegions)} >
                    {sortedRegions.map(r => this.getTab(r))}
                </Tabs>
            </div>
        )
    }
    private onChange = (activeRegion: TabId) =>  {
        this.setState({activeRegion})
    }

    private getTab(region: string): JSX.Element {
        return <Tab id={region} title={region.toUpperCase()} panel={this.wrapTab(this.getGraphView(region))} />
    }

    private getActiveRegion(sortedRegions: Array<string>){
        if (this.state.activeRegion == "") {
            return sortedRegions[0]
        }
        return this.state.activeRegion;
    }

    private wrapTab(el: JSX.Element) {
        return (
            <div className="cv-tabsplit-wrapper">
                {el}
            </div>
        );
    }

    private getGraphView(activeRegion: string) {
        return (
            <GraphView
                dateMap={this.props.scrapeResult[activeRegion]}
            />
        );
    }

}