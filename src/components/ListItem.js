import React from 'react'
class ListItem extends React.Component
{
    constructor(props){
        super(props)        
      
        this.state={        
          value : this.props.value
        }

    }


    rndItem= ()=>{
      if (this.state.value.type === "text"){
        return (
           <div style={{
             
        }} >
           
            <span style={{
               display: 'flow-root',
               fontSize: '10px',
               fontWeight: 'bold',
               borderTop: '1px solid #E9E9D6',
               padding: '1px',
               borderLeft: '1px solid #E9E9D6',
               backgroundColor: '#D3D3AD',
               borderRadius: '5px',
               backgroundRepeat: 'no-repeat',
               textIndent: '1px',
               margin: '1px',
               marginBottom: '2px',              
               borderRightColor: '#E9E9D6',
               borderRightStyle: 'solid',
               borderRightWidth: '1px',
               borderBottom: '1px solid #E9E9D6'
          }}
            
            >{ new String(this.props.value.senderDisplayName).substring(0,24) }

            {this.rndImage()}

              <p style={{                          
              marginTop: '2px',
              marginBottom: '2px',
              fontSize: '12px',
              marginLeft: '35px',
              color: '#108BC7',
              fontWeight: 'normal',
              lineHeight: '14px',
              padding: '0px',
              borderRadius:'2px',
              border:'1px solid #CCCCCC'
                 }}>
                {this.state.value.content.message}
              </p>

              <p style={{
                    margin: '0px',
                    fontSize: '9px',
                    float: 'right',
                    fontWeight: 'normal',
                    color:'#2D6978',
                    fontStyle: 'normal',
                    marginRight: '4px',
              }}>
                  {this.state.value.createdOn.toUTCString()}
                  
              </p>

            </span>

              
           </div>
        )
      }
      else {
        return (
          <></>
        )
      }

    };

    
    rndImage= (e)=>{
      return (
        <div style={{width:'30px',height: '30px',border: '1px solid #CBEBFA',marginTop: '1px',float: 'left',marginLeft: '1px',display: 'list-item',marginRight: '2px'}}>
           
        </div>
       )

    };


    render (){
      return(
      <div style={{width:'auto',height:'auto',marginRight: '2px',marginLeft:'2px',marginTop: '2px',marginBottom: '0px'  }} key={this.state.value.id} >
        <></>
        {this.rndItem()}
      </div> 
      )     
    }

}
export default ListItem;