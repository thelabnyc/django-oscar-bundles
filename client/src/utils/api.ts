import cookies from "js-cookie";
import {
    IDRFSelectOption,
    IBundleGroup,
    IProduct,
    IRange,
    IConcreteBundle,
    IUserConfigurableBundle,
} from "./models.interfaces";
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
} from "./models";

const CSRF_HEADER = "X-CSRFToken";

const getCSRFToken = function (): string {
    return cookies.get("csrftoken") || "";
};

const fetchData = async (endpoint: string) => {
    return fetch(endpoint, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });
};

export const getBundleTypeChoices = async (
    endpoint: string
): Promise<ReadonlyArray<IDRFSelectOption>> => {
    const resp = await fetch(endpoint, {
        method: "OPTIONS",
        headers: {
            Accept: "application/json",
        },
    });
    const body = check(DRFOptionsResponse.decode(await resp.json()));
    if (!body.actions.POST) {
        return [];
    }
    const field = check(ChoiceField.decode(body.actions.POST.bundle_type));
    const choices = field.choices;
    console.log("getBundleTypeChoices", choices)
    return choices;
};

export const listBundleGroups = async (
    endpoint: string
): Promise<IBundleGroup[]> => {
    const resp = await fetchData(endpoint);
    console.log(endpoint, 'ENDPOINT::')

    console.log(resp.body, 'listBundleGroups3::')

    return check(BundleGroups.decode(resp.body));
};

export const listProducts = async (endpoint: string): Promise<IProduct[]> => {
    const resp = await fetchData(endpoint);
    console.log(resp, 'listProducts:::')
    return check(Products.decode(resp.body));
};

export const listRanges = async (endpoint: string): Promise<IRange[]> => {
    const resp = await fetchData(endpoint);
    console.log(resp.body, 'listRanges:::')
    return check(Ranges.decode(resp.body));
};

export const listConcreteBundles = async (
    endpoint: string
): Promise<IConcreteBundle[]> => {
    const resp = await fetchData(endpoint);
    return check(ConcreteBundles.decode(resp.body));
};

export const listUserConfigurableBundles = async (
    endpoint: string
): Promise<IUserConfigurableBundle[]> => {
    const resp = await fetchData(endpoint);
    return check(UserConfigurableBundles.decode(resp.body));
};

const _saveBundleGroupData = async (
    endpoint: string,
    group: IBundleGroup
): Promise<IBundleGroup> => {
    const [method, url] = group.id
        ? ["PATCH", `${endpoint}${group.id}/`]
        : ["POST", endpoint];
    const data = { ...group };
    delete data.image;
    delete data.newImage;
    delete data.clearImage;
    const resp = await fetch(url, {
        method: method,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            [CSRF_HEADER]: getCSRFToken(),
        },
        body: JSON.stringify(data),
    });
    return check(BundleGroup.decode(resp.body));
};

const _saveBundleGroupImage = async (
    endpoint: string,
    group: IBundleGroup
): Promise<void> => {
    if (!group.id) {
        throw new Error("Can not save image for unsaved bundle group");
    }

    if (!group.newImage && !group.clearImage) {
        return Promise.resolve();
    }

    if (group.newImage && !group.clearImage) {
        const formData = new FormData();
        formData.append(`image`, group.newImage, group.newImage.name);
        await fetch(`${endpoint}${group.id}/`, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                [CSRF_HEADER]: getCSRFToken(),
            },
            body: formData,
        });
        return;
    }

    if (group.clearImage) {
        await fetch(`${endpoint}${group.id}/`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                [CSRF_HEADER]: getCSRFToken(),
            },
            body: JSON.stringify({
                image: null,
            }),
        });
        return;
    }
};

export const saveBundleGroup = async (
    endpoint: string,
    data: IBundleGroup
): Promise<IBundleGroup> => {
    const group = await _saveBundleGroupData(endpoint, data);
    data.id = group.id; // Update bundle group ID if it was just created
    await _saveBundleGroupImage(endpoint, data);
    return group;
};

export const deleteBundleGroup = async (
    endpoint: string,
    group: IBundleGroup
): Promise<void> => {
    if (!group.id) {
        throw new Error("Can not delete unsaved bundle group");
    }
    await fetch(`${endpoint}${group.id}/`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            [CSRF_HEADER]: getCSRFToken(),
        },
    });
};
