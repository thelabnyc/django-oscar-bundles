import React from "react";

interface IProps {
    onCancel: (e: React.MouseEvent<HTMLElement>) => void;
}

export class BundleGroupEditFormActions extends React.PureComponent<IProps> {
    render() {
        return (
            <div className="col-sm-12 bundle-group-edit__section">
                <div className="form-group">
                    <a
                        className="btn btn-secondary"
                        onClick={this.props.onCancel}
                    >
                        {gettext("Cancel")}
                    </a>{" "}
                    <button className="btn btn-primary" type="submit">
                        {gettext("Save")}
                    </button>
                </div>
            </div>
        );
    }
}
