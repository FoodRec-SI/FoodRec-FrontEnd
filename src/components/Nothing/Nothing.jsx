import './Nothing.css'
import { Link } from 'react-router-dom';

const Nothing = () => {
  return ( 
    <div className="nothing">
      <div className="nothing-header">
        <img className='nothing-img' src="public/assets/Nothing.png" alt="Nothing" />
      </div>
      <div className="nothing-text">
        <h2 className='nothing-alert'>Nothing to see here</h2>
        <p className='nothing-advice'>There is nothing to see here, please go back to the home page and save your first recipe!</p>
         <Link to="/">
          <button className="nothing-button">Find Recipes</button>
        </Link>
      </div>
    </div>  
   );
}
 
export default Nothing;