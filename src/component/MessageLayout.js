import React from "react";

function MessageLayout(props){
    return (
        <div className={'flex-container card'} style={{
            height: 'fit-content',
            width: '30%',
            margin: 'auto',
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0'
        }}>
            <p>{props.message}</p>
            <button className={'button-blue'} onClick={props.onButtonClick}>OK</button>
        </div>
    )
}

export default MessageLayout;