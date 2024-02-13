import React from 'react'
// import bkgcSend from './Pics/send_image.png';



class Sender extends React.Component
{
    constructor (props){
        super(props)

        this.state = {
              messagetoSend : '',
              isDisabled : true,
              iconSendenabled : `url('${ process.env.PUBLIC_URL + "/Pics/send_image.png" }')`,
              iconSenddisabled : `url('${ process.env.PUBLIC_URL + "/Pics/send_image_dsb.png" }')`,
              icontoSent:`url('${ process.env.PUBLIC_URL + "/Pics/send_image_dsb.png" }')`
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }


    
  handleInputChange(event) {
    const target = event.target;
    var _srts = target.value === "" ? true : false
    var _icts = target.value === "" ? this.state.iconSenddisabled : this.state.iconSendenabled

    this.setState({
      messagetoSend : target.value,
      isDisabled : _srts,
      icontoSent : _icts

    });
  }

  cleanUp(){
    this.setState({
        messagetoSend : "",
        isDisabled : true,
        icontoSent : this.state.iconSenddisabled  
      });
  }

handleSend(event) {
    this.props.onSendMessage({message:this.state.messagetoSend})

}

    render(){

        return(
            <div style={{"height":"-webkit-fill-available"}} >
                <textarea value={this.state.messagetoSend} onChange={this.handleInputChange}  placeholder='Escribe tu mensaje' style={{
                  'border': '1px solid rgb(16, 139, 199)',
                  'width': '80%',
                  'borderRadius':'3px',
                  'height': '-webkit-fill-available',                  
                  'line-height': '13px',
                  'overflow': 'hidden',
                  'font-family': 'Calibri',
                  'font-size': '12px',   
                  'float':'left',               
                  'word-spacing':  '1px',
                  'background-color': '#cacccd6b',
                  'color': '#495c5b',
                  'padding': '4px',
                  'overflow-y': 'auto',
                  'resize':'none',
                  'margin':'2px'
                }} 
                />
                <input type='button'  onClick ={this.handleSend}  style={{                    
                    float:'left',
                    height: '28px',
                    marginTop: '6px',
                    backgroundRepeat: 'no-repeat',
                    border: '0px',
                    backgroundColor: 'transparent',
                    width: '26px',
                    marginLeft: '2px',
                    cursor:'pointer',
                    backgroundImage: this.state.icontoSent

                }}  
                    disabled={this.state.isDisabled}
                />
            </div>
        )
        
    }

}
export default Sender;