import React,{useState,useEffect} from "react"
import VisibilitySensor  from "react-visibility-sensor";
import {useSpring,animated} from "react-spring"
interface props{
    children:React.ReactNode
}
export default function AnimateOnScroll(props:props){
    const [visible,setVisible]=useState(false)
    const onChange=(isVisible:boolean)=>{
        setVisible(isVisible)
    }
        const style=useSpring(visible?{
            scale:1,
            opacity:1,
            translate:0,
            from:{scale:0,opacity:0,translate:-50},
            config:{
                mass:20,
                duration:750
            },
            
        }:{
            scale:0,
            opacity:0,
            translate:-50,
            from:{scale:1,opacity:1,translate:0},
            config:{
                mass:20,
                duration:400
            },
            
        })
    

    return (<VisibilitySensor onChange={onChange}><animated.span style={style}>
        {props.children}
    </animated.span></VisibilitySensor>)
}