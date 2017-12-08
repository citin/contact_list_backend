import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { getIdToken, csrf } from './utils/AuthService';
import { getIt, postIt, deleteIt, patchIt } from './utils/ApiConnector';
import { Redirect, withRouter } from 'react-router-dom'
import { MyStatefulEditor } from './Campaigns'
import TagSearch from './TagSearch';


class CampaignShowInput extends Component {
    constructor(props)
    {
        super(props)
        this.state = {campaignTitle: 'Cargando...', campaignBody: 'Cargando..'};
    }

    getCampaign(campaignId)
    {
        getIt('api/campaigns/' + campaignId + '/')
            .then((campaign) => {
                this.setState({
                  campaignTitle: campaign.data.title, 
                  campaignBody: campaign.data.body,
                  campaignEmail: campaign.data.email,
                  campaignSubject: campaign.data.subject
                } )
            })
    }

    componentWillMount() {
      this.getCampaign(this.props.campaignId)
    }

    inputClass()
    {
        return 'form-control ' + (this.state.hasErrors ? 'is-invalid' : '');
    }

    render()
    {
        return (
          <div className="panel panel-default">
          <div className="panel-heading">Mostrar Campaña</div>
          <div className="panel-body">
                <div className="form-group">
                    <label>Titulo: </label>
                    <p type='text'
                        className={this.inputClass()}
                        name='campaignTitle'
                        >{this.state.campaignTitle}</p>

                    <label>Email emisor: </label>
                    <p type='email'
                        className={this.inputClass()}
                        name='campaignEmail'
                        >{this.state.campaignEmail}</p>

                    <label>Asunto: </label>
                    <p type='text'
                        className={this.inputClass()}
                        name='campaignSubject'
                        >{this.state.campaignSubject}</p>

                    <label>Mensaje: </label>
                    <p
                        className={this.inputClass()}
                        name='campaignBody'
                        >{this.state.campaignBody}</p>
                </div>
          </div>
          </div>
        )
    }
}

class CampaignShow extends Component {

    constructor(props)
    {
        super(props)
    }

    render()
    {
        return (
            <div className='container'>
                <div className="col-md-6">
                    <CampaignShowInput campaignId={this.props.match.params.id} />
                </div>
            </div>
        );
    }
}

export default CampaignShow;
