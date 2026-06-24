import * as React from "react";
import './BlueBanner.css'
export const BlueBanner: React.FC = () => {
    return (
        <section className="blue-banner">
            <div className="blue-banner__container">
                <h2 className="blue-banner__title">
                    «УЦ ПРОФИ» — партнер <br/>
                    ведущих российских вендоров
                </h2>

                    <p className="blue-banner__text">
                        Ваш надежный партнер в сфере кибербезопасности с&nbsp;2010&nbsp;года.
                    </p>
                    <p className="blue-banner__text">
                        Комплексная защита информации и&nbsp;аттестация информационных систем
                    </p>

            </div>
        </section>
    );
};