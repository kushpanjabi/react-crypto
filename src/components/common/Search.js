import React from 'react';
import Loading from './Loading';
import { API_URL } from '../../config';
import { handleResponse } from '../../helper';
import './Search.css';

class Search extends React.Component {
    constructor() {
        super();

        this.state = {
            searchQuery: '',
            loading: false,
            searchResults: []
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const searchQuery = event.target.value;

        this.setState({ searchQuery: searchQuery });

        // If searchQuery isn't present, do not send request to server
        if (!searchQuery) {
            return '';
        }

        this.setState({ loading: true });

        fetch(`${API_URL}/autocomplete?searchQuery=${searchQuery}`)
            .then(handleResponse)
            .then((result) => {
                this.setState({ loading: false, searchResults: result });
            });
    }

    renderSearchResults() {
        const { searchResults, searchQuery } = this.state;

        if (!searchQuery) {
            return '';
        }

        if (searchResults.length > 0) {
            return (
                <div className="Search-result-container">
                    {searchResults.map(result => (
                        <div
                            key={result.id}
                            className="Search-result"
                        >
                            {result.name} ({result.symbol})
                        </div>
                    ))}
                </div>
            );
        }
        return (
            <div className="Search-result-container">
                <div className="Search-no-result">No results found.</div>
            </div>
        )
    }

    render() {
        const { loading } = this.state;

        return (
            <div className="Search">
                <span className="Search-icon" />

                <input
                    className="Search-input"
                    type="text"
                    placeholder="Search"
                    onChange={this.handleChange}
                />

                {loading &&
                    <div className="Search-loading">
                        <Loading
                            width='12px'
                            height='12px'
                        />
                    </div>}

                {this.renderSearchResults()}
            </div>
        );
    }
}

export default Search;