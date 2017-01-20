import React from 'react';
import axios from 'axios';

import Config from './config';
import Registrant from './registrant';
import CsvWriter from '../utilities/csvWriter';
import standardQuestions from '../utilities/standardQuestions';

const BASE_URL = 'https://www.eiseverywhere.com/api/v2/';

export default class Container extends React.Component {
    constructor(props) {
        super(props);

        this.getQuestionList = this.getQuestionList.bind(this);
        this.getSingleAttendee = this.getSingleAttendee.bind(this);
        this.closeRegistrant = this.closeRegistrant.bind(this);

        this.state = {
            errorText  : "",
            registrant : {}
        };
    }

    getSingleAttendee(settings) {
        console.log(settings);
        this.getAccessToken(settings.accountId, settings.apiKey)
            .then((response) => {
                if(response.data.hasOwnProperty('error')) {
                    throw new Error(response.data.error.credentials);
                }
                return response.data.accesstoken;
            })
            .then((token) => {
                return this.getAttendeeCall(token, settings.eventId, settings.attendeeId);
            })
            .then((response) => {
                console.log(response);
                if(response.data.hasOwnProperty('error')) {
                    throw new Error(response.data.error.attendeeid || response.data.error.eventid);
                }
                return response.data;
            })
            .then((reg) => {
                this.setState({
                    registrant: reg,
                    errorText : ""
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({errorText: err.message});
            });
    }

    getAttendeeCall(token, eventId, attendeeId) {
        return axios.get(`${BASE_URL}ereg/getAttendee.json?accesstoken=${token}&eventid=${eventId}&attendeeid=${attendeeId}`);
    }

    getQuestionList(settings) {
        this.getAccessToken(settings.accountId, settings.apiKey)
            .then((response) => {
                if(response.data.hasOwnProperty('error')) {
                    throw new Error(response.data.error.credentials);
                } 
                return response.data.accesstoken;
            })
            .then((token) => {
                return this.listQuestionsCall(token, settings.eventId);
            })
            .then((questions) => {
                if((questions.data.hasOwnProperty('error'))) {
                    throw new Error(questions.data.error.eventid);
                }
                return this.createQuestionArrays(questions.data);
            })
            .then((questionArrays) => {
                return this.downloadCSVdata(questionArrays);
            })
            .catch((err) => {
                console.log(err);
                this.setState({errorText: err.message});
            });
    }

    downloadCSVdata(arr) {
        let csv = new CsvWriter();
        csv.downloadCSV(arr);
    }

    createQuestionArrays(questions) {
        let questionList = questions.map((row) => {
            return [row.fieldname, row.name, row.page];
        });
        questionList.push(["", "", ""], ["","",""], ["STANDARD FIELDS", "", ""]);
        standardQuestions.forEach((q) => {
            questionList.push([q, "", ""]);
        });
        return questionList;
    }    

    getAccessToken(account, key) {
        return axios.get(`${BASE_URL}global/authorize.json?accountid=${account}&key=${key}`);
    }

    listQuestionsCall(token, event) {
        console.log(token, event);
        return axios.get(`${BASE_URL}ereg/listQuestions.json?accesstoken=${token}&eventid=${event}`)
    }

    closeRegistrant() {
        this.setState({
            registrant : {},
            errorText : ""
        });
    }

    render() {
        return (
            <section className="section content-body">
                <div className="container">
                    <div className="columns">
                        <div className={"column is-5 " + ((Object.keys(this.state.registrant).length > 0) ? "" : "is-offset-3")}>
                            <Config getQuestionList={this.getQuestionList} getSingleAttendee={this.getSingleAttendee} apiError={this.state.errorText} />                    
                        </div>
                        { ( Object.keys(this.state.registrant).length > 0) ? 
                            <div className="column is-quarter">
                                <Registrant registrant={this.state.registrant} closeRegistrant={this.closeRegistrant} />
                            </div> :
                            ""
                        }                        
                    </div>
                </div>
            </section>
        );
    }    
}