import { Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";

interface IProps {
}

  // http://recharts.org/en-US/examples/SimpleBarChart
export class TabSplit extends React.PureComponent<IProps, any> {

    public render() {
        return (
            <Tabs id="TabsExample" >
                <Tab id="ng" title="Angular" panel={<div>hi</div>} />
                <Tab id="mb" title="Ember" panel={<div>hi2</div>} panelClassName="ember-panel" />
            </Tabs>
        )
    }

}