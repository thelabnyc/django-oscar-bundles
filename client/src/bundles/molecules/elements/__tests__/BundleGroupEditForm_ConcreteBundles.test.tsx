import React from 'react';
import {render} from '@testing-library/react';
import {IProduct} from '../../../../utils/models.interfaces';
import {ConcreteBundles} from '../BundleGroupEditForm_ConcreteBundles';


const products: IProduct[] = [
    {
        "id": 1,
        "dashboard_url": "http://localhost/store/dashboard/catalogue/products/1/",
        "product_class": {
            "id": 1,
            "name": "books"
        },
        "title": "book-1",
        "slug": "book-1",
        "is_parent": false,
        "is_child": false,
        "parent": null,
        "children": [],
    },
    {
        "id": 2,
        "dashboard_url": "http://localhost/store/dashboard/catalogue/products/2/",
        "product_class": {
            "id": 1,
            "name": "books"
        },
        "title": "book-2",
        "slug": "book-2",
        "is_parent": false,
        "is_child": false,
        "parent": null,
        "children": [],
    },
];


describe('#bundles/molecules/elements/ConcreteBundles', () => {

    it('renders', () => {
        const wrapper = render(
            <ConcreteBundles
                products={products}
                isSaving={false}
                triggeringParents={[1]}
                suggestedParents={[2]}
                linkedProducts={{
                    '1': [2],
                }}
                getProduct={() => products[0]}
                onLinkedProductsChange={() => null}
            />
        );
        expect(wrapper.asFragment()).toMatchSnapshot();
    });

});
