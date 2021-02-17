import React from 'react';
import {render} from '@testing-library/react';
import {BundleGroupMetaFields} from '../BundleGroupEditForm_MetaFields';


describe('#bundles/molecules/elements/BundleGroupMetaFields', () => {

    it('renders', () => {
        const wrapper = render(
            <BundleGroupMetaFields
                bundleTypeChoices={[
                    {
                        display_name: 'Default',
                        value: 'default',
                    },
                ]}
                group={{
                    id: 1,
                    bundle_type: 'default',
                    name: 'name',
                    description: '',
                    headline: '',
                    image: 'https://placeimg.com/640/480/any',
                    newImage: null,
                    clearImage: false,
                    triggering_parents: [],
                    suggested_parents: [],
                    concrete_bundles: [],
                    user_configurable_bundles: [],
                }}
                isSaving={false}
                errors={{}}
                bundleType={''}
                name={''}
                headline={''}
                description={''}
                image={null}
                clearImage={false}
                onEdit={() => null}
                onSelectImage={() => null}
                onClearImage={() => null}
            />
        );
        expect(wrapper.asFragment()).toMatchSnapshot();
    });


    it('renders error messages', () => {
        const wrapper = render(
            <BundleGroupMetaFields
                bundleTypeChoices={[]}
                group={null}
                isSaving={false}
                errors={{
                    bundleType: [],
                    name: ["Please choose a valid name"],
                    headline: [],
                    description: [],
                    image: [],
                }}
                bundleType={''}
                name={''}
                headline={''}
                description={''}
                image={null}
                clearImage={false}
                onEdit={() => null}
                onSelectImage={() => null}
                onClearImage={() => null}
            />
        );
        expect(wrapper.asFragment()).toMatchSnapshot();
    });

});
