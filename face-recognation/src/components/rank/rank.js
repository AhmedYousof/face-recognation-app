import React from 'react';

const Rank = ({name, entires}) => { 
    return(
        <div>
            <div className='white f3'>
                {`${name}, your current rank is`}
            </div>
            <div className='f1 white'>
            {entires}
            </div>
        </div>
    );
};

export default Rank;