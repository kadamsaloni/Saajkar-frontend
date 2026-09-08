import React from "react";
import "./NewArrival.css";

const NewArrival = () => {
    return (
        <div className="new-arrival-page">

            {/* HEADER */}
            <section className="new-arrival-header">
                <p>✦ SAAJKAR PRESENTS ✦</p>

                <h1>NEW ARRIVALS</h1>

                <div className="arrival-line"></div>

                <span>
                    Discover our latest jewellery collection.
                </span>
            </section>


            {/* PRODUCTS */}
            <section className="new-arrival-products">

                <div className="arrival-heading">
                    <p>JUST IN</p>

                    <h2>Latest Arrivals</h2>
                </div>


                <div className="arrival-grid">

                    {/* PRODUCT 1 */}
                    <div className="arrival-card">

                        <div className="arrival-image">
                            Product Image
                            <button>♡</button>
                        </div>

                        <h3>Traditional Nath</h3>

                        <p>Handcrafted</p>

                        <strong>₹300</strong>

                    </div>


                    {/* PRODUCT 2 */}
                    <div className="arrival-card">

                        <div className="arrival-image">
                            Product Image
                            <button>♡</button>
                        </div>

                        <h3>Gold Necklace</h3>

                        <p>Traditional Jewellery</p>

                        <strong>₹850</strong>

                    </div>


                    {/* PRODUCT 3 */}
                    <div className="arrival-card">

                        <div className="arrival-image">
                            Product Image
                            <button>♡</button>
                        </div>

                        <h3>Chandbali Earrings</h3>

                        <p>Handcrafted</p>

                        <strong>₹650</strong>

                    </div>

                </div>

            </section>


            {/* BOTTOM MESSAGE */}
            <section className="arrival-bottom">

                <p>✦ SAAJKAR ✦</p>

                <h2>
                    NEW STORIES,
                    <br />
                    NEW JEWELLERY.
                </h2>

                <span>
                    Made to celebrate your beautiful moments.
                </span>

            </section>

        </div>
    );
};

export default NewArrival;