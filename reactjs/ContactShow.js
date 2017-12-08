import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { getIdToken, csrf } from './utils/AuthService';
import { getIt, postIt, deleteIt, patchIt } from './utils/ApiConnector';
import { Redirect, withRouter } from 'react-router-dom'
import { MyStatefulEditor } from './Campaigns'
import TagSearch from './TagSearch';


class ContactShowInput extends Component {
    constructor(props)
    {
        super(props)
        this.state = {contactTitle: 'Cargando...', contactBody: 'Cargando..'};
    }

    getContact(contactId)
    {
        getIt('api/contacts/' + contactId + '/')
            .then((contact) => {
                this.setState({
                  contactName: contact.data.name, 
                  contactEmail: contact.data.email,
                  contactPhone: contact.data.phone,
                  contactTags: contact.data.tags
                } )
            })
    }

    componentWillMount() {
      this.getContact(this.props.contactId)
    }

    inputClass()
    {
        return 'form-control ' + (this.state.hasErrors ? 'is-invalid' : '');
    }

    render()
    {
        return (
          <div className="panel panel-default">
          <div className="panel-heading">Mostrar Contacto</div>
          <div className="panel-body">
                <div className="form-group">
                    <label>Nombre: </label>
                    <p type='text'
                        className={this.inputClass()}
                        name='contactName'
                        >{this.state.contactName}</p>

                    <label>Email: </label>
                    <p type='email'
                        className={this.inputClass()}
                        name='contactEmail'
                        >{this.state.contactEmail}</p>

                    <label>Telefono: </label>
                    <p type='text'
                        className={this.inputClass()}
                        name='contactPhone'
                        >{this.state.contactPhone}</p>

                    <label>Tags: </label>
                    <p
                        className={this.inputClass()}
                        name='contactTags'
                        >{this.state.contactTags}</p>
                </div>
          </div>
          </div>
        )
    }
}

class ContactShow extends Component {

    constructor(props)
    {
        super(props)
    }

    render()
    {
        return (
            <div className='container'>
                <div className="col-md-6">
                    <ContactShowInput contactId={this.props.match.params.id} />
                </div>
            </div>
        );
    }
}

export default ContactShow;
