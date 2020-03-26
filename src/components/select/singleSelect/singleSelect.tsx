/**
 * External
 */
import { Classes, IButtonProps, IPopoverProps, MenuItem, Position } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { ISelectProps, Select } from "@blueprintjs/select";
import * as React from "react";

/**
 * Local
 */
import { SelectButton } from "../selectButton/selectButton";
/**
 * Do not want to render infinite items because its slow
 * If there are more than this value after sorting, just do not show the item. It will appear after filtering
 */
export const MAX_ITEMS_TO_RENDER = 200;

interface ICommonSelectProps <T> {
    /** Dropdown items */
    items: T[];
    /** Props to be passed down into the Select */
    selectProps?: Partial<ISelectProps<T>>;
    /** Given an item, produce a string for labeling, filtering, and locating. Must be unique */
    itemToString: (item: T) => string;
    /** Props to be passed down into the Button */
    buttonProps?: IButtonProps;
    /** Value selected, may be undefined */
    value?: T;
}

interface ISingleSelectProps <T> extends ICommonSelectProps<T> {
    /** Call back when selected items change, will never be undefined */
    onItemSelect: (item: T) => void;
}

interface ISingleSelectClearableProps <T> extends ICommonSelectProps<T> {
    /** Call back when selected items change, can be undefined */
    onItemSelect: (item: T | undefined) => void;
}

type SingleSelectImplProps<T> = ISingleSelectClearableProps<T> & {
    clearable: boolean;
};

class SingleSelectImpl<T> extends React.PureComponent<SingleSelectImplProps<T>, {}> {

    public static ofType<T>() {
        return SingleSelectImpl as new (props: SingleSelectImplProps<T>) => SingleSelectImpl<T>;
    }

    private TypedSingleSelect = Select.ofType<T>();

    public render() {
        return (
            <this.TypedSingleSelect
                filterable={true}
                itemPredicate={this.itemPredicate}
                itemRenderer={this.itemRenderer}
                items={this.props.items}
                noResults={<MenuItem text="No Results"/>}
                onItemSelect={this.onItemSelect}
                resetOnClose={true}
                resetOnSelect={true}
                {... this.props.selectProps}
                popoverProps={this.getPopoverProps()}
            >
                <SelectButton
                    rightIcon={this.props.clearable === true && this.props.value !== undefined ?
                        IconNames.CROSS : IconNames.BLANK}
                    {... this.props.buttonProps}
                    text={this.getButtonText()}
                    onClick={this.onClick}
                />
            </this.TypedSingleSelect>
        );
    }

    private getPopoverProps(): Partial<IPopoverProps> {
        const passedInProps = this.props.selectProps !== undefined &&
            this.props.selectProps.popoverProps !== undefined ?
            this.props.selectProps.popoverProps : {};
        return {
            position: Position.BOTTOM,
            ...passedInProps,
        };
    }

    private onClick = (event: React.MouseEvent<HTMLElement>) => {
        if ((event.target as any).parentElement.getAttribute("data-icon") === "cross") {
            event.stopPropagation();
            this.props.onItemSelect(undefined);
            return;
        }
    }

    private getButtonText() {
        if (this.props.value !== undefined) {
            return this.props.itemToString(this.props.value);
        }
        if (this.props.buttonProps !== undefined && this.props.buttonProps.text !== undefined) {
            return this.props.buttonProps.text;
        }
        return "Please select a value";
    }

    private itemPredicate = (query: string, item: T) => {
        return this.props.itemToString(item).toLowerCase().includes(query.toLowerCase());
    }

    private itemRenderer = (item: T, itemProps: any) => {
        if (!itemProps.modifiers.matchesPredicate || (
            itemProps.index !== undefined && itemProps.index > MAX_ITEMS_TO_RENDER)) {
            return null;
        }
        return (
            <MenuItem
                className={itemProps.modifiers.active ? Classes.ACTIVE : ""}
                key={itemProps.index}
                onClick={itemProps.handleClick}
                text={this.props.itemToString(item)}
                shouldDismissPopover={false}
            />
        );
    }

    private onItemSelect = (activeItem: T) => {
        this.props.onItemSelect(activeItem);
    }

}

// tslint:disable-next-line:max-classes-per-file
export class SingleSelect<T> extends React.PureComponent<ISingleSelectProps<T>, {}> {

    public static ofType<T>() {
        return SingleSelect as new (props: ISingleSelectProps<T>) => SingleSelect<T>;
    }

    private SingleSelectImpl = SingleSelectImpl.ofType<T>();

    public render() {
        return <this.SingleSelectImpl {... this.props} clearable={false}/>;
    }

}

// tslint:disable-next-line:max-classes-per-file
export class SingleClearableSelect<T> extends React.PureComponent<ISingleSelectClearableProps<T>, {}> {

    public static ofType<T>() {
        return SingleClearableSelect as new (props: ISingleSelectClearableProps<T>) => SingleClearableSelect<T>;
    }

    private SingleSelectImpl = SingleSelectImpl.ofType<T>();

    public render() {
        return <this.SingleSelectImpl {... this.props} clearable={true}/>;
    }

}
