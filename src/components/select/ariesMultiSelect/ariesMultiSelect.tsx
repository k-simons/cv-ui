/**
 * External
 */
import { Classes, IPopoverProps, ITagInputProps, MenuItem, Popover, Position } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { IMultiSelectProps, MultiSelect } from "@blueprintjs/select";
import * as classNames from "classnames";
import * as React from "react";

/**
 * Local
 */
import { SelectButton } from "../selectButton/selectButton";
import { MAX_ITEMS_TO_RENDER } from "../singleSelect/singleSelect";

interface IAriesMultiSelectProps <T> {
    /** Dropdown items */
    items: T[];
    /** Call back when selected items change */
    onItemSelect: (newItems: T[]) => void;
    /** Given an item, produce a string for labeling, filtering, and locating. Must be unique */
    itemToString: (item: T) => string;
    /** Values selected */
    values: T[];

    /** If present, will disable the MultiSelect with the text as a label */
    disabledText?: string;
    /** Props to be passed down into the MultiSelect */
    multiSelectProps?: Partial<IMultiSelectProps<T>>;
}

export class AriesMultiSelect<T> extends React.PureComponent<IAriesMultiSelectProps<T>, {}> {

    public static ofType<T>() {
        return AriesMultiSelect as new (props: IAriesMultiSelectProps<T>) => AriesMultiSelect<T>;
    }

    private TypedMultiSelect = MultiSelect.ofType<T>();

    public render() {
        if (this.props.disabledText !== undefined) {
            return (
                <Popover>
                    <SelectButton disabled={true} text={this.props.disabledText}/>
                </Popover>
            );
        }
        return (
            <this.TypedMultiSelect
                itemRenderer={this.itemRenderer}
                itemPredicate={this.itemPredicate}
                items={this.props.items}
                onItemSelect={this.onItemSelect}
                selectedItems={this.props.values}
                noResults={<MenuItem disabled={true} text="No results." />}
                resetOnSelect={true}
                tagRenderer={this.tagRenderer}
                {... this.props.multiSelectProps}
                tagInputProps={this.getTagInputProps()}
                popoverProps={this.getPopoverProps()}
            />

        );
    }

    private getPopoverProps(): Partial<IPopoverProps> {
        const passedInProps = this.props.multiSelectProps !== undefined &&
            this.props.multiSelectProps.popoverProps !== undefined ?
            this.props.multiSelectProps.popoverProps : {};
        return {
            position: Position.BOTTOM,
            ...passedInProps,
        };
    }

    private getTagInputProps(): Partial<ITagInputProps> {
        const passedInProps = this.props.multiSelectProps !== undefined &&
            this.props.multiSelectProps.tagInputProps !== undefined ?
            this.props.multiSelectProps.tagInputProps : {};
        return {
            ...passedInProps,
            onRemove: this.handleTagRemove,
        };
    }

    private itemPredicate = (query: string, item: T) => {
        return this.props.itemToString(item).toLowerCase().indexOf(query.toLowerCase()) > -1;
    }

    private onItemSelect = (node: T) => {
        if (this.isNodeSelected(node)) {
            this.removeNode(this.getNodeIndex(node));
        } else {
            const selectedItems = this.props.values.concat([node]);
            this.setNewItems(selectedItems);
        }
    }

    private handleTagRemove = (_T: string, index: number) => {
        this.removeNode(index);
    }

    private removeNode(index: number) {
        const selectedItems = this.props.values.filter((_F, i) => i !== index);
        this.setNewItems(selectedItems);
    }

    private setNewItems(selectedItems: T[]) {
        this.setState({ selectedItems });
        this.props.onItemSelect(selectedItems);
    }

    private itemRenderer = (item: T, itemProps: any) => {
        if (!itemProps.modifiers.matchesPredicate ||
            (itemProps.index === undefined || itemProps.index > MAX_ITEMS_TO_RENDER)) {
            return null;
        }
        const classes = classNames({
            [Classes.ACTIVE]: itemProps.modifiers.active,
            [Classes.INTENT_PRIMARY]: itemProps.modifiers.active,
        });
        const iconName = this.isNodeSelected(item) ? IconNames.TICK  : IconNames.BLANK;
        return (
            <MenuItem
                className={classes}
                key={this.props.itemToString(item)}
                icon={iconName}
                onClick={itemProps.handleClick}
                text={this.props.itemToString(item)}
                shouldDismissPopover={false}
            />
        );
    }

    private isNodeSelected(item: T) {
        return this.getNodeIndex(item) !== -1;
    }

    private getNodeIndex(item: T) {
        for (let i = 0; i < this.props.values.length; i++) {
            if (this.props.itemToString(item) === this.props.itemToString(this.props.values[i])) {
                return i;
            }
        }
        return -1;
    }

    private tagRenderer = (item: T) => {
        return this.props.itemToString(item);
    }

}
