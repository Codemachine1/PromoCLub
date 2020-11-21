import React, { useState, useEffect } from 'react';
import "../styles/CenteredConent"
interface id{
    id:String
}
export default function CenteredContent(props:React.PropsWithChildren<id>){
    return <div className="centeredContents">
        {props.children}
    </div>
}