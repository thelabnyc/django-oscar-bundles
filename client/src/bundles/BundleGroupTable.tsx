import React from "react";
import lunr from "lunr";
import Modal from "react-modal";
import {
    getBundleTypeChoices,
    listBundleGroups,
    listProducts,
    listRanges,
    saveBundleGroup,
    deleteBundleGroup,
} from "../utils/api";
import {
    IBundleGroup,
    IProduct,
    IRange,
    IDRFSelectOptions,
} from "../utils/models.interfaces";
import BundleGroupSearchForm from "./molecules/BundleGroupSearchForm";
import BundleGroupEditForm from "./molecules/BundleGroupEditForm";
import BundleGroupTableRow from "./molecules/BundleGroupTableRow";

import "./BundleGroupTable.scss";

Modal.setAppElement("#bundlegroup-table");

const modalStyles = {
    overlay: {
        backgroundColor: "rgba(51, 51, 51, 0.8)",
        zIndex: 2000,
    },
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        minWidth: "800px",
        maxWidth: "1000px",
        maxHeight: "90%",
    },
};

export interface IProps {
    bundleGroupURL: string;
    concreteBundleURL: string;
    concreteBundleProductChoiceURL: string;
    userConfigurableBundleURL: string;
    userConfigurableBundleRangeChoiceURL: string;
}

export interface IState {
    bundleTypeChoices: IDRFSelectOptions;
    groups: IBundleGroup[];
    products: IProduct[];
    ranges: IRange[];
    searchText: string;
    selectedGroup: number | null;
    editModalOpen: boolean;
    isSaving: boolean;
    isLoading: boolean;
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

    state: IState = {
        bundleTypeChoices: [],
        groups: [],
        products: [],
        ranges: [],
        searchText: "",
        selectedGroup: null,
        editModalOpen: false,
        isSaving: false,
        isLoading: true,
        formErrors: {},
    };

    private readonly onSearchTextChange = (text: string) => {
        this.setState({
            searchText: text,
        });
    };

    private readonly onCreate = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        this.openCreateModal();
    };

    private readonly onOpenEditModal = (group: IBundleGroup) => {
        this.setState({
            selectedGroup: group.id,
            formErrors: {},
            editModalOpen: true,
        });
    };

    private readonly onCloseModal = () => {
        this.setState({
            selectedGroup: null,
            formErrors: {},
            editModalOpen: false,
        });
    };

    private readonly onSaveBundleGroup = async (data: IBundleGroup) => {
        this.setState({ isSaving: true });
        try {
            await saveBundleGroup(this.props.bundleGroupURL, data);
            await this.loadData();
            this.setState({ isSaving: false });
            this.onCloseModal();
        } catch (err) {
            this.setState({
                isSaving: false,
                /* tslint:disable-next-line */
                formErrors: (err as any).response.body,
            });
        }
    };

    private readonly onDeleteBundleGroup = async (data: IBundleGroup) => {
        await deleteBundleGroup(this.props.bundleGroupURL, data);
        return this.loadData();
    };

    componentDidMount() {
        this.loadData();
    }

    private async loadData() {
        this.setState({ isLoading: true });
        const loading = Promise.all([
            getBundleTypeChoices(this.props.bundleGroupURL),
            listBundleGroups(this.props.bundleGroupURL),
            listProducts(this.props.concreteBundleProductChoiceURL),
            listRanges(this.props.userConfigurableBundleRangeChoiceURL),
        ]);
        const [choices, groups, products, ranges] = await loading;
        this.setBundleTypeChoices(choices);
        this.setGroups(groups);
        this.setProducts(products);
        this.setRanges(ranges);
        this.setState({ isLoading: false });
    }

    private openCreateModal() {
        this.setState({
            selectedGroup: null,
            formErrors: {},
            editModalOpen: true,
        });
    }

    private setGroups(groups: IBundleGroup[]) {
        // Update the search index
        this.idx = lunr(function () {
            const builder = this;
            builder.ref("id");
            builder.field("name");
            builder.field("description");
            groups.forEach((g) => {
                builder.add(g);
            });
        });
        // Update the component state
        this.setState({
            groups: groups,
        });
    }

    private setBundleTypeChoices(choices: IDRFSelectOptions) {
        this.setState({
            bundleTypeChoices: choices,
        });
    }

    private setProducts(products: IProduct[]) {
        this.setState({
            products: products,
        });
    }

    private setRanges(ranges: IRange[]) {
        this.setState({
            ranges: ranges,
        });
    }

    private getSearchResults(searchText: string) {
        if (!this.idx) {
            return [];
        }
        const results = this.idx.search(searchText);
        return results
            .map((result) => {
                const gid = parseInt(result.ref, 10);
                return this.state.groups.find((g) => {
                    return g.id === gid;
                });
            })
            .filter((group): group is IBundleGroup => {
                return !!group;
            });
    }

    private buildGroupRows() {
        const searchText = this.state.searchText.trim();
        const results = searchText
            ? this.getSearchResults(searchText)
            : this.state.groups;
        const numTableColumns = 6;
        if (this.state.isLoading) {
            return (
                <tr>
                    <td colSpan={numTableColumns}>
                        <em>{gettext("Loading…")}</em>
                    </td>
                </tr>
            );
        }
        if (results.length <= 0) {
            const msg = searchText
                ? interpolate(
                      gettext(
                          "No bundle groups found for search: %(searchText)s",
                      ),
                      { searchText: searchText },
                      true,
                  )
                : gettext("No bundle groups found.");
            return (
                <tr>
                    <td colSpan={numTableColumns}>{msg}</td>
                </tr>
            );
        }
        return results.map((group) => {
            return (
                <BundleGroupTableRow
                    key={`${group.id}`}
                    bundleTypeChoices={this.state.bundleTypeChoices}
                    group={group}
                    products={this.state.products}
                    ranges={this.state.ranges}
                    onEdit={this.onOpenEditModal}
                    onDelete={this.onDeleteBundleGroup}
                />
            );
        });
    }

    private buildEditModal() {
        const group = this.state.groups.find((g) => {
            return g.id === this.state.selectedGroup;
        });
        return (
            <Modal
                contentLabel={gettext("Edit Bundle Group")}
                style={modalStyles}
                isOpen={this.state.editModalOpen}
            >
                <BundleGroupEditForm
                    bundleTypeChoices={this.state.bundleTypeChoices}
                    group={group || null}
                    products={this.state.products}
                    ranges={this.state.ranges}
                    isSaving={this.state.isSaving}
                    errors={this.state.formErrors}
                    onCancel={this.onCloseModal}
                    onSave={this.onSaveBundleGroup}
                />
            </Modal>
        );
    }

    render() {
        return (
            <div>
                <div className="page-header">
                    <a
                        className="btn btn-primary float-right"
                        onClick={this.onCreate}
                    >
                        <i className="fas fa-plus-circle"></i>{" "}
                        {gettext("Create new bundle group")}
                    </a>
                    <h1>{gettext("Bundle Groups")}</h1>
                </div>
                <div className="table-header">
                    <h3>
                        <i className="fas fa-search"></i>
                        {gettext("Search Bundle Groups")}
                    </h3>
                </div>
                <BundleGroupSearchForm
                    searchText={this.state.searchText}
                    onChange={this.onSearchTextChange}
                />

                <table className="table table-striped table-bordered">
                    <tbody>
                        <tr>
                            <th>{gettext("Name")}</th>
                            <th>{gettext("Type")}</th>
                            <th>{gettext("Image")}</th>
                            <th>{gettext("Triggers")}</th>
                            <th>{gettext("Suggestions")}</th>
                            <th>{gettext("Active Status")}</th>
                            <th>{gettext("Actions")}</th>
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
