import React from "react";
import "./JewelleryCare.css";

const JewelleryCare = () => {
    return (
        <div className="care-page">

            {/* Header */}
            <div className="care-header">
                <h1>Jewellery Care</h1>

                <p>
                    Take care of your jewellery and keep its beauty
                    shining for years to come.
                </p>
            </div>


            {/* Care Cards */}
            <div className="care-container">

                <div className="care-card">
                    <div className="care-icon">✨</div>

                    <h2>Keep It Clean</h2>

                    <p>
                        Gently clean your jewellery with a soft,
                        dry and lint-free cloth to remove dust,
                        oil and fingerprints.
                    </p>
                </div>


                <div className="care-card">
                    <div className="care-icon">💧</div>

                    <h2>Avoid Water</h2>

                    <p>
                        Remove your jewellery before bathing,
                        swimming or washing dishes to protect
                        its shine and finish.
                    </p>
                </div>


                <div className="care-card">
                    <div className="care-icon">🌸</div>

                    <h2>Avoid Chemicals</h2>

                    <p>
                        Keep jewellery away from perfumes,
                        lotions, hairspray, makeup and household
                        cleaning products.
                    </p>
                </div>


                <div className="care-card">
                    <div className="care-icon">💍</div>

                    <h2>Handle With Care</h2>

                    <p>
                        Avoid dropping, pulling or bending delicate
                        jewellery. Handle each piece gently.
                    </p>
                </div>


                <div className="care-card">
                    <div className="care-icon">🎁</div>

                    <h2>Store Properly</h2>

                    <p>
                        Store each jewellery piece separately in
                        a soft pouch or jewellery box to prevent
                        scratches and tangling.
                    </p>
                </div>


                <div className="care-card">
                    <div className="care-icon">💎</div>

                    <h2>Protect Gemstones</h2>

                    <p>
                        Avoid exposing gemstone jewellery to
                        excessive heat, impact or harsh cleaning
                        solutions.
                    </p>
                </div>

            </div>


            {/* Do & Don't */}
            <div className="care-tips">

                <h2>Jewellery Care Tips</h2>

                <div className="tips-container">

                    <div className="do-section">

                        <h3>✓ Do</h3>

                        <ul>
                            <li>Store jewellery in a dry place.</li>

                            <li>
                                Clean with a soft cloth.
                            </li>

                            <li>
                                Keep pieces separately.
                            </li>

                            <li>
                                Put jewellery on after applying perfume.
                            </li>

                            <li>
                                Check delicate pieces regularly.
                            </li>
                        </ul>

                    </div>


                    <div className="dont-section">

                        <h3>✕ Don't</h3>

                        <ul>
                            <li>
                                Do not use harsh chemicals.
                            </li>

                            <li>
                                Do not wear jewellery while swimming.
                            </li>

                            <li>
                                Do not expose it to excessive moisture.
                            </li>

                            <li>
                                Do not use abrasive materials.
                            </li>

                            <li>
                                Do not store jewellery while it is wet.
                            </li>
                        </ul>

                    </div>

                </div>

            </div>


            {/* Bottom Message */}
            <div className="care-footer">

                <h2>Keep Your Jewellery Beautiful</h2>

                <p>
                    With proper care and storage, your favourite
                    jewellery pieces can continue to shine and
                    remain special for years to come.
                </p>

            </div>

        </div>
    );
};

export default JewelleryCare;