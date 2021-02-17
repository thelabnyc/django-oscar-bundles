import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BundleGroupEditFormActions} from '../BundleGroupEditForm_Actions';


describe('#bundles/molecules/elements/BundleGroupEditFormActions', () => {

    it('renders', () => {
        const wrapper = render(
            <BundleGroupEditFormActions
                onCancel={() => null}
            />
        );
        expect(wrapper.asFragment()).toMatchSnapshot();
    });


    it('triggers close callback', () => {
        const onCancel = jest.fn();
        render(
            <BundleGroupEditFormActions
                onCancel={onCancel}
            />
        );

        expect(onCancel).toHaveBeenCalledTimes(0);

        userEvent.click(screen.getByText('Cancel'));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });

});
