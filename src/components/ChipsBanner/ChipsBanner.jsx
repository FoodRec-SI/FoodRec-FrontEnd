import "./ChipsBanner.css"

import { useState,useRef,useEffect } from "react";

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


const Chip=(props) =>{

  return (
    <div className="chip" onClick={() => props.onClick(props.label)} >
      {props.label}
    </div>
  );
}

const ChipsBanner = (props) => {

  const scrl =useRef(null);

  const [scrollX, setscrollX] = useState(0);
  const [scrollEnd, setscrollEnd] = useState(false);


  const scrollCheck = () => {
    setscrollX(scrl.current.scrollLeft);
    if (
      Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <=
      scrl.current.offsetWidth
    ) {
      setscrollEnd(true);
    } else {
      setscrollEnd(false);
    }
  };

  useEffect(() => {
    //Check width of the scollings
    if (
      scrl.current &&
      scrl?.current?.scrollWidth === scrl?.current?.offsetWidth
    ) {
      setscrollEnd(true);
    } else {
      setscrollEnd(false);
    }
    return () => {};
  }, [scrl?.current?.scrollWidth, scrl?.current?.offsetWidth]);



  const slide=(shift)=>{
    scrl.current.scrollLeft += shift;
  }
     
   const handleItemClick = (item) => {
    console.log(item);
    props.onItemClick(item);
  };

  return (
    
      <div className="chips-wrapper" >
        {scrollX!==0 && <button className = "btn-scroll" id = "btn-scroll-left" onClick={() => slide(-100)}>
          <NavigateBeforeIcon/>
        </button>}
      <div className="chips-banner" ref={scrl} onScroll={scrollCheck}>
        {props.items.map((item) => (
          <Chip
            key={item.tagId}
            label={item.tagName}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
      { !scrollEnd && <button className = "btn-scroll" id = "btn-scroll-right" onClick={() => slide(+100)}>
        <NavigateNextIcon/>
      </button>}
    </div>
  );
}

export default ChipsBanner;
