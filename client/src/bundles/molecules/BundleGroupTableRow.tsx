import React from "react";
import {
    IBundleGroup,
    IProduct,
    IRange,
    IDRFSelectOptions,
} from "../../utils/models.interfaces";

export interface IProps {
    bundleTypeChoices: IDRFSelectOptions;
    group: IBundleGroup;
    products: IProduct[];
    ranges: IRange[];
    onEdit: (group: IBundleGroup) => void;
    onDelete: (group: IBundleGroup) => void;
}

class BundleGroupTableRow extends React.PureComponent<IProps> {
    private buildGroupActions() {
        const onEdit = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            this.props.onEdit(this.props.group);
        };
        const onDelete = (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            const msgFormat = gettext(
                "Are you sure you want to delete this bundle group (%(name)s) and all its associated bundles?",
            );
            const data = {
                name: this.props.group.name,
            };
            const msg = interpolate(msgFormat, data, true);
            if (confirm(msg)) {
                this.props.onDelete(this.props.group);
            }
        };
        return (
            <div className="btn-toolbar">
                <div className="dropdown">
                    <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        {gettext("Actions")} <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-right">
                        <a className="dropdown-item" onClick={onEdit}>
                            {gettext("Edit")}
                        </a>
                        <a className="dropdown-item" onClick={onDelete}>
                            {gettext("Delete")}
                        </a>
                    </ul>
                </div>
            </div>
        );
    }

    private buildProductList(productIDs: number[]) {
        const products = this.props.products.filter((p) => {
            return productIDs.indexOf(p.id) !== -1;
        });
        return (
            <ul>
                {products.map((p) => {
                    return (
                        <li key={p.id}>
                            <a href={p.dashboard_url}>{p.title}</a>
                        </li>
                    );
                })}
            </ul>
        );
    }

    private buildRangeList() {
        const rangeIDs = this.props.group.user_configurable_bundles.map(
            (bundle) => bundle.suggested_range,
        );
        const ranges = this.props.ranges.filter((r) => {
            return rangeIDs.includes(r.id);
        });
        return (
            <ul>
                {ranges.map((r) => {
                    return (
                        <li key={r.id}>
                            <a href={r.dashboard_url}>{r.name}</a>
                        </li>
                    );
                })}
            </ul>
        );
    }

    render() {
        const bundleType = this.props.bundleTypeChoices.find((choice) => {
            return choice.value === this.props.group.bundle_type;
        });
        let suggestedProducts: JSX.Element | null = null;
        let suggestedRanges: JSX.Element | null = null;
        if (this.props.group.suggested_parents) {
            suggestedProducts = (
                <>
                    <em>{gettext("Products:")}</em>
                    {this.buildProductList(this.props.group.suggested_parents)}
                </>
            );
        }
        if (this.props.group.user_configurable_bundles.length > 0) {
            suggestedRanges = (
                <>
                    <em>{gettext("Ranges:")}</em>
                    {this.buildRangeList()}
                </>
            );
        }
        return (
            <tr key={`${this.props.group.id}`}>
                <td>{this.props.group.name}</td>
                <td>{bundleType ? bundleType.display_name : ""}</td>
                <td>
                    <img
                        src={this.props.group.image || undefined}
                        width={100}
                    />
                </td>
                <td>
                    {this.buildProductList(this.props.group.triggering_parents)}
                </td>
                <td>
                    {suggestedProducts}
                    {suggestedRanges}
                </td>
                <td>
                    {this.props.group.is_active
                        ? gettext("Active")
                        : gettext("Inactive")}
                </td>
                <td>{this.buildGroupActions()}</td>
            </tr>
        );
    }
}

export default BundleGroupTableRow;
