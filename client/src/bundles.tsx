// Load polyfills needed for IE11 and other old browsers
import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import BundleGroupTable from "./bundles/BundleGroupTable";

type INamedInterpolationData = { [key: string]: string };
type IPositionalInterpolationData = string[];
type IInterpolateFn = ((
    fmt: string,
    obj: IPositionalInterpolationData,
    named?: false,
) => string) &
    ((fmt: string, obj: INamedInterpolationData, named: true) => string);
interface IDjango {
    readonly gettext: (msgid: string) => string;
    readonly ngettext: (
        singular: string,
        plural: string,
        count: number,
    ) => string;
    readonly gettext_noop: (msgid: string) => string;
    readonly pgettext: (context: string, msgid: string) => string;
    readonly npgettext: (
        context: string,
        singular: string,
        plural: string,
        count: number,
    ) => string;
    readonly interpolate: IInterpolateFn;

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
    const pluralidx: IDjango["pluralidx"];
    const gettext: IDjango["gettext"];
    const ngettext: IDjango["ngettext"];
    const gettext_noop: IDjango["gettext_noop"];
    const pgettext: IDjango["pgettext"];
    const npgettext: IDjango["npgettext"];
    const interpolate: IDjango["interpolate"];
    const get_format: IDjango["get_format"];
}

const main = function () {
    const elem = document.querySelector("#bundlegroup-table") as HTMLDivElement;
    const bundleGroupTypeURL = elem.dataset.bundlegrouptypeApi || "";
    const bundleGroupURL = elem.dataset.bundlegroupApi || "";
    const concreteBundleURL = elem.dataset.concretebundleApi || "";
    const concreteBundleProductChoiceURL =
        elem.dataset.concretebundleProductChoiceApi || "";
    const userConfigurableBundleURL =
        elem.dataset.userconfigurablebundleApi || "";
    const userConfigurableBundleRangeChoiceURL =
        elem.dataset.userconfigurablebundleRangeChoiceApi || "";
    const root = createRoot(elem);
    root.render(
        <BundleGroupTable
            bundleGroupTypeURL={bundleGroupTypeURL}
            bundleGroupURL={bundleGroupURL}
            concreteBundleURL={concreteBundleURL}
            concreteBundleProductChoiceURL={concreteBundleProductChoiceURL}
            userConfigurableBundleURL={userConfigurableBundleURL}
            userConfigurableBundleRangeChoiceURL={
                userConfigurableBundleRangeChoiceURL
            }
        />,
    );
};

main();
