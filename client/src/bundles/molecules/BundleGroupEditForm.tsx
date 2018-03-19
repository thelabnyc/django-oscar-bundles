import React = require('react');
import classNames = require('classnames');
import Select from 'react-select';
import {Option as SelectOption} from 'react-select';
import {IBundleGroup, IBundle, IProduct, ICharFieldChoice} from '../../utils/api.interfaces';

import './BundleGroupEditForm.scss';


export interface IProps {
    bundleTypeChoices: ICharFieldChoice[];
    group: IBundleGroup | null;
    products: IProduct[];
    isSaving: boolean;
    errors: {
        bundleType?: string[];
        name?: string[];
        description?: string[];
        image?: string[];
        triggering_parents?: string[];
        suggested_parents?: string[];
    };
    onCancel: () => void;
    onSave: (data: IBundleGroup) => void;
}


export interface IState {
    bundleType: string;
    name: string;
    description: string;
    image: File | null;
    clearImage: boolean;
    triggeringParents: number[];
    suggestedParents: number[];
    linkedProducts: {
        [triggeringProductID: number]: number[];
    };
}


class BundleGroupEditForm extends React.PureComponent<IProps, IState> {
    productIdx: { [id: number]: IProduct };

    constructor (props: IProps) {
        super(props);

        // Build linked products data set
        const linkedProducts: IState['linkedProducts'] = {};
        const bundles = props.group ? props.group.bundles : [];
        bundles.forEach((bundle) => {
            if (!linkedProducts[bundle.triggering_product]) {
                linkedProducts[bundle.triggering_product] = []
            }
            linkedProducts[bundle.triggering_product] = linkedProducts[bundle.triggering_product]
                .concat(bundle.suggested_products)
                .filter(function(id, i, ids) {
                    return ids.indexOf(id) === i;
                });
        });

        this.state = {
            bundleType: props.group ? props.group.bundle_type : props.bundleTypeChoices[0].value,
            name: props.group ? props.group.name : '',
            description: props.group ? props.group.description : '',
            image: null,
            clearImage: false,
            triggeringParents: props.group ? props.group.triggering_parents : [],
            suggestedParents: props.group ? props.group.suggested_parents : [],
            linkedProducts: linkedProducts,
        };
        this.productIdx = {};
        this.fillProductIdx(props.products);
    }


    componentWillReceiveProps(nextProps: IProps) {
        this.fillProductIdx(nextProps.products);
    }


    private onSave (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const self = this;
        const data: IBundleGroup = {
            id: this.props.group ? this.props.group.id : null,
            bundle_type: this.state.bundleType,
            name: this.state.name,
            description: this.state.description,
            image: this.props.group ? this.props.group.image : '',
            newImage: this.state.clearImage ? null : this.state.image,
            clearImage: this.state.clearImage,
            triggering_parents: this.state.triggeringParents,
            suggested_parents: this.state.suggestedParents,
            bundles: [],
        };

        Object.keys(this.state.linkedProducts).forEach((tID) => {
            const triggerID = parseInt(tID, 10);
            const tProduct = self.getProduct(triggerID);
            if (data.triggering_parents.indexOf(tProduct.id) === -1 && data.triggering_parents.indexOf(tProduct.parent) === -1) {
                return;
            }

            let preExistingBundle: IBundle | undefined = undefined;
            if (self.props.group) {
                preExistingBundle = self.props.group.bundles.find((b) => {
                    return b.triggering_product === triggerID;
                });
            }

            const suggestionIDs = self.state.linkedProducts[triggerID]
                .filter((sID) => {
                    const sProduct = self.getProduct(sID);
                    return data.suggested_parents.indexOf(sProduct.id) !== -1 || data.suggested_parents.indexOf(sProduct.parent) !== -1;
                });

            if (suggestionIDs.length <= 0) {
                return;
            }

            data.bundles.push({
                id: preExistingBundle ? preExistingBundle.id : null,
                triggering_product: triggerID,
                suggested_products: suggestionIDs
            });
        });

        this.props.onSave(data);
    }


    private fillProductIdx (products: IProduct[]) {
        const self = this;
        this.productIdx = {};
        products.forEach((p) => {
            self.productIdx[p.id] = p;
        });
    }


    private getProduct (productID: number) {
        return this.productIdx[productID];
    }


    private getParentProductSelectOptions () {
        return this.props.products
            .filter((p) => {
                return !p.is_child;
            })
            .sort((a, b) => {
                return a.title.localeCompare(b.title);
            })
            .map((p) => {
                const opt: SelectOption<number> = {
                    value: p.id,
                    label: p.title,
                };
                return opt;
            });
    }


    private getChildProductSelectOptions (parent: IProduct) {
        return this.props.products
            .filter((p) => {
                return !p.is_parent && (p.id === parent.id || p.parent === parent.id);
            })
            .sort((a, b) => {
                return a.title.localeCompare(b.title);
            })
            .map((p) => {
                const opt: SelectOption<number> = {
                    value: p.id,
                    label: p.title,
                };
                return opt;
            });
    }


    private buildFormGroupClasses (field: keyof IProps['errors'], extras: string[] = []) {
        const classes: { [name: string]: boolean; } = {
            'form-group': true,
            'has-error': (this.props.errors[field])
                ? (this.props.errors[field].length > 0)
                : (false),
        };
        extras.forEach((className) => {
            classes[className] = true;
        });
        return classNames(classes);
    }


    private buildErrors (field: keyof IProps['errors']) {
        return (this.props.errors[field] || []).map((errorMsg, i) => {
            return (
                <span key={i} className="help-block">
                    <i className="icon-exclamation-sign"></i>{' '}{errorMsg}
                </span>
            );
        });
    }


    private buildCurrentImage () {
        if (!this.props.group || !this.props.group.image) {
            return null;
        }
        const self = this;
        const pathParts = this.props.group.image.split('/');
        const fileName = pathParts[pathParts.length - 1];

        const onClearImage = function(e: React.FormEvent<HTMLInputElement>) {
            self.setState({
                clearImage: e.currentTarget.checked,
            });
        };

        return (
            <span>
                Currently: <a target='_blank' href={this.props.group.image}>{fileName}</a>
                {' '}
                <input type="checkbox"
                       id="bundle-edit-form-clear-img"
                       checked={this.state.clearImage}
                       onChange={onClearImage}
                       disabled={this.props.isSaving} />
                {' '}
                <label htmlFor="bundle-edit-form-clear-img">Clear</label>
            </span>
        )
    }


    private buildBundleRows (triggerParent: IProduct, suggestParent: IProduct) {
        const self = this;

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
                        const onChange = function(opts: SelectOption<number> | SelectOption<number>[]) {
                            let options: SelectOption<number>[];
                            if ((opts as SelectOption<number>[]).length === undefined) {
                                options = [opts as SelectOption<number>];
                            } else {
                                options = opts as SelectOption<number>[];
                            }
                            const ids = options.map((o) => { return o.value; });
                            self.setState((state) => {
                                const oldIDs = (state.linkedProducts[trigger.id] || [])
                                    .filter((sid) => {
                                        const suggestion = self.getProduct(sid);
                                        return suggestion.id !== suggestParent.id && suggestion.parent !== suggestParent.id;
                                    });
                                const newIDs = oldIDs
                                    .concat(ids)
                                    .filter((id, i, ids) => {
                                        return ids.indexOf(id) === i;
                                    });
                                const linkedProducts = {...state.linkedProducts, [trigger.id]: newIDs, };
                                return {...state, linkedProducts: linkedProducts, };
                            });
                        };
                        const selectValue = (self.state.linkedProducts[trigger.id] || [])
                            .filter((sid) => {
                                const suggestion = self.getProduct(sid);
                                return suggestion.id === suggestParent.id || suggestion.parent === suggestParent.id;
                            });
                        return (
                            <tr key={trigger.id}>
                                <th>
                                    <a href={trigger.dashboard_url} target="_blank">{trigger.title}</a>
                                </th>
                                <td>
                                    <Select multi={true}
                                            simpleValue={false}
                                            value={selectValue}
                                            options={suggestOptions}
                                            onChange={onChange}
                                            disabled={this.props.isSaving} />
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

        if (this.state.triggeringParents.length <= 0 || this.state.suggestedParents.length <= 0) {
            return (
                <div className="row">
                    <div className="col-sm-12">
                        <p><em>Select at least one trigger product and one suggested product to begin linking variants.</em></p>
                    </div>
                </div>
            );
        }

        const self = this;
        const parentCombinations: { [key: string]: ICombination } = {};
        const buildKey = function(triggerParent: number, suggestParent: number) {
            return `${triggerParent}-${suggestParent}`;
        };

        this.state.triggeringParents.forEach((triggerID) => {
            self.state.suggestedParents.forEach((suggestionID) => {
                const key = buildKey(triggerID, suggestionID);
                parentCombinations[key] = {
                    triggerParent: self.getProduct(triggerID),
                    suggestParent: self.getProduct(suggestionID),
                };
            });
        });

        return Object.values(parentCombinations).map((combination, i) => {
            return (
                <div key={i} className="row">
                    <div className="col-sm-6">
                        <h3><strong>{combination.triggerParent.title}</strong> <em>(Trigger Parent)</em></h3>
                    </div>
                    <div className="col-sm-6">
                        <h3><strong>{combination.suggestParent.title}</strong> <em>(Suggestion Parent)</em></h3>
                    </div>
                    <div className="col-sm-12">
                        {this.buildBundleRows(combination.triggerParent, combination.suggestParent)}
                    </div>
                </div>
            );
        });
    }


    render () {
        const self = this;

        const title = this.props.group
            ? 'Edit Bundle Group'
            : 'Create Bundle Group';

        const onEdit = function(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
            const name = e.currentTarget.name as keyof IState;
            const value = e.currentTarget.value;
            self.setState((state) => {
                return {...state,  [name]: value, };
            });
        };

        const onSelectImage = function(e: React.FormEvent<HTMLInputElement>) {
            const file = e.currentTarget.files[0];
            self.setState({
                image: file,
            });
        };

        const onSelectParent = function(name: 'triggeringParents' | 'suggestedParents', opts: SelectOption<number> | SelectOption<number>[]) {
            let options: SelectOption<number>[];
            if ((opts as SelectOption<number>[]).length === undefined) {
                options = [opts as SelectOption<number>];
            } else {
                options = opts as SelectOption<number>[];
            }
            self.setState((state) => {
                return {...state, [name]: options.map((o) => { return o.value; }), };
            });
        };

        const onCancel = function(e: React.MouseEvent<HTMLElement>) {
            e.preventDefault();
            self.props.onCancel();
        };

        return (
            <form className="row bundle-group-edit" onSubmit={(e) => { self.onSave(e); }}>
                <div className="col-sm-12 bundle-group-edit__section">
                    <h1>{title}</h1>
                    <div className={this.buildFormGroupClasses('bundleType')}>
                        <label htmlFor="id_bundleType" className="control-label">Bundle Type</label>
                        <div>
                            <select id="id_bundleType"
                                    name="bundleType"
                                    className="form-control"
                                    value={this.state.bundleType}
                                    onChange={onEdit}
                                    disabled={this.props.isSaving}>
                                {this.props.bundleTypeChoices.map((choice) => {
                                    return (
                                        <option value={choice.value}>{choice.display_name}</option>
                                    );
                                })}
                            </select>
                            {this.buildErrors('bundleType')}
                        </div>
                    </div>
                    <div className={this.buildFormGroupClasses('name')}>
                        <label htmlFor="id_name" className="control-label">Name</label>
                        <div>
                            <input id="id_name"
                                   name="name"
                                   maxLength={200}
                                   className="form-control"
                                   value={this.state.name}
                                   onChange={onEdit}
                                   disabled={this.props.isSaving} />
                            {this.buildErrors('name')}
                        </div>
                    </div>
                    <div className={this.buildFormGroupClasses('description')}>
                        <label htmlFor="id_description" className="control-label">Description</label>
                        <div>
                            <textarea id="id_description"
                                      name="description"
                                      cols={40}
                                      rows={10}
                                      className="form-control"
                                      value={this.state.description}
                                      onChange={onEdit}
                                      disabled={this.props.isSaving}>
                            </textarea>
                            {this.buildErrors('description')}
                        </div>
                    </div>
                    <div className={this.buildFormGroupClasses('image')}>
                        <label htmlFor="id_image" className="control-label">Image</label>
                        <div>
                            {this.buildCurrentImage()}
                            <input id="id_image"
                                   type="file"
                                   name="image"
                                   className="form-control"
                                   onChange={onSelectImage}
                                   disabled={this.props.isSaving} />
                            {this.buildErrors('image')}
                        </div>
                    </div>
                </div>

                <div className="col-sm-12 bundle-group-edit__section">
                    <h1>Relevant Products</h1>
                    <p><em>Select the <strong>parent</strong> and <strong>standalone</strong> products revelant to this bundle group.</em></p>
                    <div className="row">
                        <div className={this.buildFormGroupClasses('triggering_parents', ['col-sm-6'])}>
                            <label htmlFor="id_image" className="control-label">Triggers</label>
                            <div>
                                <Select name="triggeringParents"
                                        multi={true}
                                        simpleValue={false}
                                        value={this.state.triggeringParents}
                                        onChange={(v) => { onSelectParent('triggeringParents', v); }}
                                        options={this.getParentProductSelectOptions()}
                                        disabled={this.props.isSaving} />
                                {this.buildErrors('triggering_parents')}
                            </div>
                        </div>
                        <div className={this.buildFormGroupClasses('suggested_parents', ['col-sm-6'])}>
                            <label htmlFor="id_image" className="control-label">Suggestions</label>
                            <div>
                                <Select name="suggestedProducts"
                                        multi={true}
                                        simpleValue={false}
                                        value={this.state.suggestedParents}
                                        onChange={(v) => { onSelectParent('suggestedParents', v); }}
                                        options={this.getParentProductSelectOptions()}
                                        disabled={this.props.isSaving} />
                                {this.buildErrors('suggested_parents')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-sm-12 bundle-group-edit__section">
                    <h1>Product Links</h1>
                    {this.buildParentRows()}
                </div>

                <div className="col-sm-12 bundle-group-edit__section">
                    <div className="form-group">
                        <a className="btn btn-default" onClick={onCancel}>Cancel</a>
                        {' '}
                        <button className="btn btn-primary" type="submit">Save</button>
                    </div>
                </div>
            </form>
        );
    }
}

export default BundleGroupEditForm;
