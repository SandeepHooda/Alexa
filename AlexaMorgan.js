'use strict';

/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function spellDigitOutput(title, output, repromptText, shouldEndSession, number) {
	return {
        outputSpeech: {
            type: 'Number',
            text: number,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${number}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'Number',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}


function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
	const repromptText = 'Please tell me your ssn by saying, ' +  'my ssn is';
    const speechOutput = 'Welcome to Morgan stanley. ' + repromptText
	//const repromptText =  'my ssn is';
    //const speechOutput =  repromptText;
        
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for contacting morgan stanley. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function createSSNAttributes(ssn) {
    return {
        ssn,
    };
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function setSSNInSession(intent, session, callback) {
    const cardTitle = intent.name;
    const myssn = intent.slots.ssn;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';
	if (session.attributes && session.attributes.pin ) {
		sessionAttributes.pin = session.attributes.pin;
    }
	let myssnVal;
	if (myssn){
		myssnVal = myssn.value.trim();
	}

    if (myssnVal && myssnVal.length == 3) {
        
		sessionAttributes.ssn = myssnVal;
        if(sessionAttributes.pin){
			speechOutput = 'I know you. You can ask me what is my name ?';
			repromptText = "do you know me";
		}else {
			speechOutput = 'I got your SSN. Please tell me your 4 digit pin by saying my pin is ?';
        repromptText = "my VRU pin is ";
		}
        sessionAttributes = {"ssn": myssnVal};

        
		callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    } else {
        speechOutput = "I'm not sure what your ssn. Please try again.";
        repromptText = "I'm not sure what your ssn is. You can tell me your ssn by saying, my ssn is";
			callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

    
}


function setPINInSession(intent, session, callback) {
    const cardTitle = intent.name;
    const myPin = intent.slots.pin;
	
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';
	let ssn = undefined;
	if (session.attributes && session.attributes.ssn ) {
		sessionAttributes.ssn = session.attributes.ssn;
    }

	let mypinVal
	if (myPin){
		mypinVal = myPin.value.trim();
	}	
    if (mypinVal && mypinVal.length == 4) {
        
        sessionAttributes.pin = mypinVal;
        if(sessionAttributes.ssn){
			speechOutput = 'I know you. You can ask me what is my name ?';
			repromptText = "do you know me";
		}else {
			speechOutput = 'I got your pin. Please tell me your ssn by saying my ssn is ?';
			repromptText = "my ssn is ";
		}
        
		callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    } else {
        speechOutput = "I'm not sure what your pin is. Please try again.";
        repromptText = "I'm not sure what your pin. You can tell me your pin by saying, my pin is";
			callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }

    
}

function whoAmI(intent, session, callback) {
    let ssnVal;
	let pinVal;
    const repromptText = null;
    const sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = '';

    if (session.attributes && session.attributes.ssn) {
        ssnVal = session.attributes.ssn;
    }
	if (session.attributes && session.attributes.pin) {
        pinVal = session.attributes.pin;
    }

    if (ssnVal && pinVal) {
		let name ;
		
		if (ssnVal == '123' && pinVal == '1234') {
			speechOutput = " Welcome Sandeep, It was nice talking to you.";
		}
		if (ssnVal == '456' && pinVal == '1234') {
			speechOutput = " Welcome John, I wish to put alexa integration into production. ";
		}
		if (ssnVal == '789' && pinVal == '1234') {
			speechOutput = " Welcome Bhavin, I hope you enjoyed your recent chandigarh trip.";
		}
        
        shouldEndSession = true;
    } else if(!ssnVal) {
        speechOutput = "Before we proceed further I want to know your ssn, you can say, my ssn is " ;
    } else {
		speechOutput = "Before we proceed further I want to know your pin, my pin is " ;
	}

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}
function noIntent(intent, session, callback) {
	let speechOutput = 'Morgan Stanley could not hear you properly. Please say that again.';
	const repromptText = null;
	let shouldEndSession = false;
	let sessionAttributes = {};
	if (session.attributes && session.attributes.ssn ) {
       sessionAttributes = {"ssn": session.attributes.ssn};
    }
	if (session.attributes && session.attributes.pin ) {
       sessionAttributes.pin =  session.attributes.pin;
    }

	
	callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}


// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'setSSN') {
        setSSNInSession(intent, session, callback);
    } else if (intentName === 'setPin'){
		setPINInSession(intent, session, callback);
	}else if (intentName === 'whoAmI'){
		whoAmI(intent, session, callback);
	}else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        noIntent(intent, session, callback);
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
