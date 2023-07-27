import './Banner.css'

function Banner() {
    const myString = 'WHEN YOU ARE HOME ALONE AND HUNGRY ?';

    // Find the index of 'HOME ALONE' in the string
    const startIndex = myString.indexOf('HOME ALONE');
    const endIndex = startIndex + 'HOME ALONE'.length;

    // Split the string into three parts: before, target, and after
    const beforeText = myString.substring(0, startIndex);
    const targetText = myString.substring(startIndex, endIndex);
    const afterText = myString.substring(endIndex);
    var captionDescription = 'The FoodRec is the best website for explore new Snacks and Recipes of food and Smoothies it is very simple to use and the best way to find new wih the help of us';
    return (

        <div className="banner">
            <div className="banner__info">
                <div className="left">
                    <p className='captionName'>
                        {beforeText}
                        <span style={{ color: 'green' }}>{targetText}</span>
                        {afterText}
                    </p>
                    <h4 className='captionDescription'>{captionDescription}</h4>
                </div>
                <div className="right">
                    <img className='dishImage01' src="/assets/delicious-food-black-board-removebg-preview.png" alt="" />
                    <img className='dishImage02' src="/assets/tagliatelle-pasta-with-tomatoes-chicken-removebg-preview.png" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Banner;