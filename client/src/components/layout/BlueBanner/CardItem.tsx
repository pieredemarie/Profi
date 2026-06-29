import React from 'react';
import './CardItem.css';

interface CardItemProps {
    title: string;
    description: string;
    buttonText: string;
    images: string | string[];
    imageAlt: string;
    buttonUrl: string;
}

export const CardItem: React.FC<CardItemProps> = ({
                                                      title,
                                                      description,
                                                      buttonText,
                                                      images,
                                                      imageAlt,
                                                      buttonUrl,
                                                  }) => {
    const imageList = Array.isArray(images) ? images : [images];

    return (
        <div className="card-item">
            <div className="card-item__content">
                <h3 className="card-item__title">{title}</h3>
                <p className="card-item__description">{description}</p>
                <a
                    href={buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-item__button"
                >
                    {buttonText}
                </a>
            </div>

            <div className="card-item__corner">
                <div className="card-item__images-wrapper">
                    {imageList.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={imageAlt}
                            className="card-item__image"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};