import { useCallback } from 'react';
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import Config from '../../config';

interface GalleryProps {
    images: string[];  // Ensure images prop is required
    title: string;
    className?: string;
}

const Gallery = ({ images = [], title = "", className }: GalleryProps) => { // Add default value
    const onInit = () => {
        console.log('lightGallery has been initialized');
    };

    // Added proper dependency array and safe mapping
    const getItems = useCallback(() => {
        return images?.map((image, index) => (
            <div
                key={`${index}`}  // Added proper key
                className="gallery-item my-2 grid grid-cols-3"
                data-src={`${Config.baseURL}/static/images/project_images/${image}`}
            >
                <img 
                    className="img-responsive" 
                    src={`${Config.baseURL}/static/images/project_images/${image}`}
                    alt={`${title}`} // Added accessibility
                />
            </div>
        )) || [];  // Fallback for undefined images
    }, [images]); // Added images to dependency array

    return (
        <div className={className}>
            <LightGallery
                onInit={onInit}
                speed={5000}
                plugins={[lgThumbnail, lgZoom]}
            >
                {getItems()}
            </LightGallery>
        </div>
    );
};

// Add prop validation
Gallery.defaultProps = {
    images: []
};

export default Gallery;