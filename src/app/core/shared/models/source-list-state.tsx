import { SourceModel } from ".";

export interface SourceListState {
    page: number;
    sources: SourceModel[];
    totalCount: number;
}