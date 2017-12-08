import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { getIdToken, csrf } from './utils/AuthService';
import { getIt, postIt, deleteIt, patchIt } from './utils/ApiConnector';
import { Redirect, withRouter } from 'react-router-dom'
import { MyStatefulEditor } from './Campaigns'
import TagSearch from './TagSearch';


class CampaignEditInput extends Component {

    constructor(props)
    {
        super(props)
        this.state = {
            campaignTitle: 'Cargando...',
            campaignBody: 'Cargando..',
            isLoading: true,
        };
    }

    getCampaign(campaignId)
    {
        getIt('api/campaigns/' + campaignId + '/')
            .then((campaign) => {
                this.setState({
                    campaignTitle: campaign.data.title,
                    campaignBody: campaign.data.body,
                    campaignEmail: campaign.data.email,
                    campaignEmails: campaign.data.emails,
                    campaignSubject: campaign.data.subject,
                    isLoading: false,
                } )
            })
    }

    componentWillMount() {
        this.getCampaign(this.props.campaignId)
    }

    editCampaign(title, body, emails, email, subject)
    {
        var formData = new FormData()

        formData.append('title', title);
        formData.append('email', email);
        formData.append('emails', emails);
        formData.append('body', body);
        formData.append('subject', subject);
        formData.append('csrftoken', csrf());

        patchIt('api/campaigns/' + this.props.campaignId + '/', formData, 'multipart/form-data')

    }

    handleSubmit(event)
    {
        event.preventDefault();

        // Campaign validations
        if (Boolean(this.state.campaignTitle) === true)
        {
            this.editCampaign(
                this.state.campaignTitle,
                this.state.campaignBody,
                this.state.campaignEmails,
                this.state.campaignEmail,
                this.state.campaignSubject,
            );
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
        return 'form-control ' + (this.state.hasErrors ? 'is-invalid' : '');
    }

    render()
    {
        return (
            (this.state.isLoading)
            ? (
                <div className="alert alert-warning">
                    loading
                </div>
            )
            : (
                <div className="panel panel-default">
                    <div className="panel-heading">Editar Campaña</div>
                    <div className="panel-body">
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <div className="form-group">
                                <label>Titulo: </label>
                                <input type='text'
                                    className={this.inputClass()}
                                    name='campaignTitle'
                                    value={this.state.campaignTitle}
                                    onChange={this.updateState.bind(this)}/>

                                <label>Email emisor: </label>
                                <input type='email'
                                    className={this.inputClass()}
                                    name='campaignEmail'
                                    value={this.state.campaignEmail}
                                    onChange={this.updateState.bind(this)}/>

                                <label>Asunto: </label>
                                <input type='text'
                                    className={this.inputClass()}
                                    name='campaignSubject'
                                    value={this.state.campaignSubject}
                                    onChange={this.updateState.bind(this)}/>

                                <label>Mensaje: </label>
                                <MyStatefulEditor
                                    className={this.inputClass()}
                                    name='campaignBody'
                                    value={this.state.campaignBody}
                                    onChange={this.updateBodyState.bind(this)}/>

                                <label>Receptores: </label>
                                <TagSearch onChange={this.updateEmails.bind(this)} value={this.state.campaignEmails} />
                            </div>
                            <div className="form-group">
                                <input className="btn btn-success" type="submit" value="Edit"/>
                            </div>
                        </form>
                    </div>
                </div>
            )
        )
    }
}

class CampaignEdit extends Component {

    constructor(props)
    {
        super(props)
    }

    render()
    {
        return (
            <div className='container'>
                <div className="col-md-6">
                    <CampaignEditInput campaignId={this.props.match.params.id} />
                </div>
            </div>
        );
    }
}

export default CampaignEdit;
