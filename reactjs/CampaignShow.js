import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { getIdToken, csrf } from './utils/AuthService';
import { getIt, postIt, deleteIt, patchIt } from './utils/ApiConnector';
import { Redirect, withRouter } from 'react-router-dom'
import { MyStatefulEditor } from './Campaigns'
import TagSearch from './TagSearch';
import {Doughnut} from 'react-chartjs-2';

class EmailStat extends Component{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        return (
            <li className="list-group-item">
                {this.props.contactData.contact}
		<div className='pull-right'>
                {this.props.contactData.seen ? (
                <button className="btn btn-sm btn-success">
                    {this.props.contactData.seen_times} <span className="glyphicon glyphicon-eye-open"></span>
                </button>
                ) : (
                <button className="btn btn-sm btn-danger">
                    <span className="glyphicon glyphicon-eye-open"></span>
                </button>
                )}
                {this.props.contactData.sent ? (
                <button className="btn btn-sm btn-success">
                    <span className="glyphicon glyphicon-send"></span>
                </button>
                ) : (
                <button className="btn btn-sm btn-danger">
                    <span className="glyphicon glyphicon-send"></span>
                </button>
                )}
		</div>
            </li>
            
        )
    }
}

class CampaignStats extends Component{
    constructor(props)
    {
        super(props)
        this.state = {emails: [] }
    }

    getCampaign(campaignId)
    {
        getIt('api/campaigns/' + campaignId + '/stats')
            .then((stats) => {
                this.setState({
                  timesOpened: stats.data.times_opened, 
                  succesfulSeenEmailCount: stats.data.successful_seen_email_count,
                  succesfulEmailCount: stats.data.successful_email_count,
                  unsuccesfulEmailCount: stats.data.unsuccessful_email_count, 
                  emails: stats.data.emails,
                } )
            })
    }

    componentWillMount() 
    {
      this.getCampaign(this.props.campaignId)
    }
    
    buildSuccesfulEmailData()
    {
      return  {
            labels: [
                'Enviados',
                'Error',
            ],
                datasets: [{
                    data: [this.state.succesfulEmailCount, this.state.unsuccesfulEmailCount],
                    backgroundColor: [
                        '#36A2EB',
                        '#FF6384',
                    ],
                    hoverBackgroundColor: [
                        '#36A2EB',
                        '#FF6384',
                    ]
                }]
        };
    }       

    buildSeenEmailData()
    {
      return  {
            labels: [
                'Vistos',
                'Sin Ver',
            ],
                datasets: [{
                    data: [this.state.succesfulSeenEmailCount, this.state.succesfulEmailCount - this.state.succesfulSeenEmailCount],
                    backgroundColor: [
                        '#9ACD32',
                        '#FF6384',
                    ],
                    hoverBackgroundColor: [
                        '#9ACD32',
                        '#FF6384',
                    ]
                }]
        };
    }       

    render()
    {

        const items = (this.state.emails || []).map(
            (email) => {
                return <EmailStat contactData={email}/>
            }
        );
       return (

        <div>
           <div className="panel panel-default">
               <div className="panel-heading">Estadisticas</div>
               <div className="panel-body">
                   <div className="col-md-12">
                      <div className="form-group">
                        <label>
                            Cantidad total de lecturas de los email <span className="badge"> {this.state.timesOpened}</span>
                        </label>
                      </div>
                   </div>
          
                   <div className="row">
                       <div className="col-md-6">
                           <Doughnut data={this.buildSuccesfulEmailData()} />
                       </div>
                       <div className="col-md-6">
                           <Doughnut data={this.buildSeenEmailData()} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="panel panel-default">
             <div className="panel-heading">Contactos</div>
             <div className="panel-body">
                {items}
             </div>
           </div>
        </div>
       )
    }
}

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
                <div className="col-md-12">
                    <CampaignShowInput campaignId={this.props.match.params.id} />
                </div>
                <div className="col-md-12">
                    <CampaignStats campaignId={this.props.match.params.id} />
                </div>
            </div>
        );
    }
}

export default CampaignShow;
