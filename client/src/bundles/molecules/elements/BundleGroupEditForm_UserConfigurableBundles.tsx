import React from "react";
import Select from "react-select";
import {
    IProduct,
    IRange,
    SelectOption,
} from "../../../utils/models.interfaces";

type ILinkedRange = {
    rangeID: number | null;
    quantity: number;
};
export type ILinkedRanges = {
    [triggeringProductID: number]: ILinkedRange[];
};

interface IProps {
    ranges: IRange[];
    isSaving: boolean;
    triggeringParents: number[];
    linkedRanges: ILinkedRanges;
    getProduct: (productID: number) => IProduct;
    onLinkedRangesChange: (
        trigger: IProduct,
        rangeIndex: number,
        opts: SelectOption | ReadonlyArray<SelectOption> | null | undefined
    ) => void;
    onLinkedRangeQuantityChange: (
        trigger: IProduct,
        rangeIndex: number,
        opts: SelectOption | ReadonlyArray<SelectOption> | null | undefined
    ) => void;
}

interface IState {}

const helpText =
    gettext(`User configurable bundles are bundles which link parent/standalone products to ranges of \
other products. Their intent is to represent a group of products related to the suggesting parent, rather than a \
specific one-to-one mapping of product to product.`);

export class UserConfigurableBundles extends React.PureComponent<
    IProps,
    IState
> {
    private getRangeSelectOptions() {
        const rangeOptions = this.props.ranges
            .sort((a, b) => {
                return a.name.localeCompare(b.name);
            })
            .map((p) => {
                const opt: SelectOption = {
                    value: p.id,
                    label: p.name,
                };
                return opt;
            });
        return rangeOptions;
    }

    private getQuantitySelectOptions() {
        const quantityOptions: SelectOption[] = [];
        for (let i = 1; i < 100; i++) {
            quantityOptions.push({
                value: i,
                label: `${i}`,
            });
        }
        return quantityOptions;
    }

    private buildBundleRows(triggerParent: IProduct) {
        const suggestOptions = this.getRangeSelectOptions();
        const quantityOptions = this.getQuantitySelectOptions();
        const linkedRanges = this.props.linkedRanges[triggerParent.id] || [];
        if (
            linkedRanges.length <= 0 ||
            linkedRanges[linkedRanges.length - 1].rangeID !== null
        ) {
            linkedRanges.push({
                rangeID: null,
                quantity: 1,
            });
        }
        return (
            <table
                key={triggerParent.id}
                className="table bundle-group-edit__link-table"
            >
                <tbody>
                    {linkedRanges.map((range, i) => {
                        return (
                            <tr key={i}>
                                <th>
                                    <a
                                        href={triggerParent.dashboard_url}
                                        target="_blank"
                                    >
                                        {triggerParent.title}
                                    </a>
                                </th>
                                <td>
                                    <Select
                                        isClearable={true}
                                        value={suggestOptions.filter(
                                            (o) => o.value === range.rangeID
                                        )}
                                        options={suggestOptions}
                                        onChange={this.props.onLinkedRangesChange.bind(
                                            this,
                                            triggerParent,
                                            i
                                        )}
                                        isDisabled={this.props.isSaving}
                                    />
                                </td>
                                <td>
                                    <Select
                                        value={quantityOptions.filter(
                                            (o) =>
                                                range.rangeID !== null &&
                                                o.value === range.quantity
                                        )}
                                        options={quantityOptions}
                                        onChange={this.props.onLinkedRangeQuantityChange.bind(
                                            this,
                                            triggerParent,
                                            i
                                        )}
                                        isDisabled={
                                            this.props.isSaving ||
                                            range.rangeID === null
                                        }
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }

    private buildParentRows() {
        if (this.props.triggeringParents.length <= 0) {
            return (
                <div className="row">
                    <div className="col-sm-12">
                        <p>
                            <em>
                                {gettext(
                                    "Select at least one trigger product to begin linking ranges."
                                )}
                            </em>
                        </p>
                    </div>
                </div>
            );
        }
        return (
            <div className="row">
                <div className="col-sm-4">
                    <h3>
                        <strong>{gettext("Trigger Parent")}</strong>
                    </h3>
                </div>
                <div className="col-sm-4">
                    <h3>
                        <strong>{gettext("Suggested Range")}</strong>
                    </h3>
                </div>
                <div className="col-sm-4">
                    <h3>
                        <strong>{gettext("Suggested Quantity")}</strong>
                    </h3>
                </div>
                <div className="col-sm-12">
                    {this.props.triggeringParents.map((triggerParentID) => {
                        const triggerParent =
                            this.props.getProduct(triggerParentID);
                        return this.buildBundleRows(triggerParent);
                    })}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="col-sm-12 bundle-group-edit__section">
                <h1>{gettext("Range Links (User Configurable Bundles)")}</h1>
                <p>
                    <em>{helpText}</em>
                </p>
                {this.buildParentRows()}
            </div>
        );
    }
}
