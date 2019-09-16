import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';


// Configure an Enzyme adapter for testing
enzyme.configure({
    adapter: new Adapter(),
});
