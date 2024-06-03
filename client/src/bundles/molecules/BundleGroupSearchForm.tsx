import React from "react";

export interface IProps {
    searchText: string;
    onChange: (searchText: string) => void;
}

export interface IState {}

class BundleGroupSearchForm extends React.PureComponent<IProps, IState> {
    render() {
        const onChange = (e: React.FormEvent<HTMLInputElement>) => {
            e.preventDefault();
            this.props.onChange(e.currentTarget.value);
        };

        const onClear = (e: React.FormEvent<HTMLButtonElement>) => {
            e.preventDefault();
            this.props.onChange("");
        };

        const onSubmit = function (e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault();
        };

        return (
            <div className="card card-body bg-light">
                <form className="form-inline" onSubmit={onSubmit}>
                    <span className="form-group">
                        <label htmlFor="id_text">{gettext("Search:")}</label>
                        <input
                            className="form-control"
                            id="id_text"
                            value={this.props.searchText}
                            onChange={onChange}
                        />
                    </span>{" "}
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClear}
                    >
                        {gettext("Clear Search")}
                    </button>
                </form>
            </div>
        );
    }
}

export default BundleGroupSearchForm;
