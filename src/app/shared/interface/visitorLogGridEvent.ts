import { StaffResponseModel } from "../models/staffModel";
import { SortColumn, SortDirection } from "./visitorLogSortEvent";

export interface SearchResult {
	staffList: StaffResponseModel[];
	total: number;
}

export interface State {
	page: number;
	pageSize: number;
	globalSearchTerm: string;
	sortColumn: SortColumn;
	sortDirection: SortDirection;
	lastName: string;
	timeStamp: any;
	guestType: string;
	firstName: string;
	phoneNumber: string;
	email: string;
	salesPersonName: string;
	equipmentName: string;
	totSpotBabysitting: string;
	checkOutTimeStamp: any;
}

export const compare = (v1: string | number | boolean | Date | null, v2: string | number | boolean | Date | null) => (v1! < v2! ? -1 : v1! > v2! ? 1 : 0);