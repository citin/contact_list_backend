import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { getIdToken, csrf } from './utils/AuthService';
import { getIt, postIt, deleteIt } from './utils/ApiConnector';
import { Redirect, withRouter } from 'react-router-dom'
import RichTextEditor from 'react-rte';
import TagSearch from './TagSearch';

class MyStatefulEditor extends Component {

    static propTypes = {
        onChange: PropTypes.func
    };

    state = {
        value: RichTextEditor.createValueFromString(this.props.value || '', 'html')
    }


    onChange = (value) => {
        this.setState({value});
        if (this.props.onChange) {
            this.props.onChange(
                value.toString('html')
            );
        }
    };

    render () {
        return (
            <RichTextEditor
                value={this.state.value}
                onChange={this.onChange}
            />
        );
    }
}

class CampaignItem extends Component
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
        this.props.history.push('campaigns/' + this.props.campaignData.id + '/edit/')
    }

    handleShowClick()
    {
        this.props.history.push('campaigns/' + this.props.campaignData.id + '/')
    }

    handleDeleteClick()
    {
        if (confirm('Seguro que desea borrar esta campana?'))
        {
            this.props.deleteCampaign(this.props.campaignData.id);
        }
    }

    handleSendClick()
    {
        var fd = new FormData();
        fd.append('csrfmiddlewaretoken', csrf());

        postIt(`campaigns/${this.props.campaignData.id}/send/`, fd)
            .then(data => console.log(data))
            .catch(data => console.log(data));
    }

    render()
    {
        return (
            <li className="list-group-item">
                {this.props.campaignData.title}
                <div className='pull-right'>
                    <button className="btn btn-xs btn-warning"
                        data-toggle="tooltip"
                        title="ver detalles"
                        onClick={this.handleShowClick.bind(this)}>
                        <span className="glyphicon glyphicon-eye-open"></span>
                    </button>
                    <button className="btn btn-xs btn-primary"
                        data-toggle="tooltip"
                        title="editar campaña"
                        onClick={this.handleEditClick.bind(this)}>
                        <span className="glyphicon glyphicon-edit"></span>
                    </button>
                    <button className="btn btn-xs btn-danger"
                        data-toggle="tooltip"
                        title="eliminar campaña"
                        onClick={this.handleDeleteClick.bind(this)}>
                        <span className="glyphicon glyphicon-remove"></span>
                    </button>
                    <button className="btn btn-xs btn-success"
                        data-toggle="tooltip"
                        title="Enviar campaña"
                        onClick={this.handleSendClick.bind(this)}>
                        <span className="glyphicon glyphicon-send"></span>
                    </button>

                </div>
            </li>
        )
    }
}

const CampaignItemWithRouter = withRouter(CampaignItem)

class CampaignInput extends Component {
    constructor(props)
    {
        super(props)
        this.state = {
            campaignTitle: '',
            campaignEmail: '',
            campaignSubject: '',
            campaignBody: '',
            query: '',
            campaignEmails: ''
        };
    }

    validate()
    {
      return {
        campaignTitle: (Boolean(this.state.campaignTitle) === false),
        campaignBody: (Boolean(this.state.campaignBody) === false),
        campaignEmail: (Boolean(this.state.campaignEmail) === false), 
        campaignEmails: (Boolean(this.state.campaignEmails) === false), 
        campaignSubject: (Boolean(this.state.campaignSubject) === false),
      }
    }

    handleSubmit(event)
    {
        event.preventDefault();

        // Campaign validations
        const errors = this.validate();
        const isEnabled = !Object.keys(errors).some(x => errors[x]);

        if (isEnabled)
        {
            this.props.addCampaign(
                this.state.campaignTitle,
                this.state.campaignBody,
                this.state.campaignEmails,
                this.state.campaignEmail,
                this.state.campaignSubject,
            );
            this.setState({
                campaignName: '',
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

    updateBodyState(e)
    {
        this.setState({campaignBody: e});
    }

    updateEmails(e)
    {
        this.setState({campaignEmails: e});
    }

    inputClass()
    {
        return 'form-control ';
    }

    componentDidMount()
    {
        this.titleInput.focus();
    }

    render()
    {
        const errors = this.validate();

        return (
            <div className="panel panel-default">
                <div className="panel-heading">Nueva Campaña</div>
                <div className="panel-body">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className={"form-group " + (errors.campaignTitle ? "has-error" : "")}>
                            <label>Título: </label>
                            <input type='text'
                                className={this.inputClass()}
                                ref={(input) => { this.titleInput = input; }}
                                name='campaignTitle'
                                value={this.state.campaignTitle}
                                onChange={this.updateState.bind(this)}/>
                        </div>

                        <div className={"form-group " + (errors.campaignEmail ? "has-error" : "")}>
                            <label>Email emisor: </label>
                            <input type='email'
                                className={this.inputClass()}
                                name='campaignEmail'
                                value={this.state.campaignEmail}
                                onChange={this.updateState.bind(this)}/>
                        </div>

                        <div className={"form-group " + (errors.campaignSubject ? "has-error" : "")}>
                            <label>Asunto: </label>
                            <input type='text'
                                className={this.inputClass()}
                                name='campaignSubject'
                                value={this.state.campaignSubject}
                                onChange={this.updateState.bind(this)}/>
                        </div>

                        <div className={"form-group " + (errors.campaignBody ? "has-error" : "")}>
                            <label>Mensaje: </label>
                            <MyStatefulEditor
                                className={this.inputClass()}
                                name='campaignBody'
                                onChange={this.updateBodyState.bind(this)}/>
                        </div>

                        <div className={"form-group " + (errors.campaignEmails ? "has-error" : "")}>
                            <label>Receptores: </label>
                            <TagSearch onChange={this.updateEmails.bind(this) } />
                        </div>

                        <div className="form-group">
                            <input className="btn btn-success" type="submit" value="Agregar"/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

class Campaigns extends Component {

    constructor(props)
    {
        super(props)
        this.state = {campaignsData: [] }
    }

    all()
    {
        getIt('api/campaigns/')
            .then((campaigns) => {
                this.setState({ campaignsData: campaigns.data })
            })
    }

    componentDidMount()
    {
        this.all()
        $('[data-toggle="tooltip"]').tooltip()
    }

    componentDidUpdate()
    {
        $('[data-toggle="tooltip"]').tooltip()
    }

    deleteCampaign(campaignPk)
    {
        deleteIt(`api/campaigns/${campaignPk}/`)
            .then(() => {
                let filtered = this.state.campaignsData.filter(
                    campaign => campaign.id !== campaignPk
                );
                this.setState({campaignsData: filtered})
            })
    }

    addCampaign(title, body, emails, email, subject)
    {
        var formData = new FormData(),
            newmails = emails.map(e => e.email).join(',');

        formData.append('title', title);
        formData.append('email', email);
        formData.append('body', body);
        formData.append('subject', subject);
        formData.append('emails', newmails);
        formData.append('csrfmiddlewaretoken', csrf());

        postIt('api/campaigns/', formData, 'multipart/form-data')
            .then(() => this.all())
    }

    count()
    {
        return this.state.campaignsData.length;
    }

    defaultId()
    {
        return Number(Math.random().toString().slice(13));
    }

    maxId()
    {
        return this.state.campaignsData.reduce(
            (prev, current) => prev.id > current.id ? prev : current,
            {}
        ).id || this.defaultId()
    }

    render()
    {
        const items = (this.state.campaignsData || []).map(
            (campaignData) => {
                return <CampaignItemWithRouter key={campaignData.id.toString()}
                    campaignData={campaignData}
                    deleteCampaign={this.deleteCampaign.bind(this)}/>
            }
        );
        return (
            <div className='container'>
                <div className='row'>
                    <div className="col-md-12">
                        <CampaignInput addCampaign={this.addCampaign.bind(this)}/>
                    </div>
                    <div className="col-md-12">
                        <ul className="list-group">
                            <div className="panel panel-default">
                                <div className="panel-heading">Campañas</div>
                                <div className="panel-body">
                                    {items}
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Campaigns;
export {
    Campaigns,
    CampaignInput,
    MyStatefulEditor
};
