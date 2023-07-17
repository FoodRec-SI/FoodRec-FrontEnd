import './Nothing.css'

const Nothing = () => {
  return ( 
    <div className="nothing">
      <div className="nothing-header">
        <img className='nothing-img' src="src/assets/Nothing.png" alt="Nothing" />
      </div>
      <div className="nothing-text">
        <h2>Nothing to see here</h2>
        <p>There is nothing to see here, please go back to the home page.</p>
        <a href="/">Go to home page</a>
      </div>
    </div>  
   );
}
 
export default Nothing;