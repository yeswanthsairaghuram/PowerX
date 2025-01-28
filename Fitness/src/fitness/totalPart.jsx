import React from 'react';
import './totalPart.css';
import SlickFit from './slickPart';

const TotalPart = () => {
    return (
        <div className='test-main'>
            <div className='tpmain'>
                <div className='testimonials'>TESTIMONIALS</div>
                <div className='clientsSay'>What My Clients Say</div>
                <SlickFit/>
            </div>
        </div>
    )
}

export default TotalPart;