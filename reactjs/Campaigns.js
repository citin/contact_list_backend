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
        value: RichTextEditor.createEmptyValue()
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
                    <button className="btn btn-sm btn-primary"
                        onClick={this.handleEditClick.bind(this)}>
                        <span className="glyphicon glyphicon-edit"></span>
                    </button>
                    <button className="btn btn-sm btn-danger"
                        onClick={this.handleDeleteClick.bind(this)}>
                        <span className="glyphicon glyphicon-remove"></span>
                    </button>
                    <button className="btn btn-sm btn-success"
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
            campaignSubject: '',
            campaignBody: '',
            query: '',
            campaignEmails: ''
        };
    }

    handleSubmit(event)
    {
        event.preventDefault();

        // Campaign validations
        if (Boolean(this.state.campaignTitle) === true)
        {
            this.props.addCampaign(
                this.state.campaignTitle,
                this.state.campaignBody,
                this.state.campaignEmails
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
        return 'form-control ' + (this.state.hasErrors ? 'is-invalid' : '');
    }

    componentDidMount()
    {
        this.titleInput.focus();
    }

    render()
    {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Nueva Campaña</div>
                <div className="panel-body">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="form-group">
                            <label>Title: </label>
                            <input type='text'
                                className={this.inputClass()}
                                ref={(input) => { this.titleInput = input; }}
                                name='campaignTitle'
                                value={this.state.campaignTitle}
                                onChange={this.updateState.bind(this)}/>

                            <label>Subject: </label>
                            <input type='text'
                                className={this.inputClass()}
                                name='campaignSubject'
                                value={this.state.campaignSubject}
                                onChange={this.updateState.bind(this)}/>

                            <label>Body: </label>
                            <MyStatefulEditor
                                className={this.inputClass()}
                                name='campaignBody'
                                onChange={this.updateBodyState.bind(this)}/>
                            <TagSearch onChange={this.updateEmails.bind(this) } />
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

    componentDidMount() {
        this.all()
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

    addCampaign(title, body, emails)
    {
        var formData = new FormData(),
            newmails = emails.map(e => e.email).join(',');

        formData.append('title', title);
        formData.append('body', body);
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
                                <div className="panel-heading">List</div>
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
