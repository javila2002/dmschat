import DMSChatKeys from './DMSChatKeys';
import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import axios from 'axios';

const DMSChatLib = {
   doConnection : function (e) {   

      let chatClient = new ChatClient(DMSChatKeys.endpointUrl, new AzureCommunicationTokenCredential(e.userToken));
      console.log('Azure Communication Chat client created!');
      e.onConnected(chatClient)    

   },

   setNotifications: async function(e){
      await e.chatClient.startRealtimeNotifications();

      e.chatClient.on("chatMessageReceived", (ntf) => {
         console.log("Notification chatMessageReceived!");
      
         e.onNotification({
            nofication : ntf
         })

       });

      
   },

   getChannelsList: function (e){
      const ThreadList  = async (e) => {
         const threads = e.chatClient.listChatThreads();         
            for await  (const thread of threads) {            
            console.log(thread)
           }
         console.log(threads)
         e.onExecuted(threads);

         
      }
      ThreadList(e);
   },

   getAsyncChannels: async function(e){
      const threads = await e.chatClient.listChatThreads();         
      let aryChannels = DMSChatLib.toArray(threads);

      aryChannels.then((response)=>{
         e.onExecuted(response);
      })       
   },

   toArray:async function (asyncIterator){ 
      const arr=[]; 
      for await(const i of asyncIterator) arr.push(i); 
      return arr;
   },

   getChannel:function(e){
      let chatThreadClient = e.chatClient.getChatThreadClient(e.channelId);
      //console.log(`Chat Thread client for threadId:${chatThreadClient.threadId}`);
      console.log(chatThreadClient)
      e.onExecuted(chatThreadClient)
   },

   getMessages : async function (e){
       const messages = e.chatThreadClient.listMessages();
       let aryMessages = DMSChatLib.toArray(messages);
       aryMessages.then((response)=>{

         var newSorted=[];
         if (response !== undefined && response.length !== 0){
           newSorted = response.sort((a,b)=>{
           return a.createdOn - b.createdOn  
         })
        }

         e.onExecuted(newSorted);
       });
       
       
   },

   joinNewUserToChat:async function (e){ 
    
      const addParticipantsRequest = {
      participants :[{
         id : {communicationUserId : e.communicationUserId.communicationUserId},
         displayName : e.displayName
      }]
     }
     const joinedResult = await e.chatThreadClient.addParticipants(addParticipantsRequest)
     
     e.onExecuted(joinedResult);
   },



   sendMessage: async function(e){
      const sendMessageRequest =
      {
         content: e.Message
      };
      let sendMessageOptions =
      {
      senderDisplayName : e.senderDisplayName,
       type: 'text'
      // ,metadata: {
      //          'hasAttachment': 'true',
      //          'attachmentUrl': 'https://contoso.com/files/attachment.docx'
      //       }
      };
      const sendChatMessageResult = await e.chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
      
      
      e.onExecuted(sendChatMessageResult)
   },

   toMessage(e){
      
      let strType = new String(e.not.type).toLowerCase();
      
      const MsgStructure = {
         "id": e.not.id,
         "type": strType,
         "sequenceId": "",
         "version": e.not.id,
         "senderDisplayName": e.not.senderDisplayName,
         "createdOn": new Date(e.not.createdOn),
         "content": {
            "message": e.not.message
         }
        ,"sender": e.not.sender
     }

     return MsgStructure;

   },
   
   createIdentityClient : function(e){
      const identityClient = new CommunicationIdentityClient(DMSChatKeys.connectionString);
      e.onExecuted({'identityClient':identityClient});   

   },


   createUser : async function(e){
      let identityResponse = await e.identityClient.createUser();
      console.log(`\nCreated an identity with ID: ${identityResponse.communicationUserId}`);
      e.onExecuted({'identityResponse':identityResponse});   

   },

   issueToken : async function(e)
   {
       // Issue an access token with a validity of 24 hours and the "voip" scope for an identity
       let tokenResponse = await e.identityClient.getToken(e.identityResponse, ["chat"]);
      //let tokenResponse = await e.identityClient.getToken(, ["chat"]);

      // Get the token and its expiration date from the response
      const { token, expiresOn } = tokenResponse;
      console.log(`\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`);
      console.log(token);  

      e.onExecuted({'tokenResponse':tokenResponse});   

   },


   
   refreshToken : async function(e)
   {
      // Issue an access token with a validity of 24 hours and the "voip" scope for an identity
        let refreshTokenResponse = await e.identityClient.getToken(e.identityResponse, ["chat"]);
      //let tokenResponse = await e.identityClient.getToken(, ["chat"]);

      // Get the token and its expiration date from the response
      const { token, expiresOn } = refreshTokenResponse;
      console.log(`\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`);
      console.log(token);  

      e.onExecuted({'tokenResponse':refreshTokenResponse});   

   },

   
    callData : async function (e) {
        e.url = DMSChatLib.getSpecialChars(e.url);
        var hd = (undefined !== e.headers ? e.headers : {})
        
        axios({
             method: "post"
            ,url: e.url
            ,headers: {'Access-Control-Allow-Origin':'*'}
            })
            .then(response => {
                if (e.onExecuted){
                      e.onExecuted (JSON.parse(response.data))
                }  
            })
            .catch(function(error) {
                e.onError (error)
            })
            
 },             


      cover : function (word) {
    
    
        var $ary = new String(word) 
        var cdxT = new Array();
    
        for (var vq = 0; vq < $ary.length;vq++) {
            cdxT.push((new String($ary[vq]).charCodeAt(0) + 7) * 3)
        }
    
        return cdxT.join('|');
    
    },

 
 
getSpecialChars : function($d)  {
        $d = $d.replace(/\n/ig,  (reg) => {
            return '[60~65]';
        })
    
        $d = $d.replace(/\s/ig, (reg) => {
            return '%20';
        })
    
        $d = $d.replace(/(\“|\"|\”|\’)/ig, (reg) => {
            return '%22';
        })
    
        $d = $d.replace(/\—/ig, (reg) => {
            return '%2D';
        })
    
    
        $d = $d.replace(/\#/ig, (reg) => {
            return '%23';
        })
    
        $d = $d.replace(/\ñ/ig, (reg) =>{
            return '[~164~]';
        })
        $d = $d.replace(/\Ñ/ig, (reg) => {
            return '[~165~]';
        })
        
        return ($d);   
    
    },



   createChannel: async function(e){
      const createThreadRequest = {
         topic: e.chatTitle
      }

      const createChatThreadOptions = {
         participants :[
            {
             id : {communicationUserId : e.UserId}
            ,displayName: e.userDisplayName
            }
         ]
      }

      const createChatThreadResult = await e.chatClient.createChatThread(
         createThreadRequest,
         createChatThreadOptions
      );

      const threadId = createChatThreadResult.chatThread.id;

      e.onExecuted({'threadId':threadId});

   },

   updateUser : function(e){      
      var updUsrURl= '' + DMSChatKeys.dommusEndpoint + 'api/proxy/DoMethod?instanceName=iDomus.BO.User&process=updateAzureCSUserID&mode=Instanced&processParamaters=[@User:'+ e.UserId +'][@ACSUserID:'+ e.ACSUserID.communicationUserId +']'
      DMSChatLib.processData(
         {
             url:updUsrURl       
            ,onExecuted:(response)=>{
               e.onExecuted (response)

            }
            ,onError:(error)=>{
               e.onError (error)

            }
         }
      )      
   },  
   
   
   
   updateTokenUser :  function(e){      
      var updUsrURl= '' + DMSChatKeys.dommusEndpoint + 'api/proxy/DoMethod?instanceName=iDomus.BO.User&process=updateAzureTokenID&mode=Instanced&processParamaters=[@User:'+ e.UserId +'][@TokenID:'+ e.TokenID +'][@TokenExpire:'+ e.TokenExpire +']'

      DMSChatLib.processData(
         {
             url:updUsrURl       
            ,onExecuted:(response)=>{
               e.onExecuted (response)
            }
            ,onError:(error)=>{
               e.onError (error)
            }
         }
      )      
   },  
   
   

 
   updateChannelThreadId :  function(e){      
      var updUsrURl= '' + DMSChatKeys.dommusEndpoint + 'api/proxy/DoMethod?instanceName=iDomus.BO.Complex&process=Prc_UsrUpdateAzureRoomId&mode=Instanced&processParamaters=[@ComplexId:'+ e.ComplexId +'][@AzureRoomId:'+ e.AzureRoomId +']'

      DMSChatLib.processData(
         {
             url:updUsrURl       
            ,onExecuted:(response)=>{
               e.onExecuted (response)
            }
            ,onError:(error)=>{
               e.onError (error)
            }
         }
      )      
   },  
   
   



   processData: async function (e) {
      var $spUrl = DMSChatLib.getSpecialChars(e.url);
      var hd = (undefined !== e.headers ? e.headers : {})

         var $hSupp = (e.forceByHeader  ? DMSChatLib.getSupportByHeader(e.url) : {url:e.url,headers:{}});
         $spUrl = $hSupp.url;
         hd = {...e.headers,...$hSupp.headers,...{'Access-Control-Allow-Origin':'*'}}
         

         axios({
         method: "POST",
         url: $spUrl,
         headers:hd,
         transformResponse: [(data) => {            
            return JSON.parse(data);
            }],
         })       
         .then(response => {
            if (e.onExecuted){
                  e.onExecuted (response)
            }  
         })
         .catch( error => {
            e.onError (error)
         });   

   } ,



}


export default DMSChatLib;
