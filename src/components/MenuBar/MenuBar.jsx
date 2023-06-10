import { Rating } from "@mui/material";
import "./MenuBar.css"


const MenuBar = ({props}) => {
    return (
        <div className="menuBar">
            <h1 className="searchTitle">Search Recipe</h1>
            <form className="searchForm" action="">
                <input className="inputSearch" type="text" name="search" id="search" />
            </form>
            {props.map((item,index) => (
                <div className="food_list">
                    <img src={item.image} alt="" />
                    <h1 className="food_name_title">{item.recipeName}</h1>
                    <h2 className="author">{item.cookingTime}</h2>
                    <Rating name="read-only" value={item.ratingPoint} readOnly />
                    <button className="gg-add"></button>
                </div>
            ))
            }
        </div>
    )
}

export default MenuBar;