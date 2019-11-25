import React from "react";
import { Box } from "@material-ui/core";
import Pagination from "react-js-pagination";
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import * as _ from 'lodash';

import { NewsListProps, NewsListState, SourceModel } from "../../../../core/shared/models";
import { Resource } from "../../../../core/services";
import NewsSortingButton from "../news-sorting/news-sorting-buttons";
import './news-list.css';
import ExpiredStorage from "expired-storage";

export class NewsList extends React.Component<NewsListProps, NewsListState> {
    private resource: any;
    private expiredStorage: any;

    constructor(props: NewsListProps) {
        super(props)
        this.state = {
            articles: [],
            totalCount: 0,
            page: 1,
            sources: [],
            id: this.props.id,
            sortBysAvailable: this.props.sortBysAvailable
        }

        this.expiredStorage = new ExpiredStorage();
    }

    componentDidMount() {
        this.resource = new Resource();

        this.handlePageClick(1);
        this.resource.getArticels(this.props.id).then((response: any) => {
            this.expiredStorage.setItem(`source-${this.props.id}-top`, JSON.stringify(response.data.articles), 1200);
            this.expiredStorage.setItem('id', this.state.id);
            this.setState({ articles: response.data.articles, totalCount: this.props.sources.length })
        });
    }

    handlePageClick(data: number) {
        const selected = data;
        const start = (Math.ceil(selected) - 1) * 6;
        const end = start + 6;

        const filteredSource = this.props.sources.slice(start, end);

        this.setState({
            page: data,
            sources: filteredSource as []
        });
    }

    handleSorting(type: string) {
        const storage = this.checkLocalStorage(`source-${this.state.id}-${type}`);
        if (storage) {
            this.setState({ articles: storage });
        } else {
            this.resource.getSortedArticles(this.state.id, type).then((response: any) => {
                this.expiredStorage.setItem(`source-${this.state.id}-${type}`, JSON.stringify(response.data.articles), 1200);
                this.setState({ articles: response.data.articles })
            })
        }
    }

    handleNews(id: string, sortBysAvailable: string[]) {
        if (id !== this.state.id) {
            const expiredStorage = new ExpiredStorage();
            const sourceExisted = this.checkLocalStorage(`source-${id}-top`);
            if (sourceExisted) {
                this.setState({
                    articles: sourceExisted,
                    id: id,
                    sortBysAvailable: sortBysAvailable
                })
            } else {
                this.resource.getArticels(id).then((response: any) => {
                    expiredStorage.setItem(`source-${id}-top`, JSON.stringify(response.data.articles), 1200);
                    expiredStorage.setItem('sortBysAvailable', JSON.stringify(sortBysAvailable));
                    expiredStorage.setItem('id', id);
                    this.setState({
                        articles: response.data.articles,
                        id: id,
                        sortBysAvailable: sortBysAvailable
                    })
                });
            }
        }
    }

    checkLocalStorage(type: string) {
        const expiredStorage = new ExpiredStorage();
        const sources = expiredStorage.getItem(type);
        return sources ? JSON.parse(sources) : false
    }

    render() {
        return (
            <div>
                <Box display="flex" flexWrap="wrap" justifyContent="space-around">
                    <div className="SourceNewsContainer">
                        <h1>Source Tiles</h1>
                        <Box display="flex" flexWrap="wrap" flexDirection="column">
                            {this.state.sources ? this.state.sources.map((source: SourceModel) => {
                                return (
                                    <div className="SourceNews" key={source.id}>
                                        <h4>{source.name}</h4>
                                        <div className="SlideInUp">
                                            <span>{source.description}</span>
                                            <div className="SourceLink">
                                                <Link to={{
                                                    pathname: `${source.id}`,
                                                    state: {
                                                        data: this.props.sources,
                                                    }
                                                }}>
                                                    <Button onClick={() => this.handleNews(source.id, source.sortBysAvailable)} variant="contained" color="primary">
                                                        Visit view source
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : ''}
                        </Box>
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <div className='text-center'>
                                    <Pagination
                                        activeClass="active"
                                        innerClass={'pagination'}
                                        prevPageText='prev'
                                        nextPageText=' next'
                                        firstPageText='first'
                                        lastPageText='last'
                                        activePage={this.state.page}
                                        itemsCountPerPage={6}
                                        totalItemsCount={this.state.totalCount}
                                        onChange={this.handlePageClick.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ArticlesContainer">
                        <Box display="flex" flexWrap="wrap" flexDirection="column">
                            <h1>SortBy:</h1>
                            <Box display="flex" flexWrap="wrap" justifyContent="center">
                                <NewsSortingButton sortBysAvailable={this.state.sortBysAvailable ? this.state.sortBysAvailable : this.expiredStorage.getItem('sortBysAvailable')} name="top" sortedByType={this.handleSorting.bind(this)} />
                                <NewsSortingButton sortBysAvailable={this.state.sortBysAvailable ? this.state.sortBysAvailable : this.expiredStorage.getItem('sortBysAvailable')} name="latest" sortedByType={this.handleSorting.bind(this)} />
                                <NewsSortingButton sortBysAvailable={this.state.sortBysAvailable ? this.state.sortBysAvailable : this.expiredStorage.getItem('sortBysAvailable')} name="popular" sortedByType={this.handleSorting.bind(this)} />
                            </Box>
                            {this.state.articles ? this.state.articles.map((article: any, index: number) => {
                                return (
                                    <Box className="Article" display="flex" flexDirection="column" key={index}>
                                        <span>{article.title}</span>
                                        <div>
                                            <img src={article.urlToImage} />
                                        </div>
                                        <span>{article.author}</span>
                                        <span>{new Date(article.publishedAt).toDateString()}</span>
                                    </Box>
                                )
                            }) : <h1>No articles</h1>}
                        </Box>
                    </div>
                </Box>
            </div>
        )
    }
}