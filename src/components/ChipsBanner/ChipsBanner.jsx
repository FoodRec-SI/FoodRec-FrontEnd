import "./ChipsBanner.css"

import { useState,useRef,useEffect } from "react";

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


const Chip=(props) =>{

  const { label, onClick, activeChip, setActiveChip } = props;

  const handleClick = () => {
    if (activeChip === label) {
      // Deactivate the chip if it is already active
      setActiveChip(null);
      onClick(null);
    } else {
      // Activate the chip and deactivate others
      setActiveChip(label);
    }
    onClick(label);
  };

  return (
    <div className={`chip ${activeChip === label ? 'active' : ''}`} onClick={handleClick} >
      {props.label}
    </div>
  );
}

const ChipsBanner = (props) => {

  const scrl =useRef(null);
  const [activeChip, setActiveChip] = useState(null);
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
    if (activeChip === item.tagName) {
      setActiveChip(""); // Deactivate the chip
      props.onItemClick(""); // Clear the value sent to another component
    } else {
      setActiveChip(item.tagName); // Activate the chip
      props.onItemClick(item); // Send the chip value to another component
    }
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
            activeChip={activeChip}
            setActiveChip={setActiveChip}
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
