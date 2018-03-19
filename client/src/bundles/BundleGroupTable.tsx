import React = require('react');
import lunr = require('lunr');
import Modal = require('react-modal');
import {getBundleTypeChoices, listBundleGroups, listProducts, saveBundleGroup, deleteBundleGroup} from '../utils/api';
import {IBundleGroup, IProduct, ICharFieldChoice} from '../utils/api.interfaces';
import BundleGroupSearchForm from './molecules/BundleGroupSearchForm';
import BundleGroupEditForm from './molecules/BundleGroupEditForm';
import BundleGroupTableRow from './molecules/BundleGroupTableRow';

import './BundleGroupTable.scss';


Modal.setAppElement('#bundlegroup-table');

const modalStyles = {
    overlay: {
        backgroundColor: 'rgba(51, 51, 51, 0.8)',
        zIndex: '2000',
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '800px',
        maxWidth: '1000px',
        maxHeight: '80%',
    },
};


export interface IProps {
    bundleURL: string;
    bundleGroupURL: string;
    productChoiceURL: string;
}


export interface IState {
    bundleTypeChoices: ICharFieldChoice[];
    groups: IBundleGroup[];
    products: IProduct[];
    searchText: string;
    selectedGroup: number | null;
    editModalOpen: boolean;
    isSaving: boolean;
    formErrors: {
        name?: string[];
        description?: string[];
        image?: string[];
        triggering_parents?: string[];
        suggested_parents?: string[];
    };
}


class BundleGroupTable extends React.Component<IProps, IState> {
    idx: lunr.Index | undefined;

    constructor (props: IProps) {
        super(props);
        this.state = {
            bundleTypeChoices: [],
            groups: [],
            products: [],
            searchText: '',
            selectedGroup: null,
            editModalOpen: false,
            isSaving: false,
            formErrors: {},
        };
    }


    componentDidMount () {
        this.loadData();
    }


    private loadData () {
        const self = this;
        const loading = Promise.all([
            getBundleTypeChoices(this.props.bundleGroupURL),
            listBundleGroups(this.props.bundleGroupURL),
            listProducts(this.props.productChoiceURL),
        ]);
        return loading.then(([choices, groups, products]) => {
            self.setBundleTypeChoices(choices);
            self.setGroups(groups);
            self.setProducts(products);
        });
    }


    private openEditModal (group: IBundleGroup) {
        this.setState({
            selectedGroup: group.id,
            formErrors: {},
            editModalOpen: true,
        });
    }


    private openCreateModal () {
        this.setState({
            selectedGroup: null,
            formErrors: {},
            editModalOpen: true,
        });
    }


    private closeModal () {
        this.setState({
            selectedGroup: null,
            formErrors: {},
            editModalOpen: false,
        });
    }


    private saveBundleGroup (data: IBundleGroup) {
        const self = this;
        this.setState({ isSaving: true, });
        saveBundleGroup(this.props.bundleGroupURL, data)
            .then(() => {
                return self.loadData();
            })
            .then(() => {
                self.setState({ isSaving: false, });
                self.closeModal();
            })
            .catch((err) => {
                self.setState({
                    isSaving: false,
                    formErrors: err.response.body,
                });
            });
    }


    private deleteBundleGroup (data: IBundleGroup) {
        const self = this;
        deleteBundleGroup(this.props.bundleGroupURL, data)
            .then(() => {
                return self.loadData();
            });
    }


    private setGroups (groups: IBundleGroup[]) {
        // Update the search index
        this.idx = lunr(function() {
            const builder = this;
            builder.ref('id');
            builder.field('name');
            builder.field('description');
            groups.forEach((g) => {
                builder.add(g);
            });
        });

        // Update the component state
        this.setState({
            groups: groups,
        });
    }


    private setBundleTypeChoices (choices: ICharFieldChoice[]) {
        this.setState({
            bundleTypeChoices: choices,
        });
    }


    private setProducts (products: IProduct[]) {
        this.setState({
            products: products,
        });
    }


    private getSearchResults (searchText: string) {
        if (!this.idx) {
            return [];
        }
        const self = this;
        const results = this.idx.search(searchText);
        return results
            .map((result) => {
                const gid = parseInt(result.ref, 10);
                return self.state.groups.find((g) => {
                    return g.id === gid;
                });
            })
            .filter((group) => {
                return !!group;
            });
    }


    private buildGroupRows () {
        const self = this;
        const searchText = this.state.searchText.trim();
        const results = searchText
            ? this.getSearchResults(searchText)
            : this.state.groups;

        if (results.length <= 0) {
            const msg = searchText
                ? `No bundle groups found for search: ${searchText}`
                : 'No bundle groups found.';
            return (
                <tr>
                    <td colSpan={5}>{msg}</td>
                </tr>
            );
        }

        return results.map((group) => {
            return (
                <BundleGroupTableRow key={group.id}
                                     bundleTypeChocies={this.state.bundleTypeChoices}
                                     group={group}
                                     products={this.state.products}
                                     onEdit={(g) => { self.openEditModal(g); }}
                                     onDelete={(g) => { self.deleteBundleGroup(g); }} />
            );
        });
    }


    private buildEditModal () {
        const self = this;
        const group = this.state.groups.find((g) => {
            return g.id === self.state.selectedGroup;
        });
        return (
            <Modal contentLabel="Edit Bundle Group"
                   style={modalStyles}
                   isOpen={this.state.editModalOpen}>
                <BundleGroupEditForm bundleTypeChoices={this.state.bundleTypeChoices}
                                     group={group}
                                     products={this.state.products}
                                     isSaving={this.state.isSaving}
                                     errors={this.state.formErrors}
                                     onCancel={() => { self.closeModal(); }}
                                     onSave={(d) => { self.saveBundleGroup(d); }} />
            </Modal>
        );
    }


    render () {
        const self = this;

        const onSearchTextChange = function(text: string) {
            self.setState({
                searchText: text,
            });
        };

        const onCreate = function(e: React.MouseEvent<HTMLElement>) {
            e.preventDefault();
            self.openCreateModal();
        };

        return (
            <div>
                <div className="page-header">
                    <a className="btn btn-primary btn-lg pull-right" onClick={onCreate}>
                        <i className="icon-plus"></i>{' '}Create new bundle group
                    </a>
                    <h1>Bundle Groups</h1>
                </div>
                <div className="table-header">
                    <h3><i className="icon-search icon-large"></i>Search Bundle Groups</h3>
                </div>
                <BundleGroupSearchForm searchText={this.state.searchText}
                                       onChange={onSearchTextChange} />

                <table className="table table-striped table-bordered">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Image</th>
                            <th>Triggers</th>
                            <th>Suggestions</th>
                            <th>Actions</th>
                        </tr>
                        {this.buildGroupRows()}
                    </tbody>
                </table>

                {this.buildEditModal()}
            </div>
        );
    }
}

export default BundleGroupTable;
