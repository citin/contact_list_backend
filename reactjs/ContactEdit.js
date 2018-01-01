import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { getIdToken, csrf } from './utils/AuthService';
import { getIt, postIt, deleteIt, patchIt } from './utils/ApiConnector';
import { Redirect, withRouter } from 'react-router-dom'


class ContactEditInput extends Component {
    constructor(props)
    {
        super(props)
        this.state = {
          contactName: 'Loading..', 
          contactEmail: 'Loading..', 
          contactPhoneNumber: 'Loading..', 
          contactTags: 'Loading..',
        };
    }


    validate()
    {
      return {
        contactName: (Boolean(this.state.contactName) === false),
        contactEmail: (Boolean(this.state.contactEmail) === false), 
        contactTags: (Boolean(this.state.contactTags) === false),
      }
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
        const errors = this.validate(this.state.contactName, this.state.contactEmail, this.state.contactTags);
        const isEnabled = !Object.keys(errors).some(x => errors[x]);

        if (isEnabled)
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
        return 'form-control ' ;
    }

    render()
    {

      const errors = this.validate(this.state.contactName, this.state.contactEmail, this.state.contactTags);

        return (
          <div className="panel panel-default">
          <div className="panel-heading">Editar Contacto</div>
          <div className="panel-body">
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div className={"form-group " + (errors.contactName ? "has-error" : "")}>
                    <label>Nombre: </label>
                    <input type='text'
                        className={this.inputClass()}
                        name='contactName'
                        value={this.state.contactName}
                        onChange={this.updateState.bind(this)}/>
                </div>

                <div className={"form-group " + (errors.contactEmail ? "has-error" : "")}>
                    <label>Email: </label>
                    <input type='text'
                        className={this.inputClass()}
                        name='contactEmail'
                        value={this.state.contactEmail}
                        onChange={this.updateState.bind(this)}/>
                </div>

                <div className="form-group">
                    <label>Telefono: </label>
                    <input type='text'
                        className={this.inputClass()}
                        name='contactPhoneNumber'
                        value={this.state.contactPhoneNumber}
                        onChange={this.updateState.bind(this)}/>
                </div>

                <div className={"form-group " + (errors.contactTags ? "has-error" : "")}>
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
