import { useState } from "react";
import "./Customization.css";

function Customization() {

  // Store multiple uploaded reference images
  const [referenceImages, setReferenceImages] = useState([]);


  // Handle image upload
  const handleImageChange = (e) => {

    const files = Array.from(e.target.files);

    const allowedTypes = [
      "image/png",
      "image/jpeg"
    ];


    // Check for invalid files
    const invalidFile = files.find(
      (file) => !allowedTypes.includes(file.type)
    );


    if (invalidFile) {

      alert(
        "Invalid file! Please upload only PNG, JPG or JPEG images."
      );

      e.target.value = "";

      return;
    }


    // Add new files to existing files
    setReferenceImages((previousFiles) => [
      ...previousFiles,
      ...files
    ]);


    // Clear input so files can be selected again
    e.target.value = "";
  };


  // Delete individual image
  const deleteImage = (indexToDelete) => {

    setReferenceImages((previousFiles) =>
      previousFiles.filter(
        (_, index) => index !== indexToDelete
      )
    );

  };


  return (

    <div className="custom-page">


      {/* ================= HOW IT WORKS ================= */}

      <section className="how-section">

        <h2>How It Works</h2>

        <div className="steps">


          <div className="step-card">

            <span>1</span>

            <h3>Share Your Idea</h3>

            <p>
              Tell us what you want to create.
            </p>

          </div>


          <div className="step-card">

            <span>2</span>

            <h3>Upload Inspiration</h3>

            <p>
              Add photos, sketches or references.
            </p>

          </div>


          <div className="step-card">

            <span>3</span>

            <h3>Consultation</h3>

            <p>
              Our jewellery experts discuss every detail.
            </p>

          </div>


          <div className="step-card">

            <span>4</span>

            <h3>Crafting</h3>

            <p>
              Your jewellery is handcrafted with precision.
            </p>

          </div>


          <div className="step-card">

            <span>5</span>

            <h3>Delivery</h3>

            <p>
              Receive your dream jewellery safely.
            </p>

          </div>


        </div>

      </section>


      {/* ================= CUSTOMIZATION REQUEST ================= */}

      <section className="custom-container">

        <h2>Customization Request</h2>


        <div className="custom-form">


          {/* ================= FULL NAME ================= */}

          <div className="custom-box">

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
            />

          </div>


          {/* ================= EMAIL ================= */}

          <div className="custom-box">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
            />

          </div>


          {/* ================= PHONE ================= */}

          <div className="custom-box">

            <label>Phone Number</label>

            <input
              type="text"
              placeholder="Enter phone number"
            />

          </div>


          {/* ================= JEWELLERY TYPE ================= */}

          <div className="custom-box">

            <label>Jewellery Type</label>

            <select defaultValue="">

              <option value="" disabled>
                Select Jewellery
              </option>

              <option>Ring</option>

              <option>Necklace</option>

              <option>Earrings</option>

              <option>Bangle</option>

              <option>Bracelet</option>

              <option>Bridal Set</option>

            </select>

          </div>


          {/* ================= MATERIAL ================= */}

          <div className="custom-box">

            <label>Material</label>

            <select defaultValue="">

              <option value="" disabled>
                Select Material
              </option>

              <option>Gold</option>

            </select>

          </div>


          {/* ================= BUDGET ================= */}

          <div className="custom-box">

            <label>Budget Range</label>

            <select defaultValue="">

              <option value="" disabled>
                Select Budget
              </option>

              <option>
                Below ₹25,000
              </option>

              <option>
                ₹25,000 - ₹50,000
              </option>

              <option>
                ₹50,000 - ₹1,00,000
              </option>

              <option>
                Above ₹1,00,000
              </option>

            </select>

          </div>


          {/* ================= DESIGN DESCRIPTION ================= */}

          <div className="custom-box full-width">

            <label>
              Describe Your Design
            </label>

            <textarea
              placeholder="Explain your jewellery design idea..."
            ></textarea>

          </div>


          {/* ================= IMAGE UPLOAD ================= */}

          <div className="custom-box full-width">

            <label>
              Upload Reference Images
            </label>

            <p className="upload-info">
              Only PNG, JPG and JPEG files are allowed
            </p>


            {/* FILE INPUT */}

            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              multiple
              onChange={handleImageChange}
            />


            {/* ================= SELECTED FILES ================= */}

            {referenceImages.length > 0 && (

              <div className="selected-files">

                <h4>
                  Selected Files:
                </h4>


                {referenceImages.map((file, index) => (

                  <div
                    className="file-name"
                    key={`${file.name}-${index}`}
                  >


                    <div className="file-info">

                      <span>
                        📎
                      </span>

                      <span>
                        {file.name}
                      </span>

                    </div>


                    {/* DELETE BUTTON */}

                    <button
                      type="button"
                      className="delete-file-btn"
                      onClick={() => deleteImage(index)}
                    >
                      Delete
                    </button>


                  </div>

                ))}

              </div>

            )}

          </div>


          {/* ================= SUBMIT BUTTON ================= */}

          <button
            className="submit-btn"
            type="button"
            onClick={() =>
              alert(
                "Your customization request has been submitted successfully!"
              )
            }
          >
            Submit Custom Request
          </button>


        </div>

      </section>


    </div>

  );

}


export default Customization;