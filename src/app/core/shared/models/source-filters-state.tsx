import { SourceModel } from "./source.model";

export interface SourceFiltersState {
    sources: SourceModel[];
    allFilters: [];
    totalCount: number;
}