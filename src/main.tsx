import * as React from "react";
import * as ReactDOM from "react-dom";

class RootView extends React.PureComponent<any> {

    public render() {
        return (
                <div className="ar-root-div">
                    hi
                </div>
        );
    }
}

export function renderApp(appElement: Element) {
    console.log("hi")
    ReactDOM.render(<RootView />, appElement);
}

const app = document.getElementsByTagName("body")[0];
if (app != null) {
    renderApp(app);
}
