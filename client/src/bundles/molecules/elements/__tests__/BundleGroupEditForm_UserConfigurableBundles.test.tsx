import React from "react";
import { render } from "@testing-library/react";
import { IProduct, IRange } from "../../../../utils/models.interfaces";
import { UserConfigurableBundles } from "../BundleGroupEditForm_UserConfigurableBundles";

const products: IProduct[] = [
    {
        id: 1,
        dashboard_url: "http://localhost/store/dashboard/catalogue/products/1/",
        product_class: {
            id: 1,
            name: "books",
        },
        title: "book-1",
        slug: "book-1",
        is_parent: false,
        is_child: false,
        parent: null,
        children: [],
    },
    {
        id: 2,
        dashboard_url: "http://localhost/store/dashboard/catalogue/products/2/",
        product_class: {
            id: 1,
            name: "books",
        },
        title: "book-2",
        slug: "book-2",
        is_parent: false,
        is_child: false,
        parent: null,
        children: [],
    },
];

const ranges: IRange[] = [
    {
        id: 1,
        dashboard_url: "http://localhost/store/dashboard/ranges/1/",
        name: "All Products",
        slug: "all-products",
        description: "",
    },
    {
        id: 2,
        dashboard_url: "http://localhost/store/dashboard/ranges/2/",
        name: "Books",
        slug: "books",
        description: "",
    },
];

describe("#bundles/molecules/elements/UserConfigurableBundles", () => {
    it("renders", () => {
        const wrapper = render(
            <UserConfigurableBundles
                ranges={ranges}
                isSaving={false}
                triggeringParents={[1]}
                linkedRanges={{
                    "1": [
                        {
                            rangeID: 1,
                            quantity: 2,
                        },
                    ],
                }}
                getProduct={() => products[0]}
                onLinkedRangesChange={() => null}
                onLinkedRangeQuantityChange={() => null}
            />
        );
        expect(wrapper.asFragment()).toMatchSnapshot();
    });
});
