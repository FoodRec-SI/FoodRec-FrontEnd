import './Banner.css'

function Banner(){
    return{
        <div className="banner">
            <div className="banner__info">
                <img className='backgroundBanner' src="src/assets/banner-marble-bkg.jpg" alt="" />
                <div className="left">
                    <p className='captionName'>
                        {beforeText}
                        <span style={{ color: 'green' }}>{targetText}</span>
                        {afterText}
                    </p>
                    <h4 className='captionDescription'>{captionDescription}</h4>
                </div>
                <div className="right">
                    <img className='dishImage01' src="src/assets/delicious-food-black-board-removebg-preview.png" alt="" />
                    <img className='dishImage02' src="src/assets/tagliatelle-pasta-with-tomatoes-chicken-removebg-preview.png" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Banner;