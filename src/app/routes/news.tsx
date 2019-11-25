import React from "react";
import { NewsList } from '../main/news/components/news-list/news-list';
import { Resource } from "../core/services";

export default class News extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            sources: this.props.location.state.data,
            id: this.props.match.params.id,
            sortBysAvailable: this.props.location.state.sortBysAvailable
        }
    }

    render() {
        return (
            <>
                <NewsList id={this.state.id} sources={this.state.sources} sortBysAvailable={this.state.sortBysAvailable} />
            </>
        )
    }
}