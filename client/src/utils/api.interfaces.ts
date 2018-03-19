export interface IProduct {
    id: number;
    dashboard_url: string;
    product_class: {
        id: number;
        name: string;
    };
    title: string;
    slug: string;
    is_parent: boolean;
    is_child: boolean;
    parent: number;
    children: number[];
}


export interface IBundle {
    id: number | null;
    triggering_product: number;
    suggested_products: number[];
}


export interface IBundleGroup {
    id: number | null;
    bundle_type: string;
    name: string;
    description: string;
    image: string;
    newImage?: File | null;
    clearImage?: boolean;
    triggering_parents: number[];
    suggested_parents: number[];
    bundles: IBundle[];
}


export interface ICharFieldChoice {
    value: string;
    display_name: string;
}
