import React from 'react'
import ListItem  from './ListItem'

class List extends React.Component
{
    constructor (props){
        super(props)

        this.state = {
             data : this.props.data
            ,chatThreadClient:this.props.chatThreadClient    
        }


    }

    
  refreshData (e){
    this.setState({
        data:e
    })
  }

    componentDidMount(){
        this.doScroll();
    }    
      
    
    doScroll(){
        
        var stM = setTimeout(()=>{
            var cH = document.getElementById("canvas");
            cH.scrollTop= cH.scrollHeight;
        },700);
        
    }

    render(){
        
        return(
         <div id="canvas" style={{
            margin: '1px',
            border: '1px dotted rgb(75, 151, 173)',
            height: '-webkit-fill-available',
            overflowY: 'overlay',
            borderRadius: '2px'            
        }} >
            {this.state.data.map((Item)=> <ListItem key={Item.id} value={Item}    />)}
            
         </div>
                              
        )
    }
}

export default List;