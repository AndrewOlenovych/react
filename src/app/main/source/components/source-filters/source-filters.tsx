import React from "react";
import * as _ from 'lodash';
import Box from '@material-ui/core/Box';
import urlParams from 'url-params';
import ExpiredStorage from "expired-storage";

import MultipleSelect from '../multiple-select';
import { Resource } from "../../../../core/services";
import { SourceList } from "../source-list/source-list";
import { SourceModel, SourceFiltersState } from "../../../../core/shared/models";
import './source-filters.css';

export class SourceFilters extends React.Component<any, SourceFiltersState> {
    constructor(props: SourceFilters) {
        super(props)
        this.state = {
            allFilters: [],
            sources: [],
            totalCount: 0
        }
    }

    private category: string[] = [];
    private country: string[] = [];
    private language: string[] = [];
    private totalSources: SourceModel[] = [];

    componentDidMount() {
        const resource = new Resource();
        resource.getAllResource().then((response) => {
            this.totalSources = response.data.sources;
            this.setState({ sources: response.data.sources }, () => this.handleFiltersFromUrl())});
    }


    handleFilters(filters: string[], type: string, filtersInUrl: boolean) {
        if (!filtersInUrl) {
            switch (type) {
                case 'category':
                    this.category = filters;
                    this.setFiltersToUrls(filters, type)
                    break
                case 'language':
                    this.language = filters
                    this.setFiltersToUrls(filters, type)
                    break
                case 'country':
                    this.country = filters;
                    this.setFiltersToUrls(filters, type)
                    break
            }
        }

        const unionFilters = [this.category, this.language, this.country];

        const unionFiltersCount = _.union(this.category, this.language, this.country);

        const filteredSource = _.filter(this.totalSources, (sourceItem) => {
            const transformValue = Object.values(sourceItem);
            return unionFilters.every((filters) => {
                if (filters.length > 0) {
                    return transformValue.some((value) => filters.some((filters) => filters === value))
                } else {
                    return true;
                }
            })
        });

        this.setState({
            sources: unionFiltersCount.length > 0 || filtersInUrl ? filteredSource : this.totalSources,
        });
    }

    handleFiltersFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams) {
            const languageParam = urlParams.get('language') as string;
            const countryParam = urlParams.get('country') as string;
            const categoryParam = urlParams.get('category') as string;

            if (languageParam || countryParam || categoryParam) {
                this.category = categoryParam ? categoryParam.split(' ') : [];
                this.language = languageParam ? languageParam.split(' ') : [];
                this.country = countryParam ? countryParam.split(' ') : [];
                this.handleFilters([], '', true)
            }
        }
    }

    setFiltersToUrls(filters: string[], type: string) {
        if (filters.length < 1) {
            const newUrl = urlParams.remove(window.location.href, type, undefined);
            window.history.pushState("", "", newUrl);
        } else {
            const newUrl = urlParams.set(window.location.href, type, filters);
            window.history.pushState("", "", newUrl);
        }
    }

    render() {
        return (
            <div>
                <Box display="flex" flexWrap="wrap">
                    <Box display="flex" className="SelectsContainer" flexBasis="10%" flexShrink="1" flexGrow="1" flexDirection="column">
                        <h1>Filters:</h1>
                        <Box display="flex" alignItems="center" flexDirection="column">
                            <MultipleSelect value={this.category} type="category" filterChange={this.handleFilters.bind(this)} />
                            <MultipleSelect value={this.language} type="language" filterChange={this.handleFilters.bind(this)} />
                            <MultipleSelect value={this.country} type="country" filterChange={this.handleFilters.bind(this)} />
                        </Box>
                    </Box>
                    <Box display="flex" className="SourceContainer" flexBasis="70%" flexShrink="1" flexGrow="1" flexDirection="column">
                        <h1>Source Tiles</h1>
                        <SourceList sources={this.state.sources} />
                    </Box>
                </Box>
            </div>
        )
    }
}