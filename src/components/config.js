import React from 'react';

import getQueryVariable from '../utilities/queryString';

export default class Config extends React.Component {

    constructor(props) {
        super(props);

        this.handleGetQuestionList = this.handleGetQuestionList.bind(this);
        this.handleGetSingleAttendee = this.handleGetSingleAttendee.bind(this);
        this.handleConfigChange = this.handleConfigChange.bind(this);

        this.state = {
            apiKey : "",
            accountId : "",
            eventId : "",
            attendeeId : "",
            errorText : ""
        };
    }

    componentWillMount() {
        let apiKey = getQueryVariable('key');
        let accountId = getQueryVariable('account');
        let eventId = getQueryVariable('event');
        let attendeeId = getQueryVariable('attendee');
        
        this.setState({
            apiKey, accountId, eventId, attendeeId
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.apiError !== this.state.errorText) {
            this.setState({
                errorText : nextProps.apiError
            });
        }
    }

    handleGetQuestionList(){
        let err = this.checkForErrors(false);
        if(err) {
            this.setState({
                errorText : err
            });
            return false;
        }
        
        this.props.getQuestionList(this.state);
        this.setState({
            errorText : ""
        });
    }

    handleGetSingleAttendee(){
        let err = this.checkForErrors(true);
        if(err) {
            this.setState({
                errorText : err
            });
            return false;
        }
        this.props.getSingleAttendee(this.state);
        this.setState({
            errorText : ""
        });
    }

    handleConfigChange(event) {
        let obj = {};
        obj[event.target.id] = event.target.value;
        this.setState(obj);
    }

    checkForErrors(includeAttendee) {
        let error = "";
        if(!this.state.apiKey) return "API Key is required.";
        if(!this.state.accountId) return "Account ID is required.";
        if(!this.state.eventId) return "Event ID is required.";
        if(includeAttendee && !this.state.attendeeId) return "Attendee ID is required.";
        return error;
    }

    render() {
        return (            
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">
                        Configuration <span className="help is-danger error-alert-text">{this.state.errorText}</span>
                    </p>
                </header>
                <div className="card-content">
                    <div className="content">
                        <div className="config-item">
                            <label className="label">API Key</label>
                            <p className="control">
                                <input className="input" id="apiKey" type="text" value={this.state.apiKey} onChange={this.handleConfigChange}/>
                            </p>
                        </div>
                        <div className="config-item">
                            <label className="label">Account ID</label>
                            <p className="control">
                                <input className="input" id="accountId" type="text" value={this.state.accountId} onChange={this.handleConfigChange} />
                            </p>
                        </div>
                        <div className="config-item">
                            <label className="label">Event ID</label>
                            <p className="control">
                                <input className="input" id="eventId" type="text" value={this.state.eventId} onChange={this.handleConfigChange} />
                            </p>
                        </div>
                        <div className="config-item">
                            <label className="label">Attendee ID</label>
                            <p className="control">
                                <input className="input" id="attendeeId" type="text" value={this.state.attendeeId} onChange={this.handleConfigChange}/>
                                <span className="help is-primary">Only required for 'View Attendee'</span>
                            </p>
                        </div>
                    </div>
                </div>
                <footer className="card-footer">
                    <a className="card-footer-item" onClick={this.handleGetQuestionList}>Get Question List</a>
                    <a className="card-footer-item" onClick={this.handleGetSingleAttendee}>View Attendee</a>
                </footer>
            </div>
        );
    }
}