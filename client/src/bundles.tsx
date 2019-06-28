import React = require('react');
import {render} from 'react-dom';
import BundleGroupTable from './bundles/BundleGroupTable';


type INamedInterpolationData = { [key: string]: string; };
type IPositionalInterpolationData = string[];
type IInterpolationData = (INamedInterpolationData | IPositionalInterpolationData);
interface IDjango {
    readonly gettext: (msgid: string) => string;
    readonly ngettext: (singular: string, plural: string, count: number) => string;
    readonly gettext_noop: (msgid: string) => string;
    readonly pgettext: (context: string, msgid: string) => string;
    readonly npgettext: (context: string, singular: string, plural: string, count: number) => string;
    readonly interpolate: (fmt: string, obj: IInterpolationData, named?: boolean) => string;

    readonly pluralidx: (count: number) => number;

    readonly jsi18n_initialized: boolean;
    readonly catalog: {
        [msgid: string]: string;
    };
    readonly formats: {
        [msgid: string]: string | string[];
    };
    readonly get_format: (formatType: string) => string | string[];
}


declare global {
    // Django i18n functions
    const django: IDjango;
    const pluralidx: IDjango['pluralidx'];
    const gettext: IDjango['gettext'];
    const ngettext: IDjango['ngettext'];
    const gettext_noop: IDjango['gettext_noop'];
    const pgettext: IDjango['pgettext'];
    const npgettext: IDjango['npgettext'];
    const interpolate: IDjango['interpolate'];
    const get_format: IDjango['get_format'];
}


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
