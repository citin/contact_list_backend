import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { getIdToken, csrf } from './utils/AuthService';
import { getIt, postIt, deleteIt } from './utils/ApiConnector';
import { Redirect, withRouter } from 'react-router-dom'

class ContactItem extends Component
{

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }

    constructor(props)
    {
        super(props)
    }

    handleEditClick()
    {
      this.props.history.push('contacts/' + this.props.contactData.id + '/edit/')
      // this.props.history.push('/campaigns')
    }

    handleDeleteClick()
    {
        this.props.deleteContact(this.props.contactData.id);
    }

    render()
    {
        return (
            <li className="list-group-item">
                {this.props.contactData.name}
		<div className='pull-right'>
                <button className="btn btn-sm btn-primary"
                    onClick={this.handleEditClick.bind(this)}>
                    <span className="glyphicon glyphicon-edit"></span>
                </button>
                <button className="btn btn-sm btn-danger"
                    onClick={this.handleDeleteClick.bind(this)}>
                    <span className="glyphicon glyphicon-remove"></span>
                </button>
		</div>
            </li>
        )
    }
}

const ContactItemWithRouter = withRouter(ContactItem)

class ContactInput extends Component {
    constructor(props)
    {
        super(props)
        this.state = {contactName: '', contactEmail: '', contactPhoneNumber: '', contactTags: ''};
    }

    handleSubmit(event)
    {
        event.preventDefault();

        // Contact validations
        if (Boolean(this.state.contactName) === true)
        {
            this.props.addContact(this.state.contactName, this.state.contactEmail, this.state.contactPhoneNumber, this.state.contactTags);
            this.setState({
                contactName: '',
                hasErrors: false,
            });
        } else {
            this.setState({hasErrors: true});
        }
    }

    updateState(e)
    {
        // this.setState({
        //     contactName: event.target.value,
        //     hasErrors: !Boolean(this.state.contactName),
        // });
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
          <div className="panel-heading">Nuevo Contacto</div>
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
                    <input className="btn btn-success" type="submit" value="Add"/>
                </div>
            </form>
          </div>
          </div>
        )
    }
}

class Contacts extends Component {

    constructor(props)
    {
        super(props)
        this.state = {contactsData: [] }
    }

    all()
    {
        getIt('api/contacts/')
            .then((contacts) => {
                this.setState({ contactsData: contacts.data })
            })
    }

    componentDidMount() {
        this.all()
    }

    deleteContact(contactPk)
    {
        deleteIt(`api/contacts/${contactPk}/`)
            .then(() => {
                let filtered = this.state.contactsData.filter(
                    contact => contact.id !== contactPk
                );
                this.setState({contactsData: filtered})
            })
    }

    addContact(name, email, phone, tags)
    {
        var formData  = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('tags', JSON.stringify( tags.split(', '))) //'["apple", "banana", "orange"]');
        formData.append('csrftoken', csrf());

        postIt('api/contacts/', formData, 'multipart/form-data')
            .then(() => this.all())
    }

    count()
    {
        return this.state.contactsData.length;
    }

    defaultId()
    {
        return Number(Math.random().toString().slice(13));
    }

    maxId()
    {
        return this.state.contactsData.reduce(
            (prev, current) => prev.id > current.id ? prev : current,
            {}
        ).id || this.defaultId()
    }

    render()
    {
        const items = (this.state.contactsData || []).map(
            (contactData) => {
                return <ContactItemWithRouter key={contactData.id.toString()}
                    contactData={contactData}
                    deleteContact={this.deleteContact.bind(this)}/>
            }
        );
        return (
            <div className='container'>
		<div className='row'>
                <div className="col-md-6">
                    <ul className="list-group">
                      <div className="panel panel-default">
                      <div className="panel-heading">List</div>
                      <div className="panel-body">
                        {items}
                      </div>
                      </div>
                    </ul>
                </div>
                <div className="col-md-6">
                    <ContactInput addContact={this.addContact.bind(this)}/>
                </div>
                </div>
            </div>
        );
    }
}

export default Contacts;
export {
    Contacts,
    ContactInput
};
