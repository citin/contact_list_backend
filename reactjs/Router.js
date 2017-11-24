import React from 'react';

import {
    HashRouter as Router,
    Route,
} from 'react-router-dom'

import Callback from './Callback'
import Campaigns from './Campaigns'
import Contacts from './Contacts'
import Layout from './Layout'
import LogIn from './LogIn'

const Home = () => <div> Bienvenidos </div>;

const AppRouter = () => (
    <Router>
        <div>
            <Layout/>
            <Route exact path="/" component={Home} />
            <Route path="/contacts" component={Contacts} />
            <Route path="/campaigns" component={Campaigns} />
            <Route path="/callback" component={Callback} />
        </div>
    </Router>
)

export default AppRouter
