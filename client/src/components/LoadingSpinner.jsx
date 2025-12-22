import React, { useState } from 'react';
import HashLoader from "react-spinners/HashLoader";

const LoadingSpinner = ({ fullPage = false, message = "Loading..." }) => {
    const [formLoading] = useState(true);
    const override = {
        display: "block",
        borderColor: "black",
    };

    const loaderContent = (
        <div className='form-loader flex'>
            <HashLoader
                color={'#646cff'}
                loading={formLoading}
                cssOverride={override}
                size={70}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
            <span className="animate-pulse">{message}</span>
        </div>
    );

    if (fullPage) {
        return (
            <div className="full-page-loader">
                {loaderContent}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 w-full">
            {loaderContent}
        </div>
    );
};

export default LoadingSpinner;

// Export as FormLoader as well if needed
export const FormLoader = () => <LoadingSpinner />;
