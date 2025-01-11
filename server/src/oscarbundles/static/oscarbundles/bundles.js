/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/bundles.tsx":
/*!*************************!*\
  !*** ./src/bundles.tsx ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_immediate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.immediate.js */ "./node_modules/core-js/modules/web.immediate.js");
/* harmony import */ var core_js_modules_web_immediate_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_immediate_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _bundles_BundleGroupTable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./bundles/BundleGroupTable */ "./src/bundles/BundleGroupTable.tsx");
 // Load polyfills needed for IE11 and other old browsers



const main = function () {
  const elem = document.querySelector("#bundlegroup-table");
  const bundleGroupTypeURL = elem.dataset.bundlegrouptypeApi || "";
  const bundleGroupURL = elem.dataset.bundlegroupApi || "";
  const concreteBundleURL = elem.dataset.concretebundleApi || "";
  const concreteBundleProductChoiceURL = elem.dataset.concretebundleProductChoiceApi || "";
  const userConfigurableBundleURL = elem.dataset.userconfigurablebundleApi || "";
  const userConfigurableBundleRangeChoiceURL = elem.dataset.userconfigurablebundleRangeChoiceApi || "";
  const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_2__.createRoot)(elem);
  root.render(/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_bundles_BundleGroupTable__WEBPACK_IMPORTED_MODULE_3__["default"], {
    bundleGroupTypeURL: bundleGroupTypeURL,
    bundleGroupURL: bundleGroupURL,
    concreteBundleURL: concreteBundleURL,
    concreteBundleProductChoiceURL: concreteBundleProductChoiceURL,
    userConfigurableBundleURL: userConfigurableBundleURL,
    userConfigurableBundleRangeChoiceURL: userConfigurableBundleRangeChoiceURL
  }));
};
main();

/***/ }),

/***/ "./src/bundles/BundleGroupTable.tsx":
/*!******************************************!*\
  !*** ./src/bundles/BundleGroupTable.tsx ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lunr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lunr */ "./node_modules/lunr/lunr.js");
/* harmony import */ var lunr__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lunr__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-modal */ "./node_modules/react-modal/lib/index.js");
/* harmony import */ var react_modal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_modal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/api */ "./src/utils/api.ts");
/* harmony import */ var _molecules_BundleGroupSearchForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./molecules/BundleGroupSearchForm */ "./src/bundles/molecules/BundleGroupSearchForm.tsx");
/* harmony import */ var _molecules_BundleGroupEditForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./molecules/BundleGroupEditForm */ "./src/bundles/molecules/BundleGroupEditForm.tsx");
/* harmony import */ var _molecules_BundleGroupTableRow__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./molecules/BundleGroupTableRow */ "./src/bundles/molecules/BundleGroupTableRow.tsx");
/* harmony import */ var _BundleGroupTable_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./BundleGroupTable.scss */ "./src/bundles/BundleGroupTable.scss");









react_modal__WEBPACK_IMPORTED_MODULE_2___default().setAppElement("#bundlegroup-table");
const modalStyles = {
  overlay: {
    backgroundColor: "rgba(51, 51, 51, 0.8)",
    zIndex: 2000
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
    maxHeight: "90%"
  }
};
class BundleGroupTable extends (react__WEBPACK_IMPORTED_MODULE_0___default().Component) {
  constructor() {
    super(...arguments);
    this.state = {
      bundleTypeChoices: [],
      groups: [],
      products: [],
      ranges: [],
      searchText: "",
      selectedGroup: null,
      editModalOpen: false,
      isSaving: false,
      isLoading: true,
      formErrors: {}
    };
    this.onSearchTextChange = text => {
      this.setState({
        searchText: text
      });
    };
    this.onCreate = e => {
      e.preventDefault();
      this.openCreateModal();
    };
    this.onOpenEditModal = group => {
      this.setState({
        selectedGroup: group.id,
        formErrors: {},
        editModalOpen: true
      });
    };
    this.onCloseModal = () => {
      this.setState({
        selectedGroup: null,
        formErrors: {},
        editModalOpen: false
      });
    };
    this.onSaveBundleGroup = data => (0,tslib__WEBPACK_IMPORTED_MODULE_8__.__awaiter)(this, void 0, void 0, function* () {
      this.setState({
        isSaving: true
      });
      try {
        yield (0,_utils_api__WEBPACK_IMPORTED_MODULE_3__.saveBundleGroup)(this.props.bundleGroupURL, data);
        yield this.loadData();
        this.setState({
          isSaving: false
        });
        this.onCloseModal();
      } catch (err) {
        this.setState({
          isSaving: false,
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment */
          formErrors: err.response.body
        });
      }
    });
    this.onDeleteBundleGroup = data => (0,tslib__WEBPACK_IMPORTED_MODULE_8__.__awaiter)(this, void 0, void 0, function* () {
      yield (0,_utils_api__WEBPACK_IMPORTED_MODULE_3__.deleteBundleGroup)(this.props.bundleGroupURL, data);
      return this.loadData();
    });
  }
  componentDidMount() {
    this.loadData().catch(err => {
      console.error(err);
    });
  }
  loadData() {
    return (0,tslib__WEBPACK_IMPORTED_MODULE_8__.__awaiter)(this, void 0, void 0, function* () {
      this.setState({
        isLoading: true
      });
      const loading = Promise.all([(0,_utils_api__WEBPACK_IMPORTED_MODULE_3__.listBundleGroupTypes)(this.props.bundleGroupTypeURL), (0,_utils_api__WEBPACK_IMPORTED_MODULE_3__.listBundleGroups)(this.props.bundleGroupURL), (0,_utils_api__WEBPACK_IMPORTED_MODULE_3__.listProducts)(this.props.concreteBundleProductChoiceURL), (0,_utils_api__WEBPACK_IMPORTED_MODULE_3__.listRanges)(this.props.userConfigurableBundleRangeChoiceURL)]);
      const [choices, groups, products, ranges] = yield loading;
      this.setBundleTypeChoices(choices);
      this.setGroups(groups);
      this.setProducts(products);
      this.setRanges(ranges);
      this.setState({
        isLoading: false
      });
    });
  }
  openCreateModal() {
    this.setState({
      selectedGroup: null,
      formErrors: {},
      editModalOpen: true
    });
  }
  setGroups(groups) {
    // Update the search index
    this.idx = lunr__WEBPACK_IMPORTED_MODULE_1___default()(function () {
      this.ref("id");
      this.field("name");
      this.field("description");
      groups.forEach(g => {
        this.add(g);
      });
    });
    // Update the component state
    this.setState({
      groups: groups
    });
  }
  setBundleTypeChoices(choices) {
    this.setState({
      bundleTypeChoices: choices
    });
  }
  setProducts(products) {
    this.setState({
      products: products
    });
  }
  setRanges(ranges) {
    this.setState({
      ranges: ranges
    });
  }
  getSearchResults(searchText) {
    if (!this.idx) {
      return [];
    }
    const results = this.idx.search(searchText);
    return results.map(result => {
      const gid = parseInt(result.ref, 10);
      return this.state.groups.find(g => {
        return g.id === gid;
      });
    }).filter(group => {
      return !!group;
    });
  }
  buildGroupRows() {
    const searchText = this.state.searchText.trim();
    const results = searchText ? this.getSearchResults(searchText) : this.state.groups;
    const numTableColumns = 6;
    if (this.state.isLoading) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", {
        colSpan: numTableColumns
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("em", null, gettext("Loading…"))));
    }
    if (results.length <= 0) {
      const msg = searchText ? interpolate(gettext("No bundle groups found for search: %(searchText)s"), {
        searchText: searchText
      }, true) : gettext("No bundle groups found.");
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", {
        colSpan: numTableColumns
      }, msg));
    }
    return results.map(group => {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_molecules_BundleGroupTableRow__WEBPACK_IMPORTED_MODULE_6__["default"], {
        key: `${group.id}`,
        bundleTypeChoices: this.state.bundleTypeChoices,
        group: group,
        products: this.state.products,
        ranges: this.state.ranges,
        onEdit: this.onOpenEditModal,
        onDelete: bg => {
          this.onDeleteBundleGroup(bg).catch(err => {
            console.error(err);
          });
        }
      });
    });
  }
  buildEditModal() {
    const group = this.state.groups.find(g => {
      return g.id === this.state.selectedGroup;
    });
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react_modal__WEBPACK_IMPORTED_MODULE_2___default()), {
      contentLabel: gettext("Edit Bundle Group"),
      style: modalStyles,
      isOpen: this.state.editModalOpen
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_molecules_BundleGroupEditForm__WEBPACK_IMPORTED_MODULE_5__["default"], {
      bundleTypeChoices: this.state.bundleTypeChoices,
      group: group || null,
      products: this.state.products,
      ranges: this.state.ranges,
      isSaving: this.state.isSaving,
      errors: this.state.formErrors,
      onCancel: this.onCloseModal,
      onSave: bg => {
        this.onSaveBundleGroup(bg).catch(err => {
          console.error(err);
        });
      }
    }));
  }
  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "page-header"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      className: "btn btn-primary float-right",
      onClick: this.onCreate
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "fas fa-plus-circle"
    }), " ", gettext("Create new bundle group")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", null, gettext("Bundle Groups"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "table-header"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
      className: "fas fa-search"
    }), gettext("Search Bundle Groups"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_molecules_BundleGroupSearchForm__WEBPACK_IMPORTED_MODULE_4__["default"], {
      searchText: this.state.searchText,
      onChange: this.onSearchTextChange
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("table", {
      className: "table table-striped table-bordered"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tbody", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null, gettext("Name")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null, gettext("Type")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null, gettext("Image")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null, gettext("Triggers")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null, gettext("Suggestions")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null, gettext("Active Status")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null, gettext("Actions"))), this.buildGroupRows())), this.buildEditModal());
  }
}
/* harmony default export */ __webpack_exports__["default"] = (BundleGroupTable);

/***/ }),

/***/ "./src/bundles/molecules/BundleGroupEditForm.tsx":
/*!*******************************************************!*\
  !*** ./src/bundles/molecules/BundleGroupEditForm.tsx ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elements_BundleGroupEditForm_MetaFields__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./elements/BundleGroupEditForm_MetaFields */ "./src/bundles/molecules/elements/BundleGroupEditForm_MetaFields.tsx");
/* harmony import */ var _elements_BundleGroupEditForm_ParentProducts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./elements/BundleGroupEditForm_ParentProducts */ "./src/bundles/molecules/elements/BundleGroupEditForm_ParentProducts.tsx");
/* harmony import */ var _elements_BundleGroupEditForm_UserConfigurableBundles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./elements/BundleGroupEditForm_UserConfigurableBundles */ "./src/bundles/molecules/elements/BundleGroupEditForm_UserConfigurableBundles.tsx");
/* harmony import */ var _elements_BundleGroupEditForm_ConcreteBundles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./elements/BundleGroupEditForm_ConcreteBundles */ "./src/bundles/molecules/elements/BundleGroupEditForm_ConcreteBundles.tsx");
/* harmony import */ var _elements_BundleGroupEditForm_Actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./elements/BundleGroupEditForm_Actions */ "./src/bundles/molecules/elements/BundleGroupEditForm_Actions.tsx");
/* harmony import */ var _BundleGroupEditForm_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./BundleGroupEditForm.scss */ "./src/bundles/molecules/BundleGroupEditForm.scss");







const _isSelectOptionArray = opts => {
  return !!opts && opts.length !== undefined;
};
const _isSelectOption = opts => {
  return !!opts && !_isSelectOptionArray(opts);
};
class BundleGroupEditForm extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  constructor(props) {
    super(props);
    this.onEdit = e => {
      const name = e.currentTarget.name;
      const value = e.currentTarget.value;
      this.setState(state => {
        return Object.assign(Object.assign({}, state), {
          [name]: value
        });
      });
    };
    this.onSelectImage = e => {
      if (!e.currentTarget.files) {
        return;
      }
      const file = e.currentTarget.files[0];
      this.setState({
        image: file
      });
    };
    this.onSelectParent = (name, opts) => {
      let options;
      if (!opts) {
        options = [];
      } else if (opts.length === undefined) {
        options = [opts];
      } else {
        options = opts;
      }
      this.setState(state => {
        return Object.assign(Object.assign({}, state), {
          [name]: options.map(o => {
            return o.value;
          })
        });
      });
    };
    this.onLinkedRangesChange = (trigger, rangeIndex, opts) => {
      let option = null;
      if (_isSelectOption(opts)) {
        option = opts;
      } else if (_isSelectOptionArray(opts)) {
        throw new Error("Can not link multiple ranges to a single trigger parent");
      }
      this.setState(state => {
        const linkedRanges = Object.assign({}, state.linkedRanges);
        if (option) {
          if (!linkedRanges[trigger.id]) {
            linkedRanges[trigger.id] = [];
          }
          linkedRanges[trigger.id][rangeIndex] = Object.assign(Object.assign({}, linkedRanges[trigger.id][rangeIndex] || {}), {
            rangeID: option.value,
            quantity: 1
          });
        } else {
          linkedRanges[trigger.id].splice(rangeIndex, 1);
          linkedRanges[trigger.id] = linkedRanges[trigger.id].filter(r => !!r);
          if (linkedRanges[trigger.id].length <= 0) {
            delete linkedRanges[trigger.id];
          }
        }
        return Object.assign(Object.assign({}, state), {
          linkedRanges: linkedRanges
        });
      });
    };
    this.onLinkedRangesQuantityChange = (trigger, rangeIndex, opts) => {
      let option = {
        value: 1,
        label: "1"
      };
      if (_isSelectOption(opts)) {
        option = opts;
      } else if (_isSelectOptionArray(opts)) {
        throw new Error("Can not link multiple quantities to a single range parent");
      }
      this.setState(state => {
        const linkedRanges = Object.assign({}, state.linkedRanges);
        if (linkedRanges[trigger.id] && linkedRanges[trigger.id][rangeIndex]) {
          linkedRanges[trigger.id][rangeIndex] = Object.assign(Object.assign({}, linkedRanges[trigger.id][rangeIndex]), {
            quantity: option.value
          });
        }
        return Object.assign(Object.assign({}, state), {
          linkedRanges: linkedRanges
        });
      });
    };
    this.onLinkedProductsChange = (trigger, suggestParent, opts) => {
      let options;
      if (!opts) {
        options = [];
      } else if (_isSelectOption(opts)) {
        options = [opts];
      } else {
        options = opts;
      }
      const ids = options.map(o => {
        return o.value;
      });
      this.setState(state => {
        const oldIDs = (state.linkedProducts[trigger.id] || []).filter(sid => {
          const suggestion = this.getProduct(sid);
          return suggestion.id !== suggestParent.id && suggestion.parent !== suggestParent.id;
        });
        const newIDs = oldIDs.concat(ids).filter((id, i, _ids) => {
          return _ids.indexOf(id) === i;
        });
        const linkedProducts = Object.assign(Object.assign({}, state.linkedProducts), {
          [trigger.id]: newIDs
        });
        return Object.assign(Object.assign({}, state), {
          linkedProducts: linkedProducts
        });
      });
    };
    this.onCancel = e => {
      e.preventDefault();
      this.props.onCancel();
    };
    this.onSave = e => {
      e.preventDefault();
      const data = {
        id: this.props.group ? this.props.group.id : null,
        bundle_type: this.state.bundleType,
        name: this.state.name,
        description: this.state.description,
        headline: this.state.headline,
        is_active: this.state.isActive,
        image: this.props.group ? this.props.group.image : "",
        newImage: this.state.clearImage ? null : this.state.image,
        clearImage: this.state.clearImage,
        triggering_parents: this.state.triggeringParents,
        suggested_parents: this.state.suggestedParents,
        concrete_bundles: [],
        user_configurable_bundles: []
      };
      Object.keys(this.state.linkedRanges).forEach(tID => {
        const triggerID = parseInt(tID, 10);
        const tProduct = this.getProduct(triggerID);
        if (data.triggering_parents.indexOf(tProduct.id) === -1 && (!tProduct.parent || data.triggering_parents.indexOf(tProduct.parent) === -1)) {
          return;
        }
        const linkedRanges = this.state.linkedRanges[triggerID];
        linkedRanges.forEach(_ref => {
          let {
            rangeID,
            quantity
          } = _ref;
          if (!rangeID || !quantity) {
            return;
          }
          let preExistingBundle = undefined;
          if (this.props.group) {
            preExistingBundle = this.props.group.user_configurable_bundles.find(b => {
              return b.triggering_product === triggerID && b.suggested_range === rangeID;
            });
          }
          data.user_configurable_bundles.push({
            id: preExistingBundle ? preExistingBundle.id : null,
            triggering_product: triggerID,
            suggested_range: rangeID,
            quantity: quantity
          });
        });
      });
      Object.keys(this.state.linkedProducts).forEach(tID => {
        const triggerID = parseInt(tID, 10);
        const tProduct = this.getProduct(triggerID);
        if (data.triggering_parents.indexOf(tProduct.id) === -1 && (!tProduct.parent || data.triggering_parents.indexOf(tProduct.parent) === -1)) {
          return;
        }
        let preExistingBundle = undefined;
        if (this.props.group) {
          preExistingBundle = this.props.group.concrete_bundles.find(b => {
            return b.triggering_product === triggerID;
          });
        }
        const suggestionIDs = this.state.linkedProducts[triggerID].filter(sID => {
          const sProduct = this.getProduct(sID);
          return data.suggested_parents.indexOf(sProduct.id) !== -1 || sProduct.parent && data.suggested_parents.indexOf(sProduct.parent) !== -1;
        });
        if (suggestionIDs.length <= 0) {
          return;
        }
        data.concrete_bundles.push({
          id: preExistingBundle ? preExistingBundle.id : null,
          triggering_product: triggerID,
          suggested_products: suggestionIDs
        });
      });
      this.props.onSave(data);
    };
    this.onClearImage = e => {
      this.setState({
        clearImage: e.currentTarget.checked
      });
    };
    this.getProduct = productID => {
      return this.productIdx[productID];
    };
    // Build linked ranges data set
    const linkedRanges = {};
    const configurableBundles = props.group ? props.group.user_configurable_bundles : [];
    configurableBundles.forEach(bundle => {
      if (!linkedRanges[bundle.triggering_product]) {
        linkedRanges[bundle.triggering_product] = [];
      }
      linkedRanges[bundle.triggering_product].push({
        rangeID: bundle.suggested_range,
        quantity: bundle.quantity
      });
    });
    // Build linked products data set
    const linkedProducts = {};
    const concreteBundles = props.group ? props.group.concrete_bundles : [];
    concreteBundles.forEach(bundle => {
      if (!linkedProducts[bundle.triggering_product]) {
        linkedProducts[bundle.triggering_product] = [];
      }
      linkedProducts[bundle.triggering_product] = linkedProducts[bundle.triggering_product].concat(bundle.suggested_products).filter((id, i, ids) => {
        return ids.indexOf(id) === i;
      });
    });
    // Build initial state
    const state = {
      bundleType: "",
      name: "",
      description: "",
      headline: "",
      isActive: true,
      image: null,
      clearImage: false,
      triggeringParents: [],
      suggestedParents: [],
      linkedRanges: linkedRanges,
      linkedProducts: linkedProducts
    };
    if (props.group) {
      state.bundleType = props.group.bundle_type;
      state.name = props.group.name;
      state.description = props.group.description;
      state.headline = props.group.headline;
      state.isActive = props.group.is_active;
      state.triggeringParents = props.group.triggering_parents;
      state.suggestedParents = props.group.suggested_parents;
    } else if (props.bundleTypeChoices.length > 0) {
      state.bundleType = props.bundleTypeChoices[0].value;
    }
    this.state = state;
    this.productIdx = {};
    this.fillProductIdx(props.products);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.fillProductIdx(nextProps.products);
  }
  fillProductIdx(products) {
    this.productIdx = {};
    products.forEach(p => {
      this.productIdx[p.id] = p;
    });
  }
  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
      className: "row bundle-group-edit",
      onSubmit: this.onSave
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_elements_BundleGroupEditForm_MetaFields__WEBPACK_IMPORTED_MODULE_1__.BundleGroupMetaFields, {
      bundleTypeChoices: this.props.bundleTypeChoices,
      group: this.props.group,
      isSaving: this.props.isSaving,
      errors: this.props.errors,
      bundleType: this.state.bundleType,
      name: this.state.name,
      headline: this.state.headline,
      description: this.state.description,
      isActive: this.state.isActive || false,
      image: this.state.image,
      clearImage: this.state.clearImage,
      onEdit: this.onEdit,
      onSelectImage: this.onSelectImage,
      onClearImage: this.onClearImage
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_elements_BundleGroupEditForm_ParentProducts__WEBPACK_IMPORTED_MODULE_2__.ParentProductsEditForm, {
      products: this.props.products,
      isSaving: this.props.isSaving,
      errors: this.props.errors,
      triggeringParents: this.state.triggeringParents,
      suggestedParents: this.state.suggestedParents,
      onSelectParent: this.onSelectParent
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_elements_BundleGroupEditForm_UserConfigurableBundles__WEBPACK_IMPORTED_MODULE_3__.UserConfigurableBundles, {
      ranges: this.props.ranges,
      isSaving: this.props.isSaving,
      triggeringParents: this.state.triggeringParents,
      linkedRanges: this.state.linkedRanges,
      getProduct: this.getProduct,
      onLinkedRangesChange: this.onLinkedRangesChange,
      onLinkedRangeQuantityChange: this.onLinkedRangesQuantityChange
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_elements_BundleGroupEditForm_ConcreteBundles__WEBPACK_IMPORTED_MODULE_4__.ConcreteBundles, {
      products: this.props.products,
      isSaving: this.props.isSaving,
      triggeringParents: this.state.triggeringParents,
      suggestedParents: this.state.suggestedParents,
      linkedProducts: this.state.linkedProducts,
      getProduct: this.getProduct,
      onLinkedProductsChange: this.onLinkedProductsChange
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_elements_BundleGroupEditForm_Actions__WEBPACK_IMPORTED_MODULE_5__.BundleGroupEditFormActions, {
      onCancel: this.onCancel
    }));
  }
}
/* harmony default export */ __webpack_exports__["default"] = (BundleGroupEditForm);

/***/ }),

/***/ "./src/bundles/molecules/BundleGroupSearchForm.tsx":
/*!*********************************************************!*\
  !*** ./src/bundles/molecules/BundleGroupSearchForm.tsx ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class BundleGroupSearchForm extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    const onChange = e => {
      e.preventDefault();
      this.props.onChange(e.currentTarget.value);
    };
    const onClear = e => {
      e.preventDefault();
      this.props.onChange("");
    };
    const onSubmit = function (e) {
      e.preventDefault();
    };
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "card card-body bg-light"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
      className: "form-inline",
      onSubmit: onSubmit
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "form-group"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "id_text"
    }, gettext("Search:")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      className: "form-control",
      id: "id_text",
      value: this.props.searchText,
      onChange: onChange
    })), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      type: "button",
      className: "btn btn-secondary",
      onClick: onClear
    }, gettext("Clear Search"))));
  }
}
/* harmony default export */ __webpack_exports__["default"] = (BundleGroupSearchForm);

/***/ }),

/***/ "./src/bundles/molecules/BundleGroupTableRow.tsx":
/*!*******************************************************!*\
  !*** ./src/bundles/molecules/BundleGroupTableRow.tsx ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class BundleGroupTableRow extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  buildGroupActions() {
    const onEdit = e => {
      e.preventDefault();
      this.props.onEdit(this.props.group);
    };
    const onDelete = e => {
      e.preventDefault();
      const msgFormat = gettext("Are you sure you want to delete this bundle group (%(name)s) and all its associated bundles?");
      const data = {
        name: this.props.group.name
      };
      const msg = interpolate(msgFormat, data, true);
      if (confirm(msg)) {
        this.props.onDelete(this.props.group);
      }
    };
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "btn-toolbar"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "dropdown"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "btn btn-secondary dropdown-toggle",
      type: "button",
      "data-toggle": "dropdown",
      "aria-haspopup": "true",
      "aria-expanded": "false"
    }, gettext("Actions"), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
      className: "caret"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
      className: "dropdown-menu dropdown-menu-right"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      className: "dropdown-item",
      onClick: onEdit
    }, gettext("Edit")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      className: "dropdown-item",
      onClick: onDelete
    }, gettext("Delete")))));
  }
  buildProductList(productIDs) {
    const products = this.props.products.filter(p => {
      return productIDs.indexOf(p.id) !== -1;
    });
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", null, products.map(p => {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
        key: p.id
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
        href: p.dashboard_url
      }, p.title));
    }));
  }
  buildRangeList() {
    const rangeIDs = this.props.group.user_configurable_bundles.map(bundle => bundle.suggested_range);
    const ranges = this.props.ranges.filter(r => {
      return rangeIDs.includes(r.id);
    });
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", null, ranges.map(r => {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
        key: r.id
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
        href: r.dashboard_url
      }, r.name));
    }));
  }
  render() {
    const bundleType = this.props.bundleTypeChoices.find(choice => {
      return choice.value === this.props.group.bundle_type;
    });
    let suggestedProducts = null;
    let suggestedRanges = null;
    if (this.props.group.suggested_parents) {
      suggestedProducts = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("em", null, gettext("Products:")), this.buildProductList(this.props.group.suggested_parents));
    }
    if (this.props.group.user_configurable_bundles.length > 0) {
      suggestedRanges = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("em", null, gettext("Ranges:")), this.buildRangeList());
    }
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tr", {
      key: `${this.props.group.id}`
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, this.props.group.name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, bundleType ? bundleType.display_name : ""), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("img", {
      src: this.props.group.image || undefined,
      width: 100
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, this.buildProductList(this.props.group.triggering_parents)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, suggestedProducts, suggestedRanges), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, this.props.group.is_active ? gettext("Active") : gettext("Inactive")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, this.buildGroupActions()));
  }
}
/* harmony default export */ __webpack_exports__["default"] = (BundleGroupTableRow);

/***/ }),

/***/ "./src/bundles/molecules/elements/BundleGroupEditForm_Actions.tsx":
/*!************************************************************************!*\
  !*** ./src/bundles/molecules/elements/BundleGroupEditForm_Actions.tsx ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BundleGroupEditFormActions: function() { return /* binding */ BundleGroupEditFormActions; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

class BundleGroupEditFormActions extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "col-sm-12 bundle-group-edit__section"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "form-group"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      className: "btn btn-secondary",
      onClick: this.props.onCancel
    }, gettext("Cancel")), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
      className: "btn btn-primary",
      type: "submit"
    }, gettext("Save"))));
  }
}

/***/ }),

/***/ "./src/bundles/molecules/elements/BundleGroupEditForm_ConcreteBundles.tsx":
/*!********************************************************************************!*\
  !*** ./src/bundles/molecules/elements/BundleGroupEditForm_ConcreteBundles.tsx ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConcreteBundles: function() { return /* binding */ ConcreteBundles; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.esm.js");


class ConcreteBundles extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  getChildProductSelectOptions(parent) {
    return this.props.products.filter(p => {
      return !p.is_parent && (p.id === parent.id || p.parent === parent.id);
    }).sort((a, b) => {
      return a.title.localeCompare(b.title);
    }).map(p => {
      const opt = {
        value: p.id,
        label: p.title
      };
      return opt;
    });
  }
  buildBundleRows(triggerParent, suggestParent) {
    const triggerOptions = this.props.products.filter(p => {
      return !p.is_parent && (p.id === triggerParent.id || p.parent === triggerParent.id);
    }).sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
    const suggestOptions = this.getChildProductSelectOptions(suggestParent);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("table", {
      className: "table bundle-group-edit__link-table"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tbody", null, triggerOptions.map(trigger => {
      const selectValue = (this.props.linkedProducts[trigger.id] || []).filter(sid => {
        const suggestion = this.props.getProduct(sid);
        return suggestion.id === suggestParent.id || suggestion.parent === suggestParent.id;
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tr", {
        key: trigger.id
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
        href: trigger.dashboard_url,
        target: "_blank",
        rel: "noreferrer"
      }, trigger.title)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_select__WEBPACK_IMPORTED_MODULE_1__["default"], {
        isMulti: true,
        value: suggestOptions.filter(o => selectValue.includes(o.value)),
        options: suggestOptions,
        onChange: this.props.onLinkedProductsChange.bind(this, trigger, suggestParent),
        isDisabled: this.props.isSaving
      })));
    })));
  }
  buildParentRows() {
    if (this.props.triggeringParents.length <= 0 || this.props.suggestedParents.length <= 0) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "col-sm-12"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("em", null, gettext("Select at least one trigger product and one suggested product to begin linking variants.")))));
    }
    const parentCombinations = {};
    const buildKey = function (triggerParent, suggestParent) {
      return `${triggerParent}-${suggestParent}`;
    };
    this.props.triggeringParents.forEach(triggerID => {
      this.props.suggestedParents.forEach(suggestionID => {
        const key = buildKey(triggerID, suggestionID);
        parentCombinations[key] = {
          triggerParent: this.props.getProduct(triggerID),
          suggestParent: this.props.getProduct(suggestionID)
        };
      });
    });
    return Object.values(parentCombinations).map((combination, i) => {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        key: i,
        className: "row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "col-sm-6"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("strong", null, combination.triggerParent.title), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("em", null, gettext("(Trigger Parent)")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "col-sm-6"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("strong", null, combination.suggestParent.title), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("em", null, gettext("(Suggestion Parent)")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "col-sm-12"
      }, this.buildBundleRows(combination.triggerParent, combination.suggestParent)));
    });
  }
  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "col-sm-12 bundle-group-edit__section"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", null, gettext("Product Links (Concrete Bundles)")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("em", null, gettext("Concrete bundles are bundles which link products to other specific products. They can not be customized by the end-consumer."))), this.buildParentRows());
  }
}

/***/ }),

/***/ "./src/bundles/molecules/elements/BundleGroupEditForm_MetaFields.tsx":
/*!***************************************************************************!*\
  !*** ./src/bundles/molecules/elements/BundleGroupEditForm_MetaFields.tsx ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BundleGroupMetaFields: function() { return /* binding */ BundleGroupMetaFields; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);


class BundleGroupMetaFields extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  buildFormGroupClasses(field) {
    const fieldErrors = this.props.errors[field];
    const classes = {
      "form-group": true,
      "has-error": fieldErrors ? fieldErrors.length > 0 : false
    };
    return classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes);
  }
  buildErrors(field) {
    return (this.props.errors[field] || []).map((errorMsg, i) => {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        key: i,
        className: "help-block"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        className: "fas fa-exclamation"
      }), " ", errorMsg);
    });
  }
  buildCurrentImage() {
    if (!this.props.group || !this.props.group.image) {
      return null;
    }
    const pathParts = this.props.group.image.split("/");
    const fileName = pathParts[pathParts.length - 1];
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, gettext("Currently:"), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
      target: "_blank",
      rel: "noreferrer",
      href: this.props.group.image
    }, fileName), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      type: "checkbox",
      id: "bundle-edit-form-clear-img",
      checked: this.props.clearImage,
      onChange: this.props.onClearImage,
      disabled: this.props.isSaving
    }), " ", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "bundle-edit-form-clear-img"
    }, gettext("Clear")));
  }
  render() {
    const title = this.props.group ? gettext("Edit Bundle Group") : gettext("Create Bundle Group");
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "col-sm-12 bundle-group-edit__section"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", null, title), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: this.buildFormGroupClasses("bundleType")
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "id_bundleType",
      className: "control-label"
    }, gettext("Bundle Type")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("select", {
      id: "id_bundleType",
      name: "bundleType",
      className: "form-control",
      value: this.props.bundleType,
      onChange: this.props.onEdit,
      disabled: this.props.isSaving
    }, this.props.bundleTypeChoices.map(choice => {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", {
        key: choice.value,
        value: choice.value
      }, choice.display_name);
    })), this.buildErrors("bundleType"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: this.buildFormGroupClasses("name")
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "id_name",
      className: "control-label"
    }, gettext("Name")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      id: "id_name",
      name: "name",
      maxLength: 200,
      className: "form-control",
      value: this.props.name,
      onChange: this.props.onEdit,
      disabled: this.props.isSaving
    }), this.buildErrors("name"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: this.buildFormGroupClasses("headline")
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "id_headline",
      className: "control-label"
    }, gettext("Headline")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("textarea", {
      id: "id_headline",
      name: "headline",
      cols: 40,
      rows: 4,
      className: "form-control",
      value: this.props.headline,
      onChange: this.props.onEdit,
      disabled: this.props.isSaving
    }), this.buildErrors("headline"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: this.buildFormGroupClasses("isActive")
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "id_active_status",
      className: "control-label"
    }, gettext("Active Status")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("select", {
      id: "id_isActive",
      name: "isActive",
      className: "form-control",
      value: String(this.props.isActive),
      onChange: this.props.onEdit,
      disabled: this.props.isSaving
    }, [{
      display_name: "Active",
      value: "true"
    }, {
      display_name: "Inactive",
      value: "false"
    }].map((choice, index) => {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("option", {
        key: index,
        value: choice.value
      }, choice.display_name);
    })), this.buildErrors("isActive"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: this.buildFormGroupClasses("description")
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "id_description",
      className: "control-label"
    }, gettext("Description")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("textarea", {
      id: "id_description",
      name: "description",
      cols: 40,
      rows: 4,
      className: "form-control",
      value: this.props.description,
      onChange: this.props.onEdit,
      disabled: this.props.isSaving
    }), this.buildErrors("description"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: this.buildFormGroupClasses("image")
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "id_image",
      className: "control-label"
    }, gettext("Image")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, this.buildCurrentImage(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
      id: "id_image",
      type: "file",
      name: "image",
      className: "form-control",
      onChange: this.props.onSelectImage,
      disabled: this.props.isSaving
    }), this.buildErrors("image"))));
  }
}

/***/ }),

/***/ "./src/bundles/molecules/elements/BundleGroupEditForm_ParentProducts.tsx":
/*!*******************************************************************************!*\
  !*** ./src/bundles/molecules/elements/BundleGroupEditForm_ParentProducts.tsx ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ParentProductsEditForm: function() { return /* binding */ ParentProductsEditForm; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.esm.js");



class ParentProductsEditForm extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  getParentProductSelectOptions() {
    return this.props.products.filter(p => {
      return !p.is_child;
    }).sort((a, b) => {
      return a.title.localeCompare(b.title);
    }).map(p => {
      const opt = {
        value: p.id,
        label: p.title
      };
      return opt;
    });
  }
  buildFormGroupClasses(field, extras) {
    const fieldErrors = this.props.errors[field];
    const classes = {
      "form-group": true,
      "has-error": fieldErrors ? fieldErrors.length > 0 : false
    };
    extras.forEach(className => {
      classes[className] = true;
    });
    return classnames__WEBPACK_IMPORTED_MODULE_1___default()(classes);
  }
  buildErrors(field) {
    return (this.props.errors[field] || []).map((errorMsg, i) => {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        key: i,
        className: "help-block"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("i", {
        className: "fas fa-exclamation"
      }), " ", errorMsg);
    });
  }
  render() {
    const parentProductSelectOptions = this.getParentProductSelectOptions();
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "col-sm-12 bundle-group-edit__section"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", null, gettext("Relevant Products")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("em", null, gettext("Select the parent and standalone products revelant to this bundle group."))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: this.buildFormGroupClasses("triggering_parents", ["col-sm-6"])
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "id_image",
      className: "control-label"
    }, gettext("Triggers")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
      name: "triggeringParents",
      isMulti: true,
      value: parentProductSelectOptions.filter(o => this.props.triggeringParents.includes(o.value)),
      onChange: this.props.onSelectParent.bind(this, "triggeringParents"),
      options: parentProductSelectOptions,
      isDisabled: this.props.isSaving
    }), this.buildErrors("triggering_parents"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: this.buildFormGroupClasses("suggested_parents", ["col-sm-6"])
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("label", {
      htmlFor: "id_image",
      className: "control-label"
    }, gettext("Suggestions")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_select__WEBPACK_IMPORTED_MODULE_2__["default"], {
      name: "suggestedProducts",
      isMulti: true,
      value: parentProductSelectOptions.filter(o => this.props.suggestedParents.includes(o.value)),
      onChange: this.props.onSelectParent.bind(this, "suggestedParents"),
      options: parentProductSelectOptions,
      isDisabled: this.props.isSaving
    }), this.buildErrors("suggested_parents")))));
  }
}

/***/ }),

/***/ "./src/bundles/molecules/elements/BundleGroupEditForm_UserConfigurableBundles.tsx":
/*!****************************************************************************************!*\
  !*** ./src/bundles/molecules/elements/BundleGroupEditForm_UserConfigurableBundles.tsx ***!
  \****************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserConfigurableBundles: function() { return /* binding */ UserConfigurableBundles; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select */ "./node_modules/react-select/dist/react-select.esm.js");


const helpText = gettext(`User configurable bundles are bundles which link parent/standalone products to ranges of \
other products. Their intent is to represent a group of products related to the suggesting parent, rather than a \
specific one-to-one mapping of product to product.`);
class UserConfigurableBundles extends (react__WEBPACK_IMPORTED_MODULE_0___default().PureComponent) {
  getRangeSelectOptions() {
    const rangeOptions = this.props.ranges.sort((a, b) => {
      return a.name.localeCompare(b.name);
    }).map(p => {
      const opt = {
        value: p.id,
        label: p.name
      };
      return opt;
    });
    return rangeOptions;
  }
  getQuantitySelectOptions() {
    const quantityOptions = [];
    for (let i = 1; i < 100; i++) {
      quantityOptions.push({
        value: i,
        label: `${i}`
      });
    }
    return quantityOptions;
  }
  buildBundleRows(triggerParent) {
    const suggestOptions = this.getRangeSelectOptions();
    const quantityOptions = this.getQuantitySelectOptions();
    const linkedRanges = this.props.linkedRanges[triggerParent.id] || [];
    if (linkedRanges.length <= 0 || linkedRanges[linkedRanges.length - 1].rangeID !== null) {
      linkedRanges.push({
        rangeID: null,
        quantity: 1
      });
    }
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("table", {
      key: triggerParent.id,
      className: "table bundle-group-edit__link-table"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tbody", null, linkedRanges.map((range, i) => {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("tr", {
        key: i
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("th", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {
        href: triggerParent.dashboard_url,
        target: "_blank",
        rel: "noreferrer"
      }, triggerParent.title)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_select__WEBPACK_IMPORTED_MODULE_1__["default"], {
        isClearable: true,
        value: suggestOptions.filter(o => o.value === range.rangeID),
        options: suggestOptions,
        onChange: this.props.onLinkedRangesChange.bind(this, triggerParent, i),
        isDisabled: this.props.isSaving
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("td", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_select__WEBPACK_IMPORTED_MODULE_1__["default"], {
        value: quantityOptions.filter(o => range.rangeID !== null && o.value === range.quantity),
        options: quantityOptions,
        onChange: this.props.onLinkedRangeQuantityChange.bind(this, triggerParent, i),
        isDisabled: this.props.isSaving || range.rangeID === null
      })));
    })));
  }
  buildParentRows() {
    if (this.props.triggeringParents.length <= 0) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: "col-sm-12"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("em", null, gettext("Select at least one trigger product to begin linking ranges.")))));
    }
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "row"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "col-sm-4"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("strong", null, gettext("Trigger Parent")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "col-sm-4"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("strong", null, gettext("Suggested Range")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "col-sm-4"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("strong", null, gettext("Suggested Quantity")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "col-sm-12"
    }, this.props.triggeringParents.map(triggerParentID => {
      const triggerParent = this.props.getProduct(triggerParentID);
      return this.buildBundleRows(triggerParent);
    })));
  }
  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
      className: "col-sm-12 bundle-group-edit__section"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", null, gettext("Range Links (User Configurable Bundles)")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("em", null, helpText)), this.buildParentRows());
  }
}

/***/ }),

/***/ "./src/utils/api.ts":
/*!**************************!*\
  !*** ./src/utils/api.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   deleteBundleGroup: function() { return /* binding */ deleteBundleGroup; },
/* harmony export */   listBundleGroupTypes: function() { return /* binding */ listBundleGroupTypes; },
/* harmony export */   listBundleGroups: function() { return /* binding */ listBundleGroups; },
/* harmony export */   listConcreteBundles: function() { return /* binding */ listConcreteBundles; },
/* harmony export */   listProducts: function() { return /* binding */ listProducts; },
/* harmony export */   listRanges: function() { return /* binding */ listRanges; },
/* harmony export */   listUserConfigurableBundles: function() { return /* binding */ listUserConfigurableBundles; },
/* harmony export */   saveBundleGroup: function() { return /* binding */ saveBundleGroup; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/dist/js.cookie.mjs");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models */ "./src/utils/models.ts");



const CSRF_HEADER = "X-CSRFToken";
const getCSRFToken = function () {
  return js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].get("csrftoken") || "";
};
const fetchData = endpoint => (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(void 0, void 0, void 0, function* () {
  return fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });
});
const listBundleGroupTypes = endpoint => (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(void 0, void 0, void 0, function* () {
  const resp = yield fetchData(endpoint);
  return (0,_models__WEBPACK_IMPORTED_MODULE_1__.check)(_models__WEBPACK_IMPORTED_MODULE_1__.DRFSelectOptions.decode(yield resp.json()));
});
const listBundleGroups = endpoint => (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(void 0, void 0, void 0, function* () {
  const resp = yield fetchData(endpoint);
  return (0,_models__WEBPACK_IMPORTED_MODULE_1__.check)(_models__WEBPACK_IMPORTED_MODULE_1__.BundleGroups.decode(yield resp.json()));
});
const listProducts = endpoint => (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(void 0, void 0, void 0, function* () {
  const resp = yield fetchData(endpoint);
  return (0,_models__WEBPACK_IMPORTED_MODULE_1__.check)(_models__WEBPACK_IMPORTED_MODULE_1__.Products.decode(yield resp.json()));
});
const listRanges = endpoint => (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(void 0, void 0, void 0, function* () {
  const resp = yield fetchData(endpoint);
  return (0,_models__WEBPACK_IMPORTED_MODULE_1__.check)(_models__WEBPACK_IMPORTED_MODULE_1__.Ranges.decode(yield resp.json()));
});
const listConcreteBundles = endpoint => (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(void 0, void 0, void 0, function* () {
  const resp = yield fetchData(endpoint);
  return (0,_models__WEBPACK_IMPORTED_MODULE_1__.check)(_models__WEBPACK_IMPORTED_MODULE_1__.ConcreteBundles.decode(yield resp.json()));
});
const listUserConfigurableBundles = endpoint => (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(void 0, void 0, void 0, function* () {
  const resp = yield fetchData(endpoint);
  return (0,_models__WEBPACK_IMPORTED_MODULE_1__.check)(_models__WEBPACK_IMPORTED_MODULE_1__.UserConfigurableBundles.decode(yield resp.json()));
});
const _saveBundleGroupData = (endpoint, group) => (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(void 0, void 0, void 0, function* () {
  const [method, url] = group.id ? ["PATCH", `${endpoint}${group.id}/`] : ["POST", endpoint];
  const data = Object.assign({}, group);
  delete data.image;
  delete data.newImage;
  delete data.clearImage;
  const resp = yield fetch(url, {
    method: method,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      [CSRF_HEADER]: getCSRFToken()
    },
    body: JSON.stringify(data)
  });
  return (0,_models__WEBPACK_IMPORTED_MODULE_1__.check)(_models__WEBPACK_IMPORTED_MODULE_1__.BundleGroup.decode(yield resp.json()));
});
const _saveBundleGroupImage = (endpoint, group) => (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(void 0, void 0, void 0, function* () {
  if (!group.id) {
    throw new Error("Can not save image for unsaved bundle group");
  }
  if (!group.newImage && !group.clearImage) {
    return Promise.resolve();
  }
  if (group.newImage && !group.clearImage) {
    const formData = new FormData();
    formData.append(`image`, group.newImage, group.newImage.name);
    yield fetch(`${endpoint}${group.id}/`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        [CSRF_HEADER]: getCSRFToken()
      },
      body: formData
    });
    return;
  }
  if (group.clearImage) {
    yield fetch(`${endpoint}${group.id}/`, {
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        [CSRF_HEADER]: getCSRFToken()
      },
      body: JSON.stringify({
        image: null
      })
    });
    return;
  }
});
const saveBundleGroup = (endpoint, data) => (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(void 0, void 0, void 0, function* () {
  const group = yield _saveBundleGroupData(endpoint, data);
  data.id = group.id; // Update bundle group ID if it was just created
  yield _saveBundleGroupImage(endpoint, data);
  return group;
});
const deleteBundleGroup = (endpoint, group) => (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__awaiter)(void 0, void 0, void 0, function* () {
  if (!group.id) {
    throw new Error("Can not delete unsaved bundle group");
  }
  yield fetch(`${endpoint}${group.id}/`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      [CSRF_HEADER]: getCSRFToken()
    }
  });
});

/***/ }),

/***/ "./src/utils/models.ts":
/*!*****************************!*\
  !*** ./src/utils/models.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseField: function() { return /* binding */ BaseField; },
/* harmony export */   BooleanField: function() { return /* binding */ BooleanField; },
/* harmony export */   BundleGroup: function() { return /* binding */ BundleGroup; },
/* harmony export */   BundleGroups: function() { return /* binding */ BundleGroups; },
/* harmony export */   ChoiceField: function() { return /* binding */ ChoiceField; },
/* harmony export */   ConcreteBundle: function() { return /* binding */ ConcreteBundle; },
/* harmony export */   ConcreteBundles: function() { return /* binding */ ConcreteBundles; },
/* harmony export */   DRFOptionsResponse: function() { return /* binding */ DRFOptionsResponse; },
/* harmony export */   DRFSelectOption: function() { return /* binding */ DRFSelectOption; },
/* harmony export */   DRFSelectOptions: function() { return /* binding */ DRFSelectOptions; },
/* harmony export */   DatetimeField: function() { return /* binding */ DatetimeField; },
/* harmony export */   Field: function() { return /* binding */ Field; },
/* harmony export */   HTTPMethod: function() { return /* binding */ HTTPMethod; },
/* harmony export */   IntegerField: function() { return /* binding */ IntegerField; },
/* harmony export */   Product: function() { return /* binding */ Product; },
/* harmony export */   Products: function() { return /* binding */ Products; },
/* harmony export */   Range: function() { return /* binding */ Range; },
/* harmony export */   Ranges: function() { return /* binding */ Ranges; },
/* harmony export */   StringField: function() { return /* binding */ StringField; },
/* harmony export */   UserConfigurableBundle: function() { return /* binding */ UserConfigurableBundle; },
/* harmony export */   UserConfigurableBundles: function() { return /* binding */ UserConfigurableBundles; },
/* harmony export */   check: function() { return /* binding */ check; },
/* harmony export */   optional: function() { return /* binding */ optional; }
/* harmony export */ });
/* harmony import */ var io_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! io-ts */ "./node_modules/io-ts/es6/index.js");
/* harmony import */ var io_ts_lib_PathReporter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! io-ts/lib/PathReporter */ "./node_modules/io-ts/lib/PathReporter.js");
/* harmony import */ var fp_ts_lib_Either__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fp-ts/lib/Either */ "./node_modules/fp-ts/lib/Either.js");
/* harmony import */ var fp_ts_lib_Either__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fp_ts_lib_Either__WEBPACK_IMPORTED_MODULE_0__);



const check = result => {
  if ((0,fp_ts_lib_Either__WEBPACK_IMPORTED_MODULE_0__.isLeft)(result)) {
    throw new Error((0,io_ts_lib_PathReporter__WEBPACK_IMPORTED_MODULE_1__.failure)(result.left).join("\n"));
  }
  return result.right;
};
const nullable = type => {
  return io_ts__WEBPACK_IMPORTED_MODULE_2__.union([io_ts__WEBPACK_IMPORTED_MODULE_2__["null"], type]);
};
const optional = type => {
  return io_ts__WEBPACK_IMPORTED_MODULE_2__.union([io_ts__WEBPACK_IMPORTED_MODULE_2__.undefined, type]);
};
class FileType extends io_ts__WEBPACK_IMPORTED_MODULE_2__.Type {
  constructor() {
    super("number", f => {
      return f instanceof File;
    }, (u, c) => {
      return this.is(u) ? io_ts__WEBPACK_IMPORTED_MODULE_2__.success(u) : io_ts__WEBPACK_IMPORTED_MODULE_2__.failure(u, c);
    }, io_ts__WEBPACK_IMPORTED_MODULE_2__.identity);
    this._tag = "NumberType";
  }
}
const file = new FileType();
const DRFSelectOption = io_ts__WEBPACK_IMPORTED_MODULE_2__["interface"]({
  value: io_ts__WEBPACK_IMPORTED_MODULE_2__.string,
  display_name: io_ts__WEBPACK_IMPORTED_MODULE_2__.string
});
const DRFSelectOptions = io_ts__WEBPACK_IMPORTED_MODULE_2__.readonlyArray(DRFSelectOption);
const BaseField = fieldType => {
  return io_ts__WEBPACK_IMPORTED_MODULE_2__["interface"]({
    type: fieldType,
    required: io_ts__WEBPACK_IMPORTED_MODULE_2__.boolean,
    read_only: io_ts__WEBPACK_IMPORTED_MODULE_2__.boolean,
    label: io_ts__WEBPACK_IMPORTED_MODULE_2__.string,
    help_text: optional(io_ts__WEBPACK_IMPORTED_MODULE_2__.string)
  });
};
const IntegerField = BaseField(io_ts__WEBPACK_IMPORTED_MODULE_2__.literal("integer"));
const BooleanField = BaseField(io_ts__WEBPACK_IMPORTED_MODULE_2__.literal("boolean"));
const DatetimeField = BaseField(io_ts__WEBPACK_IMPORTED_MODULE_2__.literal("datetime"));
const StringField = io_ts__WEBPACK_IMPORTED_MODULE_2__.intersection([BaseField(io_ts__WEBPACK_IMPORTED_MODULE_2__.literal("string")), io_ts__WEBPACK_IMPORTED_MODULE_2__["interface"]({
  max_length: optional(io_ts__WEBPACK_IMPORTED_MODULE_2__.number)
})]);
const ChoiceField = io_ts__WEBPACK_IMPORTED_MODULE_2__.intersection([BaseField(io_ts__WEBPACK_IMPORTED_MODULE_2__.literal("choice")), io_ts__WEBPACK_IMPORTED_MODULE_2__["interface"]({
  choices: DRFSelectOptions
})]);
const Field = io_ts__WEBPACK_IMPORTED_MODULE_2__.union([IntegerField, BooleanField, DatetimeField, StringField, ChoiceField, io_ts__WEBPACK_IMPORTED_MODULE_2__.unknown]);
const HTTPMethod = io_ts__WEBPACK_IMPORTED_MODULE_2__.union([io_ts__WEBPACK_IMPORTED_MODULE_2__.literal("GET"), io_ts__WEBPACK_IMPORTED_MODULE_2__.literal("HEAD"), io_ts__WEBPACK_IMPORTED_MODULE_2__.literal("OPTIONS"), io_ts__WEBPACK_IMPORTED_MODULE_2__.literal("POST"), io_ts__WEBPACK_IMPORTED_MODULE_2__.literal("PUT"), io_ts__WEBPACK_IMPORTED_MODULE_2__.literal("PATCH"), io_ts__WEBPACK_IMPORTED_MODULE_2__.literal("DELETE")]);
const DRFOptionsResponse = io_ts__WEBPACK_IMPORTED_MODULE_2__["interface"]({
  name: io_ts__WEBPACK_IMPORTED_MODULE_2__.string,
  description: io_ts__WEBPACK_IMPORTED_MODULE_2__.string,
  renders: io_ts__WEBPACK_IMPORTED_MODULE_2__.readonlyArray(io_ts__WEBPACK_IMPORTED_MODULE_2__.string),
  parses: io_ts__WEBPACK_IMPORTED_MODULE_2__.readonlyArray(io_ts__WEBPACK_IMPORTED_MODULE_2__.string),
  actions: io_ts__WEBPACK_IMPORTED_MODULE_2__["interface"]({
    GET: optional(io_ts__WEBPACK_IMPORTED_MODULE_2__.record(io_ts__WEBPACK_IMPORTED_MODULE_2__.string, Field)),
    HEAD: optional(io_ts__WEBPACK_IMPORTED_MODULE_2__.record(io_ts__WEBPACK_IMPORTED_MODULE_2__.string, Field)),
    OPTIONS: optional(io_ts__WEBPACK_IMPORTED_MODULE_2__.record(io_ts__WEBPACK_IMPORTED_MODULE_2__.string, Field)),
    POST: optional(io_ts__WEBPACK_IMPORTED_MODULE_2__.record(io_ts__WEBPACK_IMPORTED_MODULE_2__.string, Field)),
    PUT: optional(io_ts__WEBPACK_IMPORTED_MODULE_2__.record(io_ts__WEBPACK_IMPORTED_MODULE_2__.string, Field)),
    PATCH: optional(io_ts__WEBPACK_IMPORTED_MODULE_2__.record(io_ts__WEBPACK_IMPORTED_MODULE_2__.string, Field)),
    DELETE: optional(io_ts__WEBPACK_IMPORTED_MODULE_2__.record(io_ts__WEBPACK_IMPORTED_MODULE_2__.string, Field))
  })
});
const Product = io_ts__WEBPACK_IMPORTED_MODULE_2__["interface"]({
  id: io_ts__WEBPACK_IMPORTED_MODULE_2__.number,
  dashboard_url: io_ts__WEBPACK_IMPORTED_MODULE_2__.string,
  product_class: nullable(io_ts__WEBPACK_IMPORTED_MODULE_2__["interface"]({
    id: io_ts__WEBPACK_IMPORTED_MODULE_2__.number,
    name: io_ts__WEBPACK_IMPORTED_MODULE_2__.string
  })),
  title: io_ts__WEBPACK_IMPORTED_MODULE_2__.string,
  slug: io_ts__WEBPACK_IMPORTED_MODULE_2__.string,
  is_parent: io_ts__WEBPACK_IMPORTED_MODULE_2__.boolean,
  is_child: io_ts__WEBPACK_IMPORTED_MODULE_2__.boolean,
  parent: nullable(io_ts__WEBPACK_IMPORTED_MODULE_2__.number),
  children: io_ts__WEBPACK_IMPORTED_MODULE_2__.array(io_ts__WEBPACK_IMPORTED_MODULE_2__.number)
});
const Products = io_ts__WEBPACK_IMPORTED_MODULE_2__.array(Product);
const Range = io_ts__WEBPACK_IMPORTED_MODULE_2__["interface"]({
  id: io_ts__WEBPACK_IMPORTED_MODULE_2__.number,
  dashboard_url: io_ts__WEBPACK_IMPORTED_MODULE_2__.string,
  name: io_ts__WEBPACK_IMPORTED_MODULE_2__.string,
  slug: io_ts__WEBPACK_IMPORTED_MODULE_2__.string,
  description: io_ts__WEBPACK_IMPORTED_MODULE_2__.string
});
const Ranges = io_ts__WEBPACK_IMPORTED_MODULE_2__.array(Range);
const ConcreteBundle = io_ts__WEBPACK_IMPORTED_MODULE_2__["interface"]({
  id: nullable(io_ts__WEBPACK_IMPORTED_MODULE_2__.number),
  triggering_product: io_ts__WEBPACK_IMPORTED_MODULE_2__.number,
  suggested_products: io_ts__WEBPACK_IMPORTED_MODULE_2__.array(io_ts__WEBPACK_IMPORTED_MODULE_2__.number)
});
const ConcreteBundles = io_ts__WEBPACK_IMPORTED_MODULE_2__.array(ConcreteBundle);
const UserConfigurableBundle = io_ts__WEBPACK_IMPORTED_MODULE_2__["interface"]({
  id: nullable(io_ts__WEBPACK_IMPORTED_MODULE_2__.number),
  triggering_product: io_ts__WEBPACK_IMPORTED_MODULE_2__.number,
  suggested_range: io_ts__WEBPACK_IMPORTED_MODULE_2__.number,
  quantity: io_ts__WEBPACK_IMPORTED_MODULE_2__.number
});
const UserConfigurableBundles = io_ts__WEBPACK_IMPORTED_MODULE_2__.array(UserConfigurableBundle);
const BundleGroup = io_ts__WEBPACK_IMPORTED_MODULE_2__["interface"]({
  id: nullable(io_ts__WEBPACK_IMPORTED_MODULE_2__.number),
  bundle_type: io_ts__WEBPACK_IMPORTED_MODULE_2__.string,
  name: io_ts__WEBPACK_IMPORTED_MODULE_2__.string,
  description: io_ts__WEBPACK_IMPORTED_MODULE_2__.string,
  is_active: optional(nullable(io_ts__WEBPACK_IMPORTED_MODULE_2__.boolean)),
  headline: io_ts__WEBPACK_IMPORTED_MODULE_2__.string,
  image: optional(nullable(io_ts__WEBPACK_IMPORTED_MODULE_2__.string)),
  newImage: optional(nullable(file)),
  clearImage: optional(io_ts__WEBPACK_IMPORTED_MODULE_2__.boolean),
  triggering_parents: io_ts__WEBPACK_IMPORTED_MODULE_2__.array(io_ts__WEBPACK_IMPORTED_MODULE_2__.number),
  suggested_parents: io_ts__WEBPACK_IMPORTED_MODULE_2__.array(io_ts__WEBPACK_IMPORTED_MODULE_2__.number),
  concrete_bundles: io_ts__WEBPACK_IMPORTED_MODULE_2__.array(ConcreteBundle),
  user_configurable_bundles: io_ts__WEBPACK_IMPORTED_MODULE_2__.array(UserConfigurableBundle)
});
const BundleGroups = io_ts__WEBPACK_IMPORTED_MODULE_2__.array(BundleGroup);

/***/ }),

/***/ "./src/bundles/BundleGroupTable.scss":
/*!*******************************************!*\
  !*** ./src/bundles/BundleGroupTable.scss ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/bundles/molecules/BundleGroupEditForm.scss":
/*!********************************************************!*\
  !*** ./src/bundles/molecules/BundleGroupEditForm.scss ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	!function() {
/******/ 		__webpack_require__.nmd = function(module) {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	}();
/******/
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"bundles": 0
/******/ 		};
/******/
/******/ 		// no chunk on demand loading
/******/
/******/ 		// no prefetching
/******/
/******/ 		// no preloaded
/******/
/******/ 		// no HMR
/******/
/******/ 		// no HMR manifest
/******/
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/
/******/ 		var chunkLoadingGlobal = self["webpackChunkdjango_oscar_bundles"] = self["webpackChunkdjango_oscar_bundles"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/
/************************************************************************/
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], function() { return __webpack_require__("./src/bundles.tsx"); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/
/******/ })()
;
//# sourceMappingURL=bundles.js.map
