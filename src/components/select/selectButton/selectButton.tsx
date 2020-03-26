/**
 * External
 */
import { Button, Classes, IButtonProps } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import * as classNames from "classnames";
import * as React from "react";

export class SelectButton extends React.PureComponent<IButtonProps, {}> {

    public render() {
        return (
            <Button
                {...this.props}
                icon={IconNames.EXPAND_ALL}
                className={classNames(Classes.FILL, "select-button")}
            />
        );
    }

}
