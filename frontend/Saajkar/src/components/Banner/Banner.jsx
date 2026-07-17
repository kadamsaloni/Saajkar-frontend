import "./Banner.css";

import video from "../../assets/saajkar-center-video.mp4";
import banner1 from "../../assets/banner1.jpg";
import banner2 from "../../assets/banner2.jpg";

function Banner() {
  return (
    <div className="banner-container">

      {/* Left Image */}
      <div className="banner-left">
        <img src={banner1} alt="Jewellery" />
      </div>

      {/* Center Video */}
      <div className="banner-center">
        <video
          className="banner-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={video} type="video/mp4" />
        </video>
      </div>

      {/* Right Image */}
      <div className="banner-right">
        <img src={banner2} alt="Advertisement" />
      </div>

    </div>
  );
}

export default Banner;