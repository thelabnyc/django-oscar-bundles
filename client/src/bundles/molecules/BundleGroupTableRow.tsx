import React = require('react');
import {IBundleGroup, IProduct, IRange, IDRFSelectOptions} from '../../utils/models.interfaces';


export interface IProps {
    bundleTypeChoices: IDRFSelectOptions;
    group: IBundleGroup;
    products: IProduct[];
    ranges: IRange[];
    onEdit: (group: IBundleGroup) => void;
    onDelete: (group: IBundleGroup) => void;
}


export interface IState {
}


class BundleGroupTableRow extends React.PureComponent<IProps, IState> {

    private buildGroupActions () {
        const self = this;
        const onEdit = function(e: React.MouseEvent<HTMLAnchorElement>) {
            e.preventDefault();
            self.props.onEdit(self.props.group);
        };
        const onDelete = function(e: React.MouseEvent<HTMLAnchorElement>) {
            e.preventDefault();
            const msgFormat = gettext("Are you sure you want to delete this bundle group (%(name)s) and all its associated bundles?");
            const data = {
                name: self.props.group.name,
            };
            const msg = interpolate(msgFormat, data, true);
            if (confirm(msg)) {
                self.props.onDelete(self.props.group);
            }
        };
        return (
            <div className="btn-toolbar">
                <div className="btn-group">
                    <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                        {gettext("Actions")}{' '}<span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu pull-right">
                        <li><a onClick={onEdit}>{gettext("Edit")}</a></li>
                        <li><a onClick={onDelete}>{gettext("Delete")}</a></li>
                    </ul>
                </div>
            </div>
        );
    }


    private buildProductList (productIDs: number[]) {
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


    private buildRangeList () {
        const rangeIDs = this.props.group.user_configurable_bundles.map(bundle => bundle.suggested_range);
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


    render () {
        const self = this;
        const bundleType = this.props.bundleTypeChoices.find((choice) => {
            return choice.value === self.props.group.bundle_type;
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
            <tr key={this.props.group.id}>
                <td>{this.props.group.name}</td>
                <td>{bundleType.display_name}</td>
                <td><img src={this.props.group.image} width={100} /></td>
                <td>
                    {this.buildProductList(this.props.group.triggering_parents)}
                </td>
                <td>
                    {suggestedProducts}
                    {suggestedRanges}
                </td>
                <td>{this.buildGroupActions()}</td>
            </tr>
        );
    }
}

export default BundleGroupTableRow;
