import React from "react";
import classNames from "classnames";
import Select from "react-select";
import { IProduct, SelectOption } from "../../../utils/models.interfaces";

interface IProps {
    products: IProduct[];
    isSaving: boolean;
    errors: {
        triggering_parents?: string[];
        suggested_parents?: string[];
    };
    triggeringParents: number[];
    suggestedParents: number[];
    onSelectParent: (
        name: "triggeringParents" | "suggestedParents",
        opts: SelectOption | ReadonlyArray<SelectOption> | null | undefined,
    ) => void;
}

interface IState {}

export class ParentProductsEditForm extends React.PureComponent<
    IProps,
    IState
> {
    private getParentProductSelectOptions() {
        return this.props.products
            .filter((p) => {
                return !p.is_child;
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

    private buildFormGroupClasses(
        field: keyof IProps["errors"],
        extras: string[],
    ) {
        const fieldErrors = this.props.errors[field];
        const classes: { [name: string]: boolean } = {
            "form-group": true,
            "has-error": fieldErrors ? fieldErrors.length > 0 : false,
        };
        extras.forEach((className) => {
            classes[className] = true;
        });
        return classNames(classes);
    }

    private buildErrors(field: keyof IProps["errors"]) {
        return (this.props.errors[field] || []).map((errorMsg, i) => {
            return (
                <span key={i} className="help-block">
                    <i className="fas fa-exclamation"></i> {errorMsg}
                </span>
            );
        });
    }

    render() {
        const parentProductSelectOptions = this.getParentProductSelectOptions();
        return (
            <div className="col-sm-12 bundle-group-edit__section">
                <h1>{gettext("Relevant Products")}</h1>
                <p>
                    <em>
                        {gettext(
                            "Select the parent and standalone products revelant to this bundle group.",
                        )}
                    </em>
                </p>
                <div className="row">
                    <div
                        className={this.buildFormGroupClasses(
                            "triggering_parents",
                            ["col-sm-6"],
                        )}
                    >
                        <label htmlFor="id_image" className="control-label">
                            {gettext("Triggers")}
                        </label>
                        <div>
                            <Select
                                name="triggeringParents"
                                isMulti={true}
                                value={parentProductSelectOptions.filter((o) =>
                                    this.props.triggeringParents.includes(
                                        o.value,
                                    ),
                                )}
                                onChange={this.props.onSelectParent.bind(
                                    this,
                                    "triggeringParents",
                                )}
                                options={parentProductSelectOptions}
                                isDisabled={this.props.isSaving}
                            />
                            {this.buildErrors("triggering_parents")}
                        </div>
                    </div>
                    <div
                        className={this.buildFormGroupClasses(
                            "suggested_parents",
                            ["col-sm-6"],
                        )}
                    >
                        <label htmlFor="id_image" className="control-label">
                            {gettext("Suggestions")}
                        </label>
                        <div>
                            <Select
                                name="suggestedProducts"
                                isMulti={true}
                                value={parentProductSelectOptions.filter((o) =>
                                    this.props.suggestedParents.includes(
                                        o.value,
                                    ),
                                )}
                                onChange={this.props.onSelectParent.bind(
                                    this,
                                    "suggestedParents",
                                )}
                                options={parentProductSelectOptions}
                                isDisabled={this.props.isSaving}
                            />
                            {this.buildErrors("suggested_parents")}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
