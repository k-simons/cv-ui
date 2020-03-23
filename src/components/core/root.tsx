import * as React from "react";
import { ScrapeResult } from "../../data-fetching/fetcher";
import { IconNames } from "@blueprintjs/icons";
import { Classes, Menu, MenuItem } from "@blueprintjs/core";
import { TabSplit } from "./tab-split";

interface IProps {
    scrapeResult: ScrapeResult
}

const allSideTabs: Array<SideTab> = ["Over Time", "TBD"]

type SideTab = "Over Time" | "TBD"

interface IState {
    activeMain: SideTab
}

  // http://recharts.org/en-US/examples/SimpleBarChart
export class RootView extends React.PureComponent<IProps, IState> {

    public state: IState = {
        activeMain: "Over Time",
    };

    public render() {
        return (
            <div className="cv-all-region">
                <div className="cv-all-region-holder">
                    <div className="cv-side-region">
                        <Menu className="cv-side-region-menu">
                            {allSideTabs.map(tab => this.singleSideTab(tab))}
                        </Menu>
                    </div>
                    <div className="cv-main-region">
                        {this.getMain()}
                    </div>
                </div>
            </div>
        )
    }

    private singleSideTab = (tab: SideTab): JSX.Element => {
        return (
            <MenuItem
                onClick={this.onClick(tab)}
                icon={this.getIconName(tab)}
                text={tab}
            />
        );
    }

    private getIconName(tab: SideTab) {
        if (tab === "Over Time") {
            return IconNames.TIMELINE_LINE_CHART
        } else if (tab === "TBD") {
            return IconNames.MAP
        } else {
            return assertNever(tab);
        }
    }

    private onClick = (activeMain: SideTab) => () => {
        this.setState({activeMain})
    }

    private getMain() {
        if (this.state.activeMain === "Over Time") {
            return <TabSplit/>;
        }
        return null
    }

}

function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
  }