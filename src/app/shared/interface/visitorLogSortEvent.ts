import { StaffResponseModel } from "../models/staffModel";

export type SortColumn = keyof StaffResponseModel | '';
export type SortDirection = 'asc' | 'desc' | '';
export const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
	column: SortColumn;
	direction: SortDirection;
}