import React,{useState,useEffect} from "react"
import {animated,useSpring} from "react-spring";
interface props{
    children:React.ReactNode
    timing:number
}
export default function AnimatedOnMouseOverTimed(props:props){
    var [isHovering,setIsHovering]=useState(false)
    
    const spring=useSpring({
      display: 'inline-block',
        scale:isHovering?1.6:1,
        from:isHovering?{scale:1}:{scale:1.6},
        config: {
          tension: 300,
          friction: 10,
        },
    })
    
    React.useEffect(() => {
        if (!isHovering) {
          return;
        }
        const timeoutId = window.setTimeout(() => {
            setIsHovering(false);
        }, props.timing);

        return () => {
          window.clearTimeout(timeoutId);
        };

      }, [isHovering, props.timing]);
    const trigger=()=>{
        setIsHovering(true)

    }

    return <animated.div onMouseEnter={trigger} style={spring}>

        {props.children}
    </animated.div>
    
}