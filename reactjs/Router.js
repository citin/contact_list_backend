import React from 'react';

import {
    HashRouter as Router,
    Route,
} from 'react-router-dom'

import Callback from './Callback'
import Campaigns from './Campaigns'
import CampaignEdit from './CampaignEdit'
import CampaignShow from './CampaignShow'
import Contacts from './Contacts'
import ContactShow from './ContactShow'
import ContactEdit from './ContactEdit'
import Layout from './Layout'
import LogIn from './LogIn'
import PrivateRoute from './utils/PrivateRoute'

const Home = () => <div className='container'> Bienvenidos </div>;

const AppRouter = () => (
    <Router>
        <div>
            <Layout/>
            <div className="container">
                <Route exact path="/" component={Home} />
                <PrivateRoute exact path="/contacts" component={Contacts} />
                <PrivateRoute exact path="/contacts/:id" component={ContactShow} />
                <PrivateRoute exact path="/contacts/:id/edit" component={ContactEdit} />
                <PrivateRoute exact path="/campaigns" component={Campaigns} />
                <PrivateRoute exact path="/campaigns/:id" component={CampaignShow} />
                <PrivateRoute exact path="/campaigns/:id/edit" component={CampaignEdit} />
                <Route path="/callback" component={Callback} />
                <Route path="/login" component={LogIn} />
            </div>
        </div>
    </Router>
)

export default AppRouter
