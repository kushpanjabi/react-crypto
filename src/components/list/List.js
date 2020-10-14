import React from 'react';
import { handleResponse } from '../../helper';
import { API_URL } from '../../config';
import Loading from '../common/Loading';
import Table from './Table';
import Pagination from './Pagination';

class List extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: true,
            currencies: [],
            error: null,
            totalPages: 0,
            page: 1
        };

        this.handlePaginationClick = this.handlePaginationClick.bind(this);
    }

    componentDidMount() {
        this.fetchCurrencies();
    }

    fetchCurrencies() {
        this.setState({ loading: true });

        const { page } = this.state;

        fetch(`${API_URL}/cryptocurrencies?page=${page}&perPage=20`)
            .then(handleResponse)
            .then((data) => {
                this.setState({
                    currencies: data.currencies,
                    totalPages: data.totalPages,
                    loading: false
                });
            })
            .catch((error) => {
                this.setState({
                    error: error.errorMessage,
                    loading: false
                });
            });
    }

    renderPercentChange(percent) {
        if (percent > 0) {
            return <span className="percent-raised">{percent}% &uarr;</span>
        } else if (percent < 0) {
            return <span className="percent-fallen">{percent}% &darr;</span>
        } else {
            return <span>{percent}%</span>
        }
    }

    handlePaginationClick(direction) {
        let nextPage = this.state.page;

        // Increment next page if direction is next, otherwise decrement.
        if (direction === 'next') {
            nextPage++
        } else {
            nextPage--;
        }

        this.setState({ page: nextPage }, () => {
            // call fetchCurrencies function inside setState's callback to call again when page is updated
            this.fetchCurrencies();
        });
    }


    render() {

        const { loading, currencies, error, page, totalPages } = this.state;

        // renders only the loading component when loading is set to true
        if (loading) {
            return <div className="loading-container"><Loading /></div>
        }
        // renders only the error message if error occurs while fetching data
        if (error) {
            return <div className="error">{error}</div>
        }
        return (
            <div>
                <Table
                    currencies={currencies}
                    renderPercentChange={this.renderPercentChange}
                />
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    handlePaginationClick={this.handlePaginationClick}
                />
            </div>
        );
    }
}

export default List;