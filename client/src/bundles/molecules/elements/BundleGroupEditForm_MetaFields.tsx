import React from "react";
import classNames from "classnames";
import {
    IBundleGroup,
    IDRFSelectOptions,
} from "../../../utils/models.interfaces";

interface IProps {
    bundleTypeChoices: IDRFSelectOptions;
    group: IBundleGroup | null;
    isSaving: boolean;
    errors: {
        bundleType?: string[];
        isActive?: string[];
        name?: string[];
        headline?: string[];
        description?: string[];
        image?: string[];
    };
    bundleType: string;
    name: string;
    headline: string;
    isActive: boolean;
    description: string;
    image: File | null;
    clearImage: boolean;

    onEdit: (
        e: React.FormEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => void;
    onSelectImage: (e: React.FormEvent<HTMLInputElement>) => void;
    onClearImage: (e: React.FormEvent<HTMLInputElement>) => void;
}

interface IState {}

export class BundleGroupMetaFields extends React.PureComponent<IProps, IState> {
    private buildFormGroupClasses(field: keyof IProps["errors"]) {
        const fieldErrors = this.props.errors[field];
        const classes: { [name: string]: boolean } = {
            "form-group": true,
            "has-error": fieldErrors ? fieldErrors.length > 0 : false,
        };
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

    private buildCurrentImage() {
        if (!this.props.group || !this.props.group.image) {
            return null;
        }
        const pathParts = this.props.group.image.split("/");
        const fileName = pathParts[pathParts.length - 1];
        return (
            <span>
                {gettext("Currently:")}{" "}
                <a
                    target="_blank"
                    rel="noreferrer"
                    href={this.props.group.image}
                >
                    {fileName}
                </a>{" "}
                <input
                    type="checkbox"
                    id="bundle-edit-form-clear-img"
                    checked={this.props.clearImage}
                    onChange={this.props.onClearImage}
                    disabled={this.props.isSaving}
                />{" "}
                <label htmlFor="bundle-edit-form-clear-img">
                    {gettext("Clear")}
                </label>
            </span>
        );
    }

    render() {
        const title = this.props.group
            ? gettext("Edit Bundle Group")
            : gettext("Create Bundle Group");
        return (
            <div className="col-sm-12 bundle-group-edit__section">
                <h1>{title}</h1>
                <div className={this.buildFormGroupClasses("bundleType")}>
                    <label htmlFor="id_bundleType" className="control-label">
                        {gettext("Bundle Type")}
                    </label>
                    <div>
                        <select
                            id="id_bundleType"
                            name="bundleType"
                            className="form-control"
                            value={this.props.bundleType}
                            onChange={this.props.onEdit}
                            disabled={this.props.isSaving}
                        >
                            {this.props.bundleTypeChoices.map((choice) => {
                                return (
                                    <option
                                        key={choice.value}
                                        value={choice.value}
                                    >
                                        {choice.display_name}
                                    </option>
                                );
                            })}
                        </select>
                        {this.buildErrors("bundleType")}
                    </div>
                </div>
                <div className={this.buildFormGroupClasses("name")}>
                    <label htmlFor="id_name" className="control-label">
                        {gettext("Name")}
                    </label>
                    <div>
                        <input
                            id="id_name"
                            name="name"
                            maxLength={200}
                            className="form-control"
                            value={this.props.name}
                            onChange={this.props.onEdit}
                            disabled={this.props.isSaving}
                        />
                        {this.buildErrors("name")}
                    </div>
                </div>
                <div className={this.buildFormGroupClasses("headline")}>
                    <label htmlFor="id_headline" className="control-label">
                        {gettext("Headline")}
                    </label>
                    <div>
                        <textarea
                            id="id_headline"
                            name="headline"
                            cols={40}
                            rows={4}
                            className="form-control"
                            value={this.props.headline}
                            onChange={this.props.onEdit}
                            disabled={this.props.isSaving}
                        ></textarea>
                        {this.buildErrors("headline")}
                    </div>
                </div>
                <div className={this.buildFormGroupClasses("isActive")}>
                    <label htmlFor="id_active_status" className="control-label">
                        {gettext("Active Status")}
                    </label>
                    <div>
                        <select
                            id="id_isActive"
                            name="isActive"
                            className="form-control"
                            value={String(this.props.isActive)}
                            onChange={this.props.onEdit}
                            disabled={this.props.isSaving}
                        >
                            {[
                                { display_name: "Active", value: "true" },
                                { display_name: "Inactive", value: "false" },
                            ].map((choice, index) => {
                                return (
                                    <option key={index} value={choice.value}>
                                        {choice.display_name}
                                    </option>
                                );
                            })}
                        </select>
                        {this.buildErrors("isActive")}
                    </div>
                </div>
                <div className={this.buildFormGroupClasses("description")}>
                    <label htmlFor="id_description" className="control-label">
                        {gettext("Description")}
                    </label>
                    <div>
                        <textarea
                            id="id_description"
                            name="description"
                            cols={40}
                            rows={4}
                            className="form-control"
                            value={this.props.description}
                            onChange={this.props.onEdit}
                            disabled={this.props.isSaving}
                        ></textarea>
                        {this.buildErrors("description")}
                    </div>
                </div>
                <div className={this.buildFormGroupClasses("image")}>
                    <label htmlFor="id_image" className="control-label">
                        {gettext("Image")}
                    </label>
                    <div>
                        {this.buildCurrentImage()}
                        <input
                            id="id_image"
                            type="file"
                            name="image"
                            className="form-control"
                            onChange={this.props.onSelectImage}
                            disabled={this.props.isSaving}
                        />
                        {this.buildErrors("image")}
                    </div>
                </div>
            </div>
        );
    }
}
