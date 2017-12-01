import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { getIdToken, csrf } from './utils/AuthService';
import { getIt, postIt, deleteIt, patchIt } from './utils/ApiConnector';
import { Redirect, withRouter } from 'react-router-dom'


class ContactEditInput extends Component {
    constructor(props)
    {
        super(props)
        // todo: get and map contact
        this.state = {contactName: 'Loading..', contactEmail: 'Loading..', contactPhoneNumber: 'Loading..', contactTags: 'Loading..'};
    }

    getContact(contactId)
    {
        getIt('api/contacts/' + contactId + '/')
            .then((contact) => {
                this.setState({contactName: contact.data.name, contactEmail: contact.data.email, contactPhoneNumber: contact.data.phone, contactTags: contact.data.tags.join()} )
            })
    }

    componentWillMount() {
      this.getContact(this.props.contactId)
    }

    editContact(name, email, phone, tags)
    {
        var formData  = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('tags', JSON.stringify( tags.split(', '))) 
        formData.append('csrftoken', csrf());

        patchIt('api/contacts/' + this.props.contactId + '/', formData, 'multipart/form-data')
            
    }

    handleSubmit(event)
    {
        event.preventDefault();

        // Contact validations
        if (Boolean(this.state.contactName) === true)
        {
            this.editContact(this.state.contactName, this.state.contactEmail, this.state.contactPhoneNumber, this.state.contactTags);
            this.setState({
                hasErrors: false,
            });
        } else {
            this.setState({hasErrors: true});
        }
    }

    updateState(e)
    {
        this.setState({[e.target.name]: e.target.value});
    }

    inputClass()
    {
        return 'form-control ' + (this.state.hasErrors ? 'is-invalid' : '');
    }

    render()
    {
        return (
          <div className="panel panel-default">
          <div className="panel-heading">Editar Contacto</div>
          <div className="panel-body">
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="form-group">
                    <label>Nombre: </label>
                    <input type='text'
                        className={this.inputClass()}
                        name='contactName'
                        value={this.state.contactName}
                        onChange={this.updateState.bind(this)}/>

                    <label>Email: </label>
                    <input type='text'
                        className={this.inputClass()}
                        name='contactEmail'
                        value={this.state.contactEmail}
                        onChange={this.updateState.bind(this)}/>

                    <label>Telefono: </label>
                    <input type='text'
                        className={this.inputClass()}
                        name='contactPhoneNumber'
                        value={this.state.contactPhoneNumber}
                        onChange={this.updateState.bind(this)}/>

                    <label>Tags: </label>
                    <input type='text'
                        className={this.inputClass()}
                        name='contactTags'
                        value={this.state.contactTags}
                        onChange={this.updateState.bind(this)}/>
                </div>
                <div className="form-group">
                    <input className="btn btn-success" type="submit" value="Edit"/>
                </div>
            </form>
          </div>
          </div>
        )
    }
}

class ContactEdit extends Component {

    constructor(props)
    {
        super(props)
    }

    render()
    {
        return (
            <div className='container'>
                <div className="col-md-6">
                    <ContactEditInput contactId={this.props.match.params.id} />
                </div>
            </div>
        );
    }
}

export default ContactEdit;
