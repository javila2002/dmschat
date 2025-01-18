import React from 'react'
import DMSChatLib  from './DMSChatLib';
import List from './components/List';
import Sender from './components/Sender';
import DMSChatKeys from './DMSChatKeys';

class DMSChatView extends React.Component {
  constructor(props) {
    super(props);

    var parentData = {};
    try{
      parentData = JSON.parse(window.location.search.substring(1).split('=')[1].replace(/%22/ig,'"'))
    }
    catch (ex){
    }

    this.state={
       chatClient:null
      ,chatThreadClient:null
      ,currentMessages:null      
      ,displayName : ""
      ,data : parentData    
      ,userToken:null
      ,resident:null
    
    }

    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.doAppend = this.doAppend.bind(this)
  }



  componentDidMount(){
    


    this.setIdentity({
      onExecuted:(resident)=>{

          if (resident.User.Id !== 0 )
          {
              if (undefined !== resident.User.NickName && resident.User.NickName !==''){
                DMSChatLib.createIdentityClient({
                  onExecuted : (ic) =>{

                    if (resident.User.AzureTokenid !== '')
                    {
                      /*refresh token*/

                      var tknDate = new Date(String(resident.User.AzureTokenExpire).split("T")[0]);
                      var tknToday = new Date(`${new Date().getFullYear()}/${new Date().getMonth()+1}/${new Date().getDate()}`);
                      var tkndiff = (Math.floor(tknDate - tknToday) / 86400000);  
                    
                      if (tkndiff <= 0)
                      {                              
                            DMSChatLib.refreshToken({
                            identityClient:ic.identityClient 
                            ,identityResponse:{"communicationUserId":resident.User.NickName}
                            ,onExecuted:(tokenResponse)=>{
                              
                              var eDate =  tokenResponse.tokenResponse.expiresOn.getFullYear() + "/" + (tokenResponse.tokenResponse.expiresOn.getMonth()+1)  + "/" + tokenResponse.tokenResponse.expiresOn.getDate()
      
                              DMSChatLib.updateTokenUser({
                                 UserId:resident.User.Id
                                ,TokenID:tokenResponse.tokenResponse.token
                                ,TokenExpire:eDate
                                ,onExecuted:(tokenResponse)=>{
                                }
                                ,onError:(error)=>{
                                }
                              });

                              this.setState({
                                 userToken:tokenResponse.tokenResponse.token
                                ,displayName:resident.User.Description
                              },()=>{
                                  this.setConnection();
                              })                                     
                            }
                            ,onError:(error)=>{
                            }
                          });
                      }
                      else
                      {                        
                        this.setState({
                           userToken:resident.User.AzureTokenid
                          ,displayName:resident.User.Description
                        },()=>{
                            this.setConnection();
                        }) 
                      }
                    }
                    else
                    {

                        DMSChatLib.issueToken({
                         identityClient:ic.identityClient 
                        ,identityResponse:{"communicationUserId":resident.User.NickName}
                        ,onExecuted:(tokenResponse)=>{

                            /* Save token and Date 
                            */

                            var eDate =  tokenResponse.tokenResponse.expiresOn.getFullYear() + "/" + (tokenResponse.tokenResponse.expiresOn.getMonth()+1)  + "/" + tokenResponse.tokenResponse.expiresOn.getDate()

                            DMSChatLib.updateTokenUser({
                              UserId:resident.User.Id
                              ,TokenID:tokenResponse.tokenResponse.token
                              ,TokenExpire:eDate
                              ,onExecuted:(tokenResponse)=>{
                              }
                              ,onError:(error)=>{

                              }
                            });
                            this.setState({
                               userToken:tokenResponse.tokenResponse.token
                              ,displayName:resident.User.Description
                            },()=>{
                                this.setConnection();
                            })            

                        }
                      })
                    }  
                   
                  }
                })
             } 
             else
             {
              DMSChatLib.createIdentityClient({
                onExecuted : (ic) =>{
                  DMSChatLib.createUser({
                    identityClient:ic.identityClient
                    ,onExecuted:(user)=>{

                      /*****Add user to the Chat room */


                       /* Refresecamos el Token del usaurio base o el creador del Chat */
                       DMSChatLib.refreshToken({
                         identityClient:ic.identityClient 
                        ,identityResponse:{"communicationUserId":DMSChatKeys.userAzureId}
                        ,onExecuted:(tokenResponse)=>{

                          /* connectamos con el token ya asegurandonos que ha sido refrescado */  
                          DMSChatLib.doConnection({
                            userToken:tokenResponse.tokenResponse.token
                           ,onConnected:(chatClient)=>{

                                this.getChannelld({
                                   chatClient:chatClient
                                   ,user:user
                                   ,onExecuted:(channelId)=>{

                                    DMSChatLib.getChannel({
                                      channelId:channelId.threadId
                                     ,chatClient:chatClient
                                     ,onExecuted:(chatThreadClient)=>{                               
                                               
                                           DMSChatLib.joinNewUserToChat({
                                            communicationUserId:user.identityResponse 
                                           ,displayName : resident.User.Description
                                           ,chatThreadClient:chatThreadClient
                                           ,onExecuted : (joinedResult)=>{
           
                                                         DMSChatLib.updateUser({
                                                           UserId:resident.User.Id
                                                         ,ACSUserID:user.identityResponse
                                                         ,onExecuted:()=>{
           
                                                             DMSChatLib.issueToken({
                                                                 identityClient:ic.identityClient 
                                                               ,identityResponse:user.identityResponse
                                                               ,onExecuted:(tokenResponse)=>{
           
                                                                 
                                                                   var eDate =  tokenResponse.tokenResponse.expiresOn.getFullYear() + "/" + (tokenResponse.tokenResponse.expiresOn.getMonth()+1)  + "/" + tokenResponse.tokenResponse.expiresOn.getDate()
           
                                                                   DMSChatLib.updateTokenUser({
                                                                       UserId:resident.User.Id
                                                                     ,TokenID:tokenResponse.tokenResponse.token
                                                                     ,TokenExpire:eDate
                                                                     ,onExecuted:(updatedTokenUser)=>{     
                                                                         this.setState({
                                                                            userToken:tokenResponse.tokenResponse.token
                                                                           ,displayName:resident.User.Description
                                                                         },()=>{
                                                                           this.setConnection();
                                                                         });     
                                                                     }
                                                                     ,onError:(error)=>{
           
                                                                     }
                                                                   });
                                                               }
                                                             })
                                                         } 
                                                       })
                                           }
                                         })     
                                      }
                                   })



                                  }   
                                })
                           }
                         })  




                        }
                      })
                      
                      
                        
                        


                    }
                  })
                }
              })            
          }
            

          }
          

      }
    });
    



  }



  getChannelld(e){

    var {resident} = this.state;
   
    if (resident.Home.Complex.AzureChannelId === ''){
      
      DMSChatLib.createChannel({
        chatTitle : resident.Home.Complex.Description,
        UserId : DMSChatKeys.userAzureId,
        userDisplayName : 'Domus Administrator',
        chatClient:e.chatClient,
        onExecuted:(reponse)=>{

         

          DMSChatLib.updateChannelThreadId({
            ComplexId:resident.Home.Complex.Id
           ,AzureRoomId:reponse.threadId
           ,onExecuted:(tokenResponse)=>{
             
                 DMSChatLib.getChannel({
                  channelId:reponse.threadId
                 ,chatClient:e.chatClient
                 ,onExecuted:(chatThreadClient)=>{

                    e.onExecuted(chatThreadClient)

                      /**
                     * Unimos al usuario base que creo el canal al canal
                     * 
                     */
                      this.joinAdminToChannel({
                         threadId:reponse.threadId
                        ,chatClient:e.chatClient
                        ,user:e.user
                        ,resident:resident
                        ,onExecuted: ()=>{
                            /*joined... */
                        }
                      })
                  
                     /* */




                 }
               });
           }
           ,onError:(error)=>{
           }
         });
        }
      })
    }
    else{      
      DMSChatLib.getChannel({
        channelId:resident.Home.Complex.AzureChannelId
       ,chatClient:e.chatClient
       ,onExecuted:(chatThreadClient)=>{
            e.onExecuted(chatThreadClient)
       }
     });


    }
    

  }


  joinAdminToChannel(e){

    DMSChatLib.getChannel({
      channelId:e.threadId
     ,chatClient:e.chatClient
     ,onExecuted:(chatThreadClient)=>{                               
               
           DMSChatLib.joinNewUserToChat({
            communicationUserId:{"communicationUserId":DMSChatKeys.userAzureId} 
           ,displayName : e.resident.User.Description
           ,chatThreadClient:chatThreadClient
           ,onExecuted : (joinedResult)=>{
              e.onExecuted('Done');
           }
          })
        }
      })

  }



  setConnection(){
    var {resident} = this.state;

    DMSChatLib.doConnection({
       userToken:this.state.userToken
      ,onConnected:(chatClient)=>{

        DMSChatLib.setNotifications({
           chatClient:chatClient
          ,onNotification:(notif)=>{
             console.log('toAppend');
             this.doAppend(notif.nofication)            
          }
        });


        if (resident.Home.Complex.AzureChannelId === ''){
              
          DMSChatLib.createChannel({
                chatTitle : resident.Home.Complex.Description,
                UserId : DMSChatKeys.userAzureId,
                userDisplayName : 'Domus Administrator',
                chatClient:chatClient,
                onExecuted:(reponse)=>{
                  
                  
                  DMSChatLib.updateChannelThreadId({
                   ComplexId:resident.Home.Complex.Id
                  ,AzureRoomId:reponse.threadId
                  ,onExecuted:(tokenResponse)=>{
                    
          
                    DMSChatLib.getChannel({
                      channelId:reponse.threadId
                     ,chatClient:chatClient
                     ,onExecuted:(chatThreadClient)=>{

                       DMSChatLib.getMessages({
                         chatThreadClient:chatThreadClient
                         ,onExecuted:(listMessage)=>{
                           
                           this.setState({
                                chatClient:chatClient
                               ,chatThreadClient:chatThreadClient
                               ,currentMessages:listMessage
                           });
                         }
                       })
                     }
                   });



                  }
                  ,onError:(error)=>{
                  }
                });


                }
              })
        }  
        else
        {

          // DMSChatLib.getAsyncChannels({
          //     chatClient:chatClient
          //    ,onExecuted:(listResponse)=>{
          //     console.log(listResponse);
          //   }
          // })


          DMSChatLib.getChannel({
            channelId:resident.Home.Complex.AzureChannelId
           ,chatClient:chatClient
           ,onExecuted:(chatThreadClient)=>{

             DMSChatLib.getMessages({
               chatThreadClient:chatThreadClient
               ,onExecuted:(listMessage)=>{
                 
                 this.setState({
                      chatClient:chatClient
                     ,chatThreadClient:chatThreadClient
                     ,currentMessages:listMessage
                 });

               }
             })

           }
         });
        }
      }
    })
  }

  setIdentity(e){

    var innerURL = '' + DMSChatKeys.dommusEndpoint + 'api/proxy/GetStructureBySentence?instanceName=iDomus.BO.Resident&sentence=Get_tbResident&expresion=Resident(Home(ResidentCollection!Residents(User),User!Owner,Clasification,Complex(Country,Clasification,State,Bank,Company!Security(User!Administrator),Company!Blackboard(User!Administrator),User!Administrator,Company(User!Administrator),CommitteeCollection(BoardCollection(OfficerCollection(Resident(User,Home),Role))))),User(Role))&parameters=[@Id:' + this.state.data.UserID + ']&pager='
    
    DMSChatLib.callData({
         url:innerURL    
        ,onExecuted:(resident)=>{
             this.setState({resident:resident},()=>{
              e.onExecuted(resident)
             })
         }
         ,onerror:(error)=>{
          //goto error
         }
    })
    
  }



  handleSendMessage(event){
      
      DMSChatLib.sendMessage({
           Message:event.message
          ,senderDisplayName:this.state.displayName
          ,chatThreadClient: this.state.chatThreadClient  
          ,onExecuted:(result)=>{
    
            this.senderRef.cleanUp();
            console.log('message sent',result)
            

          } 
     })
  }



  renderMessages(){
    if (this.state.currentMessages != null){      
      return(
        <List 
         data={this.state.currentMessages} 
         chatThreadClient={this.state.chatThreadClient}  
         ref={ (ref) => { this.messageslist = ref } }
         />
      )

    }
    else{
      return
      (<></>)
    }
  }


  doAppend(msg){

  const newMessage = msg;

  console.log('nuevo mensaje',newMessage)
 
    if (this.state.currentMessages != null ){
      let clnMessages = [];
      clnMessages = this.state.currentMessages.map( x => ({...x}) );
      console.log('listado de mensajes clonado',clnMessages)
      clnMessages.push(DMSChatLib.toMessage({not:newMessage}));
      console.log('nuevo listado de mensajes',clnMessages)

      this.setState({
         currentMessages : clnMessages
       },()=>{
        console.log('updated')
        this.messageslist.refreshData(this.state.currentMessages)
        this.messageslist.doScroll();  
       })
      
    }

  }


  render() {
    
    const stMain = {       
       "border" : "1px solid #CCCCCC"
    ,  "overflow" : "hidden"    
    ,  "backgroundColor" : "#DCDCBE"
    ,  "WebkitBoxShadow" : "13px 13px 7px -11px rgba(204,204,204,1)"
    ,  "MozBoxShadow" : "13px 13px 7px -11px rgba(204,204,204,1)"
    ,  "boxShadow" : "13px 10px 7px -11px rgba(204,204,204,1)"
    ,  "borderBottomRightRadius": "3px"
    ,  "borderBottomLeftRadius" : "3px"
    ,  "borderTopRightRadius" : "3px"
    ,  "borderTopLeftRadius" : "3px"    
    ,  "height": "-webkit-fill-available"}



    if (this.state.currentMessages != null){
    return (  

      <div style={stMain} id = 'mainStructure' >
          <div id='dvTitle' style={{"width":"218px","height":"35px","fontSize":"12px"}} >
             <img src={ process.env.PUBLIC_URL + "Pics/chat_logo.png" } style={{float:'left',marginTop:'3px'}} />
             <span style={{
               float: 'left',
               fontSize: '13px',
               fontFamily:'Calibri',
               fontWeight: 'bold',              
               marginLeft:'2px',
               marginTop:'3px',
               color:'#495C5B'
             }}
             >Chat Residencial</span>

            <span style={{
               float: 'left',
               fontSize: '13px',
               fontWeight: 'bold',  
               fontFamily:'Calibri',            
               marginLeft:'2px',
               marginTop:'0px',
               color:'#495C5B'
             }}
             >{ new String('Fraccionamiento Ruiseñores Cto. Canarios').substring(0,30)}</span>
             
          </div>
          <div id='dvContent' style={{"height": "60%",
                                      "fontSize": "12px"
                                     
                                     }} >
            <>{
            <List 
                    data={this.state.currentMessages} 
                    chatThreadClient={this.state.chatThreadClient}  
                    ref={ (ref) => { this.messageslist = ref } }
                    />

              }</>
          </div>
          <div id='dvMessage' style={{"height":"20%","fontSize":"12px","marginTop":"2px","borderRadius":'2px'}} >
             <Sender 
              onSendMessage = { this.handleSendMessage } 
              ref={ (ref) => { this.senderRef = ref } }
              />
          </div>
      </div>
      
     )
     
    }
    else{
      return
      (<></>)
    }
  }




};

export default DMSChatView;
