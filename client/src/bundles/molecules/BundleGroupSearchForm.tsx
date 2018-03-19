import React = require('react');


export interface IProps {
    searchText: string;
    onChange: (searchText: string) => void;
}


export interface IState {
}


class BundleGroupSearchForm extends React.PureComponent<IProps, IState> {

    render () {
        const self = this;

        const onChange = function(e: React.FormEvent<HTMLInputElement>) {
            e.preventDefault();
            self.props.onChange(e.currentTarget.value);
        };

        const onClear = function(e: React.FormEvent<HTMLButtonElement>) {
            e.preventDefault();
            self.props.onChange("");
        };

        const onSubmit = function(e: React.FormEvent<HTMLFormElement>) {
            e.preventDefault();
        };

        return (
            <div className="well">
                <form className="form-inline" onSubmit={onSubmit}>
                    <span className="form-group">
                        <label htmlFor="id_text">Search:</label>
                        <input className="form-control"
                               id="id_text"
                               value={this.props.searchText}
                               onChange={onChange} />
                    </span>
                    {' '}
                    <button type="button" className="btn btn-default" onClick={onClear}>Clear Search</button>
                </form>
            </div>
        );
    }
}

export default BundleGroupSearchForm;
