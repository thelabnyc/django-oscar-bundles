import request = require('superagent');
import cookies = require('js-cookie');
import {
    IDRFSelectOption,
    IBundleGroup,
    IProduct,
    IRange,
    IConcreteBundle,
    IUserConfigurableBundle,
} from './models.interfaces';
import {
    check,
    ChoiceField,
    DRFOptionsResponse,
    BundleGroup,
    BundleGroups,
    Products,
    Ranges,
    ConcreteBundles,
    UserConfigurableBundles,
} from './models';


const CSRF_HEADER = 'X-CSRFToken';


const getCSRFToken = function() {
    return cookies.get('csrftoken') || '';
};


const fetchData = async (endpoint: string) => {
    return request
        .get(endpoint)
        .set('Accept', 'application/json');
};


export const getBundleTypeChoices = async (endpoint: string): Promise<ReadonlyArray<IDRFSelectOption>> => {
    const resp = await request
        .options(endpoint)
        .set('Accept', 'application/json');
    const body = check(DRFOptionsResponse.decode(resp.body));
    const field = check(ChoiceField.decode(body.actions.POST.bundle_type));
    const choices = field.choices;
    return choices;
};


export const listBundleGroups = async (endpoint: string): Promise<IBundleGroup[]> => {
    const resp = await fetchData(endpoint);
    return check(BundleGroups.decode(resp.body));
};


export const listProducts = async (endpoint: string): Promise<IProduct[]> => {
    const resp = await fetchData(endpoint);
    return check(Products.decode(resp.body));
};


export const listRanges = async (endpoint: string): Promise<IRange[]> => {
    const resp = await fetchData(endpoint);
    return check(Ranges.decode(resp.body));
};


export const listConcreteBundles = async (endpoint: string): Promise<IConcreteBundle[]> => {
    const resp = await fetchData(endpoint);
    return check(ConcreteBundles.decode(resp.body));
};


export const listUserConfigurableBundles = async (endpoint: string): Promise<IUserConfigurableBundle[]> => {
    const resp = await fetchData(endpoint);
    return check(UserConfigurableBundles.decode(resp.body));
};


const _saveBundleGroupData = async (endpoint: string, group: IBundleGroup): Promise<IBundleGroup> => {
    const req = (group.id)
        ? request.patch(`${endpoint}${group.id}/`)
        : request.post(endpoint);
    const data = {...group};
    delete data.image;
    delete data.newImage;
    delete data.clearImage;
    const resp = await req
        .set('Accept', 'application/json')
        .set(CSRF_HEADER, getCSRFToken())
        .send(data);
    return check(BundleGroup.decode(resp.body));
};


const _saveBundleGroupImage = async (endpoint: string, group: IBundleGroup): Promise<void> => {
    if (!group.id) {
        throw new Error("Can not save image for unsaved bundle group");
    }

    if (!group.newImage && !group.clearImage) {
        return Promise.resolve();
    }

    let req = request
        .patch(`${endpoint}${group.id}/`)
        .set('Accept', 'application/json')
        .set(CSRF_HEADER, getCSRFToken());

    if (group.newImage && !group.clearImage) {
        req = req.attach('image', group.newImage, group.newImage.name);
    } else if (group.clearImage) {
        req = req.send({ 'image': null });
    }

    await req;
};


export const saveBundleGroup = async (endpoint: string, data: IBundleGroup): Promise<IBundleGroup> => {
    const group = await _saveBundleGroupData(endpoint, data);
    data.id = group.id;  // Update bundle group ID if it was just created
    await _saveBundleGroupImage(endpoint, data);
    return group;
};


export const deleteBundleGroup = async (endpoint: string, group: IBundleGroup): Promise<void> => {
    if (!group.id) {
        throw new Error('Can not delete unsaved bundle group');
    }
    await request
        .delete(`${endpoint}${group.id}/`)
        .set('Accept', 'application/json')
        .set(CSRF_HEADER, getCSRFToken());
};
