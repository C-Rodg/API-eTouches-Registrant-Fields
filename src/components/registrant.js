import React from 'react';

function generateStandardQuestionList(questionObj) {
    let questionArr = [];

    for (let prop in questionObj) {
        if(questionObj.hasOwnProperty(prop)) {
            if(prop === 'category' || prop === 'subcategory') {
                questionArr.push(<p><strong>{prop}:</strong> {questionObj[prop]['name']}</p>);
            } else if (prop !== 'responses') {
                questionArr.push(<p><strong>{prop}:</strong> {questionObj[prop]}</p>);
            }
        }
    }
    return questionArr;
}

function generateCustomQuestionList(questionObj) {
    let customArr = [];
    if(questionObj.hasOwnProperty('responses')){
        let responses = questionObj['responses'];
        for (let prop in responses) {
            if(responses.hasOwnProperty(prop)){
                customArr.push(<p><strong>{responses[prop]['fieldname']}: </strong>{responses[prop]['response']}</p>);
            }
        }
    }
    return customArr;
}

const Registrant = (props) => {
    return (
        <div className="card registrant">
            <header className="card-header">
                <p className="card-header-title">
                   Attendee: { props.registrant.attendeeid }
                   <a className="delete close-registrant" onClick={props.closeRegistrant}></a>
                </p>
            </header>
            <div className="card-content">
                <div className="columns">
                    <div className="column is-half ">
                         <h2 className="title field-header">Standard Fields</h2>
                         {generateStandardQuestionList(props.registrant)}
                    </div>
                    <div className="column is-half">
                         <h2 className="title field-header">Custom Fields</h2>
                         {generateCustomQuestionList(props.registrant)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registrant;