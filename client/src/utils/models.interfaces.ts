import * as t from "io-ts";
import * as models from "./models";

export type IDRFSelectOption = t.TypeOf<typeof models.DRFSelectOption>;
export type IDRFSelectOptions = ReadonlyArray<IDRFSelectOption>;

export type IDRFOptionsResponse = t.TypeOf<typeof models.DRFOptionsResponse>;

export type IProduct = t.TypeOf<typeof models.Product>;

export type IRange = t.TypeOf<typeof models.Range>;

export type IConcreteBundle = t.TypeOf<typeof models.ConcreteBundle>;

export type IUserConfigurableBundle = t.TypeOf<
    typeof models.UserConfigurableBundle
>;

export type IBundleGroup = t.TypeOf<typeof models.BundleGroup>;

export type SelectOption = {
    value: number;
    label: string;
};
