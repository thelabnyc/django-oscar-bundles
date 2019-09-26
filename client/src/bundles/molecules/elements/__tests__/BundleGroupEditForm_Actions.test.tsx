import React from 'react';
import {shallow} from 'enzyme';
import {BundleGroupEditFormActions} from '../BundleGroupEditForm_Actions';


describe('#bundles/molecules/elements/BundleGroupEditFormActions', () => {

    it('renders', () => {
        const wrapper = shallow(
            <BundleGroupEditFormActions
                onCancel={() => null}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });


    it('triggers close callback', () => {
        const onCancel = jest.fn();
        const wrapper = shallow(
            <BundleGroupEditFormActions
                onCancel={onCancel}
            />
        );

        expect(onCancel).toHaveBeenCalledTimes(0);

        wrapper.find('.btn').first().simulate('click');

        expect(onCancel).toHaveBeenCalledTimes(1);
    });

});
