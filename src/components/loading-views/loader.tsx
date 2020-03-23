import * as React from "react";

import { Spinner } from "@blueprintjs/core";

interface IProps<T> {
    promise: Promise<T>
    renderCallback(data: T): JSX.Element
}

interface IState<T> {
    data: T
}

export class LoadingView<T> extends React.PureComponent<IProps<T>, any> {

    public state: IState<T> = {
        data: null
    };

    public componentDidMount() {
        this.props.promise.then(data => {
            this.setState({data})
        })
    }

    public render() {
        if (this.state.data == null) {
            return <Spinner/>
        }
        return this.props.renderCallback(this.state.data)
    }
}