import React = require('react');
import {IBundleGroup, IProduct, ICharFieldChoice} from '../../utils/api.interfaces';


export interface IProps {
    bundleTypeChocies: ICharFieldChoice[];
    group: IBundleGroup;
    products: IProduct[];
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
            if (confirm(`Are you sure you want to delete this bundle group (${self.props.group.name}) and all its associated bundles?`)) {
                self.props.onDelete(self.props.group);
            }
        };
        return (
            <div className="btn-toolbar">
                <div className="btn-group">
                    <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                        Actions{' '}<span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu pull-right">
                        <li><a onClick={onEdit}>Edit</a></li>
                        <li><a onClick={onDelete}>Delete</a></li>
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


    render () {
        const self = this;
        const bundleType = this.props.bundleTypeChocies.find((choice) => {
            return choice.value === self.props.group.bundle_type;
        });
        return (
            <tr key={this.props.group.id}>
                <td>{this.props.group.name}</td>
                <td>{bundleType.display_name}</td>
                <td><img src={this.props.group.image} width={100} /></td>
                <td>{this.buildProductList(this.props.group.triggering_parents)}</td>
                <td>{this.buildProductList(this.props.group.suggested_parents)}</td>
                <td>{this.buildGroupActions()}</td>
            </tr>
        );
    }
}

export default BundleGroupTableRow;
