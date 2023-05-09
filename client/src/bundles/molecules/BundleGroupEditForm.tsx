import React from "react";
import {
    IBundleGroup,
    IConcreteBundle,
    IUserConfigurableBundle,
    IProduct,
    IRange,
    IDRFSelectOptions,
    SelectOption,
} from "../../utils/models.interfaces";
import { BundleGroupMetaFields } from "./elements/BundleGroupEditForm_MetaFields";
import { ParentProductsEditForm } from "./elements/BundleGroupEditForm_ParentProducts";
import {
    ILinkedRanges,
    UserConfigurableBundles,
} from "./elements/BundleGroupEditForm_UserConfigurableBundles";
import {
    ILinkedProducts,
    ConcreteBundles,
} from "./elements/BundleGroupEditForm_ConcreteBundles";
import { BundleGroupEditFormActions } from "./elements/BundleGroupEditForm_Actions";

import "./BundleGroupEditForm.scss";

interface IProps {
    bundleTypeChoices: IDRFSelectOptions;
    group: IBundleGroup | null;
    products: IProduct[];
    ranges: IRange[];
    isSaving: boolean;
    errors: {
        bundleType?: string[];
        name?: string[];
        headline?: string[];
        description?: string[];
        image?: string[];
        triggering_parents?: string[];
        suggested_parents?: string[];
    };
    onCancel: () => void;
    onSave: (data: IBundleGroup) => void;
}

interface IState {
    bundleType: string;
    name: string;
    headline: string;
    description: string;
    is_active: boolean | undefined | null;
    image: File | null;
    clearImage: boolean;
    triggeringParents: number[];
    suggestedParents: number[];
    linkedRanges: ILinkedRanges;
    linkedProducts: ILinkedProducts;
}

const _isSelectOptionArray = (
    opts: SelectOption | ReadonlyArray<SelectOption> | null | undefined
): opts is ReadonlyArray<SelectOption> => {
    console.log(opts, 'OPTS:')
    return !!opts && (opts as ReadonlyArray<SelectOption>).length !== undefined;
};

const _isSelectOption = (
    opts: SelectOption | ReadonlyArray<SelectOption> | null | undefined
): opts is SelectOption => {
    return !!opts && !_isSelectOptionArray(opts);
};

class BundleGroupEditForm extends React.PureComponent<IProps, IState> {
    private productIdx: { [id: number]: IProduct };

    constructor(props: IProps) {
        super(props);

        // Build linked ranges data set
        const linkedRanges: IState["linkedRanges"] = {};
        const configurableBundles = props.group
            ? props.group.user_configurable_bundles
            : [];
        configurableBundles.forEach((bundle) => {
            if (!linkedRanges[bundle.triggering_product]) {
                linkedRanges[bundle.triggering_product] = [];
            }
            linkedRanges[bundle.triggering_product].push({
                rangeID: bundle.suggested_range,
                quantity: bundle.quantity,
            });
        });

        // Build linked products data set
        const linkedProducts: IState["linkedProducts"] = {};
        const concreteBundles = props.group ? props.group.concrete_bundles : [];
        concreteBundles.forEach((bundle) => {
            if (!linkedProducts[bundle.triggering_product]) {
                linkedProducts[bundle.triggering_product] = [];
            }
            linkedProducts[bundle.triggering_product] = linkedProducts[
                bundle.triggering_product
            ]
                .concat(bundle.suggested_products)
                .filter((id, i, ids) => {
                    return ids.indexOf(id) === i;
                });
        });

        // Build initial state
        const state: IState = {
            bundleType: "",
            name: "",
            description: "",
            headline: "",
            is_active: true,
            image: null,
            clearImage: false,
            triggeringParents: [],
            suggestedParents: [],
            linkedRanges: linkedRanges,
            linkedProducts: linkedProducts,
        };
        if (props.group) {
            state.bundleType = props.group.bundle_type;
            state.name = props.group.name;
            state.description = props.group.description;
            state.headline = props.group.headline;
            state.is_active = props.group.is_active;
            state.triggeringParents = props.group.triggering_parents;
            state.suggestedParents = props.group.suggested_parents;
        } else if (props.bundleTypeChoices.length > 0) {
            state.bundleType = props.bundleTypeChoices[0].value;
        }
        this.state = state;
        this.productIdx = {};
        this.fillProductIdx(props.products);
    }

    private readonly onEdit = (
        e: React.FormEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const name = e.currentTarget.name as keyof IState;
        const value = e.currentTarget.value;
        this.setState((state) => {
            return { ...state, [name]: value };
        });
    };

    private readonly onSelectImage = (e: React.FormEvent<HTMLInputElement>) => {
        if (!e.currentTarget.files) {
            return;
        }
        const file = e.currentTarget.files[0];
        this.setState({
            image: file,
        });
    };

    private readonly onSelectParent = (
        name: "triggeringParents" | "suggestedParents",
        opts: SelectOption | ReadonlyArray<SelectOption> | null | undefined
    ) => {
        let options: ReadonlyArray<SelectOption>;
        if (!opts) {
            options = [];
        } else if ((opts as ReadonlyArray<SelectOption>).length === undefined) {
            options = [opts as SelectOption];
        } else {
            options = opts as ReadonlyArray<SelectOption>;
        }
        this.setState((state) => {
            return {
                ...state,
                [name]: options.map((o) => {
                    return o.value;
                }),
            };
        });
    };

    private readonly onLinkedRangesChange = (
        trigger: IProduct,
        rangeIndex: number,
        opts: SelectOption | ReadonlyArray<SelectOption> | null | undefined
    ) => {
        let option: SelectOption | null = null;
        if (_isSelectOption(opts)) {
            option = opts;
        } else if (_isSelectOptionArray(opts)) {
            throw new Error(
                "Can not link multiple ranges to a single trigger parent"
            );
        }
        this.setState((state) => {
            const linkedRanges = {
                ...state.linkedRanges,
            };
            if (option) {
                if (!linkedRanges[trigger.id]) {
                    linkedRanges[trigger.id] = [];
                }
                linkedRanges[trigger.id][rangeIndex] = {
                    ...(linkedRanges[trigger.id][rangeIndex] || {}),
                    rangeID: option.value,
                    quantity: 1,
                };
            } else {
                delete linkedRanges[trigger.id][rangeIndex];
                linkedRanges[trigger.id] = linkedRanges[trigger.id].filter(
                    (r) => !!r
                );
                if (linkedRanges[trigger.id].length <= 0) {
                    delete linkedRanges[trigger.id];
                }
            }
            return { ...state, linkedRanges: linkedRanges };
        });
    };

    private readonly onLinkedRangesQuantityChange = (
        trigger: IProduct,
        rangeIndex: number,
        opts: SelectOption | ReadonlyArray<SelectOption> | null | undefined
    ) => {
        let option: SelectOption = { value: 1, label: "1" };
        if (_isSelectOption(opts)) {
            option = opts;
        } else if (_isSelectOptionArray(opts)) {
            throw new Error(
                "Can not link multiple quantities to a single range parent"
            );
        }
        this.setState((state) => {
            const linkedRanges = {
                ...state.linkedRanges,
            };
            if (
                linkedRanges[trigger.id] &&
                linkedRanges[trigger.id][rangeIndex]
            ) {
                linkedRanges[trigger.id][rangeIndex] = {
                    ...linkedRanges[trigger.id][rangeIndex],
                    quantity: option.value,
                };
            }
            return { ...state, linkedRanges: linkedRanges };
        });
    };

    private readonly onLinkedProductsChange = (
        trigger: IProduct,
        suggestParent: IProduct,
        opts: SelectOption | ReadonlyArray<SelectOption> | null | undefined
    ) => {
        let options: ReadonlyArray<SelectOption>;
        if (!opts) {
            options = [];
        } else if (_isSelectOption(opts)) {
            options = [opts];
        } else {
            options = opts;
        }
        const ids = options.map((o) => {
            return o.value;
        });
        this.setState((state) => {
            const oldIDs = (state.linkedProducts[trigger.id] || []).filter(
                (sid) => {
                    const suggestion = this.getProduct(sid);
                    return (
                        suggestion.id !== suggestParent.id &&
                        suggestion.parent !== suggestParent.id
                    );
                }
            );
            const newIDs = oldIDs.concat(ids).filter((id, i, _ids) => {
                return _ids.indexOf(id) === i;
            });
            const linkedProducts = {
                ...state.linkedProducts,
                [trigger.id]: newIDs,
            };
            return { ...state, linkedProducts: linkedProducts };
        });
    };

    private readonly onCancel = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        this.props.onCancel();
    };

    private readonly onSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data: IBundleGroup = {
            id: this.props.group ? this.props.group.id : null,
            bundle_type: this.state.bundleType,
            name: this.state.name,
            description: this.state.description,
            headline: this.state.headline,
            is_active: this.state.is_active,
            image: this.props.group ? this.props.group.image : "",
            newImage: this.state.clearImage ? null : this.state.image,
            clearImage: this.state.clearImage,
            triggering_parents: this.state.triggeringParents,
            suggested_parents: this.state.suggestedParents,
            concrete_bundles: [],
            user_configurable_bundles: [],
        };

        Object.keys(this.state.linkedRanges).forEach((tID) => {
            const triggerID = parseInt(tID, 10);
            const tProduct = this.getProduct(triggerID);
            if (
                data.triggering_parents.indexOf(tProduct.id) === -1 &&
                (!tProduct.parent ||
                    data.triggering_parents.indexOf(tProduct.parent) === -1)
            ) {
                return;
            }
            const linkedRanges = this.state.linkedRanges[triggerID];
            linkedRanges.forEach(({ rangeID, quantity }) => {
                if (!rangeID || !quantity) {
                    return;
                }
                let preExistingBundle: IUserConfigurableBundle | undefined =
                    undefined;
                if (this.props.group) {
                    preExistingBundle =
                        this.props.group.user_configurable_bundles.find((b) => {
                            return (
                                b.triggering_product === triggerID &&
                                b.suggested_range === rangeID
                            );
                        });
                }
                data.user_configurable_bundles.push({
                    id: preExistingBundle ? preExistingBundle.id : null,
                    triggering_product: triggerID,
                    suggested_range: rangeID,
                    quantity: quantity,
                });
            });
        });

        Object.keys(this.state.linkedProducts).forEach((tID) => {
            const triggerID = parseInt(tID, 10);
            const tProduct = this.getProduct(triggerID);
            if (
                data.triggering_parents.indexOf(tProduct.id) === -1 &&
                (!tProduct.parent ||
                    data.triggering_parents.indexOf(tProduct.parent) === -1)
            ) {
                return;
            }

            let preExistingBundle: IConcreteBundle | undefined = undefined;
            if (this.props.group) {
                preExistingBundle = this.props.group.concrete_bundles.find(
                    (b) => {
                        return b.triggering_product === triggerID;
                    }
                );
            }

            const suggestionIDs = this.state.linkedProducts[triggerID].filter(
                (sID) => {
                    const sProduct = this.getProduct(sID);
                    return (
                        data.suggested_parents.indexOf(sProduct.id) !== -1 ||
                        (sProduct.parent &&
                            data.suggested_parents.indexOf(sProduct.parent) !==
                                -1)
                    );
                }
            );

            if (suggestionIDs.length <= 0) {
                return;
            }

            data.concrete_bundles.push({
                id: preExistingBundle ? preExistingBundle.id : null,
                triggering_product: triggerID,
                suggested_products: suggestionIDs,
            });
        });

        this.props.onSave(data);
    };

    private readonly onClearImage = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            clearImage: e.currentTarget.checked,
        });
    };

    private readonly getProduct = (productID: number) => {
        return this.productIdx[productID];
    };

    componentWillReceiveProps(nextProps: IProps) {
        this.fillProductIdx(nextProps.products);
    }

    private fillProductIdx(products: IProduct[]) {
        this.productIdx = {};
        products.forEach((p) => {
            this.productIdx[p.id] = p;
        });
    }

    render() {
        return (
            <form className="row bundle-group-edit" onSubmit={this.onSave}>
                <BundleGroupMetaFields
                    bundleTypeChoices={this.props.bundleTypeChoices}
                    group={this.props.group}
                    isSaving={this.props.isSaving}
                    errors={this.props.errors}
                    bundleType={this.state.bundleType}
                    name={this.state.name}
                    headline={this.state.headline}
                    description={this.state.description}
                    is_active={this.state.is_active || false}
                    image={this.state.image}
                    clearImage={this.state.clearImage}
                    onEdit={this.onEdit}
                    onSelectImage={this.onSelectImage}
                    onClearImage={this.onClearImage}
                />
                <ParentProductsEditForm
                    products={this.props.products}
                    isSaving={this.props.isSaving}
                    errors={this.props.errors}
                    triggeringParents={this.state.triggeringParents}
                    suggestedParents={this.state.suggestedParents}
                    onSelectParent={this.onSelectParent}
                />
                <UserConfigurableBundles
                    ranges={this.props.ranges}
                    isSaving={this.props.isSaving}
                    triggeringParents={this.state.triggeringParents}
                    linkedRanges={this.state.linkedRanges}
                    getProduct={this.getProduct}
                    onLinkedRangesChange={this.onLinkedRangesChange}
                    onLinkedRangeQuantityChange={
                        this.onLinkedRangesQuantityChange
                    }
                />
                <ConcreteBundles
                    products={this.props.products}
                    isSaving={this.props.isSaving}
                    triggeringParents={this.state.triggeringParents}
                    suggestedParents={this.state.suggestedParents}
                    linkedProducts={this.state.linkedProducts}
                    getProduct={this.getProduct}
                    onLinkedProductsChange={this.onLinkedProductsChange}
                />
                <BundleGroupEditFormActions onCancel={this.onCancel} />
            </form>
        );
    }
}

export default BundleGroupEditForm;
