import React, {Component} from 'react';

// todo: reemplazar por repo remoto
var campaignosData = [
    {id: 1, name: 'No salve a las ballenas, o acaso a usted alguna vez lo salvo una?'},
    {id: 2, name: 'Grin Pis'},
];

class CampaignItem extends Component {
    handleClick()
    {
        this.props.deleteCampaign(this.props.campaignData.id);
    }

    render()
    {
        return (
            <li className="list-group-item">
                {this.props.campaignData.name}
                <button className="btn btn-outline-danger float-right"
                        onClick={this.handleClick.bind(this)}>
                    X
                </button>
            </li>
        )
    }
}

class CampaignInput extends Component {
    constructor(props)
    {
        super(props)
        this.state = {campaignName: ''};
    }

    handleSubmit(event)
    {
        event.preventDefault();

        if (Boolean(this.state.campaignName) === true)
        {
            this.props.addCampaign(this.state.campaignName);
            this.setState({
                campaignName: '',
                hasErrors: false,
            });
        } else {
            this.setState({hasErrors: true});
        }
    }

    updateState(event)
    {
        this.setState({
            campaignName: event.target.value,
            hasErrors: !Boolean(this.state.campaignName),
        });
    }

    inputClass()
    {
        return 'form-control ' + (this.state.hasErrors ? 'is-invalid' : '');
    }

    render()
    {
        return (
            <form className="campaign-input-wrapper form-group"
                  onSubmit={this.handleSubmit.bind(this)}>

                  <input type='text'
                         className={this.inputClass()}
                         name='campaignName'
                         value={this.state.campaignName}
                         onChange={this.updateState.bind(this)}/>

                <button className="btn btn-outline-success" type="submit">
                    Add
                </button>
            </form>
        )
    }
}

class Campaigns extends Component {
    constructor(props)
    {
        super(props)
        this.state = {campaignsData: campaignosData}
    }

    deleteCampaign(campaignPk)
    {
        let filtered = this.state.campaignsData.filter(
            campaign => campaign.id !== campaignPk
        );
        this.setState({campaignsData: filtered})
    }

    addCampaign(name)
    {
        this.state.campaignsData.push({id: this.maxId() + 1, name: name});
        this.setState({campaignsData: this.state.campaignsData})
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
                return <CampaignItem key={campaignData.id.toString()}
                                    campaignData={campaignData}
                                    deleteCampaign={this.deleteCampaign.bind(this)}/>

            }
        );
        return (
            <div className="App">
                <div className="jumbotron">
                    <h1>Campaign List</h1>
                </div>
                <ul className="list-group d-inline-flex p-4">
                    {items}
                </ul>
                <CampaignInput addCampaign={this.addCampaign.bind(this)}/>
            </div>
        );
    }
}

export default Campaigns;
export {
    Campaigns
};
