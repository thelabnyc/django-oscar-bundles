import * as t from 'io-ts';
import {failure} from 'io-ts/lib/PathReporter';
import {Either, isLeft} from 'fp-ts/lib/Either';


export const check = <T>(result: Either<t.Errors, T>): T => {
    if (isLeft(result)) {
        throw new Error(failure(result.left).join('\n'));
    }
    return result.right;
};

const nullable = <RT extends t.Mixed>(type: RT) => {
    return t.union([t.null, type]);
};

export const optional = <RT extends t.Mixed>(type: RT) => {
    return t.union([t.undefined, type]);
};

class FileType extends t.Type<File> {
    readonly _tag: 'NumberType' = 'NumberType';
    constructor() {
        super(
            'number',
            (f): f is File => {
                return f instanceof File;
            },
            (u, c) => {
                return this.is(u) ? t.success(u) : t.failure(u, c);
            },
            t.identity
        );
    }
}
const file = new FileType();



export const DRFSelectOption = t.interface({
    value: t.string,
    display_name: t.string,
});
export const DRFSelectOptions = t.readonlyArray(DRFSelectOption);

export const BaseField = <T extends string>(fieldType: t.LiteralC<T>) => {
    return t.interface({
        type: fieldType,
        required: t.boolean,
        read_only: t.boolean,
        label: t.string,
        help_text: optional(t.string),
    });
};

export const IntegerField = BaseField(t.literal("integer"));

export const BooleanField = BaseField(t.literal("boolean"));

export const DatetimeField = BaseField(t.literal("datetime"));

export const StringField = t.intersection([
    BaseField(t.literal("string")),
    t.interface({
        max_length: optional(t.number),
    }),
]);

export const ChoiceField = t.intersection([
    BaseField(t.literal("choice")),
    t.interface({
        choices: DRFSelectOptions,
    }),
]);

export const Field = t.union([
    IntegerField,
    BooleanField,
    DatetimeField,
    StringField,
    ChoiceField,
    t.unknown,
]);

export const HTTPMethod = t.union([
    t.literal("GET"),
    t.literal("HEAD"),
    t.literal("OPTIONS"),
    t.literal("POST"),
    t.literal("PUT"),
    t.literal("PATCH"),
    t.literal("DELETE"),
]);

export const DRFOptionsResponse = t.interface({
    name: t.string,
    description: t.string,
    renders: t.readonlyArray(t.string),
    parses: t.readonlyArray(t.string),
    actions: t.interface({
        GET: optional(t.record(t.string, Field)),
        HEAD: optional(t.record(t.string, Field)),
        OPTIONS: optional(t.record(t.string, Field)),
        POST: optional(t.record(t.string, Field)),
        PUT: optional(t.record(t.string, Field)),
        PATCH: optional(t.record(t.string, Field)),
        DELETE: optional(t.record(t.string, Field)),
    }),
});




export const Product = t.interface({
    id: t.number,
    dashboard_url: t.string,
    product_class: nullable(t.interface({
        id: t.number,
        name: t.string,
    })),
    title: t.string,
    slug: t.string,
    is_parent: t.boolean,
    is_child: t.boolean,
    parent: nullable(t.number),
    children: t.array(t.number),
});
export const Products = t.array(Product);



export const Range = t.interface({
    id: t.number,
    dashboard_url: t.string,
    name: t.string,
    slug: t.string,
    description: t.string,
});
export const Ranges = t.array(Range);



export const ConcreteBundle = t.interface({
    id: nullable(t.number),
    triggering_product: t.number,
    suggested_products: t.array(t.number),
});
export const ConcreteBundles = t.array(ConcreteBundle);



export const UserConfigurableBundle = t.interface({
    id: nullable(t.number),
    triggering_product: t.number,
    suggested_range: t.number,
    quantity: t.number,
});
export const UserConfigurableBundles = t.array(UserConfigurableBundle);



export const BundleGroup = t.interface({
    id: nullable(t.number),
    bundle_type: t.string,
    name: t.string,
    description: t.string,
    headline: t.string,
    image: optional(nullable(t.string)),
    newImage: optional(nullable(file)),
    clearImage: optional(t.boolean),
    triggering_parents: t.array(t.number),
    suggested_parents: t.array(t.number),
    concrete_bundles: t.array(ConcreteBundle),
    user_configurable_bundles: t.array(UserConfigurableBundle),
});
export const BundleGroups = t.array(BundleGroup);
