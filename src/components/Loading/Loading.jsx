import  './Loading.css'

const Loading = () => {
  return ( 
    <div className="loading">
      <div className="loading-container">
        <img className='loading-spinner' src="/assets/spinner-light-bg-unscreen.gif" alt="" />
         <p className='loading-text'>Loading...</p>
      </div>
    </div>
   );
}
 
export default Loading;