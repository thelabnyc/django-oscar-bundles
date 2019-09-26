import React from 'react';
import Select from 'react-select';
import {IProduct, SelectOption} from '../../../utils/models.interfaces';


export type ILinkedProducts = {
    [triggeringProductID: number]: number[];
};

interface IProps {
    products: IProduct[];
    isSaving: boolean;
    triggeringParents: number[];
    suggestedParents: number[];
    linkedProducts: ILinkedProducts;
    getProduct: (productID: number) => IProduct;
    onLinkedProductsChange: (trigger: IProduct, suggestParent: IProduct, opts: SelectOption | ReadonlyArray<SelectOption> | null | undefined) => void;
}


interface IState {
}


export class ConcreteBundles extends React.PureComponent<IProps, IState> {

    private getChildProductSelectOptions (parent: IProduct) {
        return this.props.products
            .filter((p) => {
                return !p.is_parent && (p.id === parent.id || p.parent === parent.id);
            })
            .sort((a, b) => {
                return a.title.localeCompare(b.title);
            })
            .map((p) => {
                const opt: SelectOption = {
                    value: p.id,
                    label: p.title,
                };
                return opt;
            });
    }


    private buildBundleRows (triggerParent: IProduct, suggestParent: IProduct) {
        const triggerOptions = this.props.products
            .filter((p) => {
                return !p.is_parent && (p.id === triggerParent.id || p.parent === triggerParent.id);
            })
            .sort((a, b) => {
                return a.title.localeCompare(b.title);
            });
        const suggestOptions = this.getChildProductSelectOptions(suggestParent);
        return (
            <table className="table bundle-group-edit__link-table">
                <tbody>
                    {triggerOptions.map((trigger) => {
                        const selectValue = (this.props.linkedProducts[trigger.id] || [])
                            .filter((sid) => {
                                const suggestion = this.props.getProduct(sid);
                                return suggestion.id === suggestParent.id || suggestion.parent === suggestParent.id;
                            });
                        return (
                            <tr key={trigger.id}>
                                <th>
                                    <a href={trigger.dashboard_url} target="_blank">{trigger.title}</a>
                                </th>
                                <td>
                                    <Select isMulti={true}
                                            value={suggestOptions.filter((o) => selectValue.includes(o.value))}
                                            options={suggestOptions}
                                            onChange={this.props.onLinkedProductsChange.bind(this, trigger, suggestParent)}
                                            isDisabled={this.props.isSaving} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }


    private buildParentRows () {
        type ICombination = {
            triggerParent: IProduct;
            suggestParent: IProduct;
        };
        if (this.props.triggeringParents.length <= 0 || this.props.suggestedParents.length <= 0) {
            return (
                <div className="row">
                    <div className="col-sm-12">
                        <p><em>{gettext("Select at least one trigger product and one suggested product to begin linking variants.")}</em></p>
                    </div>
                </div>
            );
        }
        const parentCombinations: { [key: string]: ICombination } = {};
        const buildKey = function(triggerParent: number, suggestParent: number) {
            return `${triggerParent}-${suggestParent}`;
        };
        this.props.triggeringParents.forEach((triggerID) => {
            this.props.suggestedParents.forEach((suggestionID) => {
                const key = buildKey(triggerID, suggestionID);
                parentCombinations[key] = {
                    triggerParent: this.props.getProduct(triggerID),
                    suggestParent: this.props.getProduct(suggestionID),
                };
            });
        });
        return Object.values(parentCombinations).map((combination, i) => {
            return (
                <div key={i} className="row">
                    <div className="col-sm-6">
                        <h3><strong>{combination.triggerParent.title}</strong> <em>{gettext("(Trigger Parent)")}</em></h3>
                    </div>
                    <div className="col-sm-6">
                        <h3><strong>{combination.suggestParent.title}</strong> <em>{gettext("(Suggestion Parent)")}</em></h3>
                    </div>
                    <div className="col-sm-12">
                        {this.buildBundleRows(combination.triggerParent, combination.suggestParent)}
                    </div>
                </div>
            );
        });
    }


    render () {
        return (
            <div className="col-sm-12 bundle-group-edit__section">
                <h1>{gettext("Product Links (Concrete Bundles)")}</h1>
                <p><em>
                    {gettext('Concrete bundles are bundles which link products to other specific products. They can not be customized by the end-consumer.')}
                </em></p>
                {this.buildParentRows()}
            </div>
        );
    }
}
