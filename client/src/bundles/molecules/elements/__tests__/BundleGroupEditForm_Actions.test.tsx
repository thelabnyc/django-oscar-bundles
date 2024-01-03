import React from "react";
import { render } from "@testing-library/react";
import { BundleGroupEditFormActions } from "../BundleGroupEditForm_Actions";

describe("#bundles/molecules/elements/BundleGroupEditFormActions", () => {
    it("renders", () => {
        const wrapper = render(
            <BundleGroupEditFormActions onCancel={() => null} />,
        );
        expect(wrapper.asFragment()).toMatchSnapshot();
    });
});
