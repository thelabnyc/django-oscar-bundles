import * as t from 'io-ts';
import * as models from './models';


export interface IDRFSelectOption extends t.TypeOf<typeof models.DRFSelectOption> {}
export type IDRFSelectOptions = ReadonlyArray<IDRFSelectOption>;

export interface IDRFOptionsResponse extends t.TypeOf<typeof models.DRFOptionsResponse> {}

export interface IProduct extends t.TypeOf<typeof models.Product> {}

export interface IRange extends t.TypeOf<typeof models.Range> {}

export interface IConcreteBundle extends t.TypeOf<typeof models.ConcreteBundle> {}

export interface IUserConfigurableBundle extends t.TypeOf<typeof models.UserConfigurableBundle> {}

export interface IBundleGroup extends t.TypeOf<typeof models.BundleGroup> {}

export type SelectOption = {
    value: number;
    label: string;
};
