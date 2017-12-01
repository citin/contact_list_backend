import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { getIdToken, csrf } from './utils/AuthService';
import { getIt, postIt, deleteIt, patchIt } from './utils/ApiConnector';
import { Redirect, withRouter } from 'react-router-dom'


class CampaignEditInput extends Component {
    constructor(props)
    {
        super(props)
        // todo: get and map campaign
        this.state = {campaignTitle: 'Loading..', campaignBody: 'Loading..'};
    }

    getCampaign(campaignId)
    {
        getIt('api/campaigns/' + campaignId + '/')
            .then((campaign) => {
                this.setState({campaignTitle: campaign.data.title, campaignBody: campaign.data.body} )
            })
    }

    componentWillMount() {
      this.getCampaign(this.props.campaignId)
    }

    editCampaign(title, body)
    {
        var formData  = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        formData.append('csrftoken', csrf());

        patchIt('api/campaigns/' + this.props.campaignId + '/', formData, 'multipart/form-data')
            
    }

    handleSubmit(event)
    {
        event.preventDefault();

        // Campaign validations
        if (Boolean(this.state.campaignTitle) === true)
        {
            this.editCampaign(this.state.campaignTitle, this.state.campaignBody);
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
          <div className="panel-heading">Editar Campaigno</div>
          <div className="panel-body">
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="form-group">
                    <label>Title: </label>
                    <input type='text'
                        className={this.inputClass()}
                        name='campaignTitle'
                        value={this.state.campaignTitle}
                        onChange={this.updateState.bind(this)}/>

                    <label>Body: </label>
                    <input type='text'
                        className={this.inputClass()}
                        name='campaignBody'
                        value={this.state.campaignBody}
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
