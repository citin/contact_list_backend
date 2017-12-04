import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';
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
		this.setState({
			value: value,
		});
              this.props.onChange(value)
	},

        filterOptions (options, filter, currentValues)
        {
            // custom filter in backend
            return options
        },
	getUsers (input) {
		if (!input) {
			return Promise.resolve({ options: [] });
		}

                return Promise.resolve( { options: [{"email": "uno@dos.com", "label": "Juan Tobillo"}, {"email": "loco@re.com", label: "Mario Bross"}] })
		// return getIt('api/contacts/search?query=' + input + '/')
		// .then((response) => {
                //         console.log(response.data)
		// 	return { options: response.data };
		// });

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
