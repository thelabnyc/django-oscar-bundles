import React = require('react');
import {render} from 'react-dom';
import BundleGroupTable from './bundles/BundleGroupTable';

import 'react-select/dist/react-select.css';


const main = function() {
    const elem = document.querySelector('#bundlegroup-table') as HTMLDivElement;
    const bundleURL = elem.dataset.bundleApi;
    const bundleGroupURL = elem.dataset.bundlegroupApi;
    const productChoiceURL = elem.dataset.bundleProductChoiceApi;
    const component = (
        <BundleGroupTable bundleURL={bundleURL}
                          bundleGroupURL={bundleGroupURL}
                          productChoiceURL={productChoiceURL} />
    );
    render(component, elem);
};

main();
