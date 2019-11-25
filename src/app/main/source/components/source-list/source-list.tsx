import React from "react";
import Box from '@material-ui/core/Box';
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import Button from '@material-ui/core/Button';


import { SourceListProps, SourceListState, SourceModel } from "../../../../core/shared/models";
import "./source-list.css";

export class SourceList extends React.Component<SourceListProps, SourceListState> {
    constructor(props: SourceListProps) {
        super(props);
        this.state = {
            page: 1,
            sources: props.sources,
            totalCount: 0,
        }
    }

    componentDidMount() {
        if (this.state.sources) {
            this.handlePageClick(1);
        }
    }

    componentWillReceiveProps(nextProps: any) {
        this.setState({
            sources: nextProps.sources,
            totalCount: nextProps.sources.length
        }, () => this.handlePageClick(1));
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

    render() {
        let pagination;

        if (this.state.sources.length > 0) {
            pagination = <div className="panel panel-default">
                <div className="panel-body">
                    <div className='text-center'>
                        <Pagination
                            activeClass="active"
                            innerClass={'pagination'}
                            prevPageText='prev'
                            nextPageText='next'
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
        } else {
            pagination = null
        }

        return (
            <>
                <Box display="flex" flexWrap="wrap" className="Table">
                    {this.state.sources.length > 0 ? this.state.sources.map((source: SourceModel) => {
                        return (
                            <div className="Tile" key={source.id}>
                                <h3>{source.name}</h3>
                                <Box display="flex" flexWrap="wrap" flexDirection="column" className="SlideInUp" >
                                    <span>{source.description}</span>
                                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                                        <Button variant="contained" color="primary">
                                            Visit source stie
                                        </Button>
                                    </a>
                                    <span>
                                        <Link to={{
                                            pathname: `news/${source.id}`,
                                            state: {
                                                data: this.props.sources,
                                                sortBysAvailable: source.sortBysAvailable
                                            }
                                        }}>
                                            <Button variant="contained" color="primary">
                                                Visit view source
                                            </Button>
                                        </Link>
                                    </span>
                                </Box>
                            </div>
                        )
                    }) : <h1 className="NoSource">No sources</h1>}
                </Box>
                {pagination}
            </>
        )
    }

}