import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { csrf } from './utils/AuthService';
import { getIt, postIt, deleteIt } from './utils/ApiConnector';


const TagSearch = createClass({

    displayName: 'TagSearch',

    propTypes: {
        label: PropTypes.string,
    },

    getInitialState () {
        return {
            backspaceRemoves: true,
            multi: true,
            value: '',
            creatable: false,
        };
    },

    onChange (value) {
        this.setState({ value: value });
        this.props.onChange(value)
    },

    filterOptions (options, filter, currentValues)
    {
        return options // custom filter in backend
    },

    getUsers (input) {

        if (input.length < 3)
        {
            return Promise.resolve({ options: [] });
        }

        var fd = new FormData();
        fd.append('csrfmiddlewaretoken', csrf())
        fd.append('tags', input)

        return postIt('/contacts_by_tags', fd)
            .then(data  => { return { options: data.data['contacts'] } })
            .catch(data => { return { options: [] } })

    },
    render () {
        const AsyncComponent = this.state.creatable
            ? Select.AsyncCreatable
            : Select.Async;

        return (
            <div className="section">
                <h3 className="section-heading">{this.props.label} <a href=""></a></h3>
                <AsyncComponent
                    multi={this.state.multi}
                    value={this.state.value}
                    onChange={this.onChange}
                    filterOptions={this.filterOptions}
                    valueKey="email"
                    labelKey="label" loadOptions={this.getUsers}
                />
            </div>
        );
    }
});

module.exports = TagSearch;
