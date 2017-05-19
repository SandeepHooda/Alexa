var https = require('https');

exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION");
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`);
        context.succeed(
          generateResponse(
            buildSpeechletResponse("Welcome to smart home. Please say commands like turn off light. ", false),
            {}
          )
        );
        break;

      case "IntentRequest":
	   
        // Intent Request
        console.log("INTENT REQUEST "+event.request.intent.name);
		
        switch(event.request.intent.name) {
        case "toggle":
		const intent = event.request.intent;
		const appliance = intent.slots.appliance;
		const action = intent.slots.action;
		let applianceName = null;
		let applianceAction = null;
		let applianceActionOrignal = null;
		let understood = false;
		if(appliance){
			applianceName = appliance.value.trim();
			if(action){
				
				applianceAction = action.value.trim();
				applianceActionOrignal = applianceAction;
				applianceAction = applianceAction.replace("turn", "");
				applianceAction = applianceAction.replace("switch", "");
				applianceAction = applianceAction.trim();
				 console.log("applianceAction :" +applianceAction +":");
				 console.log("applianceName :" +applianceName +":");
				if (applianceAction == "on" || applianceAction == "off"){
				    if (applianceName == "light" || applianceName == "CFL" || applianceName == "bulb" || applianceName == "lamp"  ){
				        applianceName = "light" ;
				    }
					if(applianceName == "light" || applianceName == "fan" ){
						understood = true;
					}
				}
				console.log("understood :" +understood);
				
			}
		}
		
		let accessToken = event.session.user.accessToken;
		
		
		if (accessToken && accessToken != "null"){
		 
				if (understood){
					//var endpoint = "https://sandeephoodaiot.appspot.com/SetAppliance?collection=bedRoom&"+applianceName+"="+applianceAction; // ENDPOINT GOES HERE
					var endpoint = "https://sandeephoodaiot.appspot.com/SetAppliance?collection=bedRoom&access_token="+accessToken+"&"+applianceName+"="+applianceAction; // ENDPOINT GOES HERE
						var body = "";
						https.get(endpoint, (response) => {
						  response.on('data', (chunk) => { body += chunk });
						  response.on('end', () => {
							
							let response = JSON.parse(body);
							
							context.succeed(
							  generateResponse(
								buildSpeechletResponse(response.userName+" I am glad I could help you to turn "+applianceAction+ " your "+applianceName, true),
								{}
							  )
							);
						  });
						});
					
				}else {
					context.succeed(
							  generateResponse(
								buildSpeechletResponse(" I am sorry I didn't get that "+applianceActionOrignal +", "+applianceName+". You can say things like switch off lamp", false),
								{}
							  )
							);
				
				}
					
				
		}else { //Account is not linked, accessToken is null
			context.succeed(
							  generateResponse(
								buildSpeechletResponseWithCard( true),
								{}
							  )
							);
			
		}
		 
		
		
		
          
            
            break;

          

        case "AMAZON.HelpIntent" :
        context.succeed(
          generateResponse(
            buildSpeechletResponse("You can say things like switch on bulb", false),
            {}
          )
        ); 	
		break; 
      case "AMAZON.StopIntent" :
	  case "AMAZON.CancelIntent" :
        context.succeed(
          generateResponse(
            buildSpeechletResponse("Ok good bye.", true),
            {}
          )
        ); 	
		break; 		

          default:
              context.succeed(
          generateResponse(
            buildSpeechletResponse("I am sorry I didn't get that. You can say things like switch off fan.", false),
            {}
          ));
        }

        break;

      case "SessionEndedRequest":
        // Session Ended Request
        console.log(`SESSION ENDED REQUEST`);
        break;
	
      default:
        context.fail(`INVALID REQUEST TYPE: ${event.request.type}`);

    }

  } catch(error) { context.fail(`Exception: ${error}`); }

};

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  };

};
buildSpeechletResponseWithCard = ( shouldEndSession) => {



  return {
        outputSpeech: {
            type: 'PlainText',
            text: 'Please go to your Alexa app and link your account.',
        },
        card: {
            type: 'LinkAccount'
            
        },
        shouldEndSession:shouldEndSession
    };

};

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  };

};