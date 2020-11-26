import React,{useState,useEffect} from "react"
import VisibilitySensor  from "react-visibility-sensor";
import {useSpring,animated} from "react-spring"
interface props{
    children:React.ReactNode
}
export default function AnimateOnMouseOver(props:props){
    const [mouseOver,setMouseOver]=useState(false)
    const onMouseOver=()=>{
        setMouseOver(true)
    }
    const onMouseExit=()=>{
        setMouseOver(false)
    }
        const style=useSpring({
            transform:mouseOver?"translate(40px)":"translate(0px)",
            config: {
              tension: 300,
              friction: 10,
            },
        })
    

    return (<animated.div onMouseLeave={onMouseExit} onMouseEnter={onMouseOver} style={style}>
        {props.children}
    </animated.div>)
}