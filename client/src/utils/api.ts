import request = require('superagent');
import cookies = require('js-cookie');
import {IBundleGroup, IProduct, IBundle, ICharFieldChoice} from './api.interfaces';

const CSRF_HEADER = 'X-CSRFToken';


const getCSRFToken = function() {
    return cookies.get('csrftoken') || '';
};


const fetchData = function<T>(endpoint: string) {
    return request
        .get(endpoint)
        .set('Accept', 'application/json')
        .then((resp) => {
            return resp.body as T;
        });
};


export const getBundleTypeChoices = function(endpoint: string) {
    return request
        .options(endpoint)
        .set('Accept', 'application/json')
        .then((resp) => {
            return resp.body.actions.POST.bundle_type.choices as ICharFieldChoice[];
        });
};


export const listBundleGroups = function(endpoint: string) {
    return fetchData<IBundleGroup[]>(endpoint);
};


export const listProducts = function(endpoint: string) {
    return fetchData<IProduct[]>(endpoint);
};


export const listBundles = function(endpoint: string) {
    return fetchData<IBundle[]>(endpoint);
};


const _saveBundleGroupData = function(endpoint: string, group: IBundleGroup) {
    let req = (group.id)
        ? request.patch(`${endpoint}${group.id}/`)
        : request.post(endpoint);
    const data = {...group};
    delete data.image;
    delete data.newImage;
    delete data.clearImage;
    return req
        .set('Accept', 'application/json')
        .set(CSRF_HEADER, getCSRFToken())
        .send(data)
        .then((resp) => {
            return resp.body as IBundleGroup;
        });
};


const _saveBundleGroupImage = function(endpoint: string, group: IBundleGroup) {
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

    return req
        .then(() => {
            return;
        });
};


export const saveBundleGroup = function(endpoint: string, data: IBundleGroup) {
    return _saveBundleGroupData(endpoint, data)
        .then((group) => {
            data.id = group.id;  // Update bundle group ID if it was just created
            return _saveBundleGroupImage(endpoint, data).then(() => {
                return group;
            });
        });
};


export const deleteBundleGroup = function(endpoint: string, group: IBundleGroup) {
    if (!group.id) {
        throw new Error('Can not delete unsaved bundle group');
    }
    return request
        .delete(`${endpoint}${group.id}/`)
        .set('Accept', 'application/json')
        .set(CSRF_HEADER, getCSRFToken());
};
