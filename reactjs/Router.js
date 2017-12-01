import React from 'react';

import {
    HashRouter as Router,
    Route,
} from 'react-router-dom'

import Callback from './Callback'
import Campaigns from './Campaigns'
import Contacts from './Contacts'
import ContactEdit from './ContactEdit'
import Layout from './Layout'
import LogIn from './LogIn'
import PrivateRoute from './utils/PrivateRoute'

const Home = () => <div> Bienvenidos </div>;

const AppRouter = () => (
    <Router>
        <div>
            <Layout/>
            <div className="row">
                <Route exact path="/" component={Home} />
                <PrivateRoute exact path="/contacts" component={Contacts} />
                <PrivateRoute exact path="/contacts/:id/edit" component={ContactEdit} />
                <Route path="/campaigns" component={Campaigns} />
                <Route path="/callback" component={Callback} />
                <Route path="/login" component={LogIn} />
            </div>
        </div>
    </Router>
)

export default AppRouter
