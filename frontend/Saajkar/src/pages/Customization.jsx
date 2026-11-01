import { useState } from "react";
import "./Customization.css";

const API_URL = "https://saajkar-backend.onrender.com/api";

function Customization() {

  const [referenceImages, setReferenceImages] = useState([]);

  // ================= IMAGE UPLOAD =================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const allowedTypes = [
      "image/png",
      "image/jpeg"
    ];

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

    setReferenceImages((previousFiles) => [
      ...previousFiles,
      ...files
    ]);

    e.target.value = "";
  };

  // ================= DELETE IMAGE =================

  const deleteImage = (indexToDelete) => {
    setReferenceImages((previousFiles) =>
      previousFiles.filter(
        (_, index) => index !== indexToDelete
      )
    );
  };

  // ================= SUBMIT FORM =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const phone = form.phone.value;
    const email = form.email.value;

    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address containing @.");
      return;
    }

    try {

      const formData = new FormData();

      // Backend field names
      formData.append("name", form.fullName.value);
      formData.append("email", form.email.value);
      formData.append("phone", form.phone.value);
      formData.append(
        "jewelleryType",
        form.jewelleryType.value
      );
      formData.append(
        "material",
        form.material.value
      );
      formData.append(
        "budget",
        form.budget.value
      );
      formData.append(
        "description",
        form.description.value
      );

      // Add reference images
      referenceImages.forEach((file) => {
        formData.append("referenceImages", file);
      });

      // Send request to backend
      const response = await fetch(
        `${API_URL}/customizations`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to submit customization request."
        );
      }

      alert(
        "Your customization request has been submitted successfully!"
      );

      // Reset form
      form.reset();
      setReferenceImages([]);

    } catch (error) {

      console.error(
        "Customization Submit Error:",
        error
      );

      alert(
        error.message ||
        "Unable to submit customization request."
      );
    }
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
            <p>Tell us what you want to create.</p>
          </div>

          <div className="step-card">
            <span>2</span>
            <h3>Upload Inspiration</h3>
            <p>Add photos, sketches or references.</p>
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

        <form
          className="custom-form"
          onSubmit={handleSubmit}
        >

          {/* FULL NAME */}

          <div className="custom-box">

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              name="fullName"
              required
            />

          </div>

          {/* EMAIL */}

          <div className="custom-box">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              title="Please enter a valid email address containing @"
              required
            />

          </div>

          {/* PHONE */}

          <div className="custom-box">

            <label>Phone Number</label>

            <input
              type="text"
              placeholder="Enter 10-digit phone number"
              name="phone"
              maxLength="10"
              inputMode="numeric"
              pattern="[0-9]{10}"
              title="Phone number must contain exactly 10 digits"
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10);
              }}
              required
            />

          </div>

          {/* JEWELLERY TYPE */}

          <div className="custom-box">

            <label>Jewellery Type</label>

            <select
              name="jewelleryType"
              defaultValue=""
              required
            >

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

          {/* MATERIAL */}

          <div className="custom-box">

            <label>Material</label>

            <select
              name="material"
              defaultValue=""
              required
            >

              <option value="" disabled>
                Select Material
              </option>

              <option>Gold</option>

            </select>

          </div>

          {/* BUDGET */}

          <div className="custom-box">

            <label>Budget Range</label>

            <select
              name="budget"
              defaultValue=""
              required
            >

              <option value="" disabled>
                Select Budget
              </option>

              <option>Below ₹500</option>
              <option>₹500 - ₹1,000</option>
              <option>₹1,000 - ₹1,500</option>
              <option>Above ₹1,500</option>

            </select>

          </div>

          {/* DESCRIPTION */}

          <div className="custom-box full-width">

            <label>
              Describe Your Design
            </label>

            <textarea
              name="description"
              placeholder="Explain your jewellery design idea..."
              required
            ></textarea>

          </div>

          {/* IMAGE UPLOAD */}

          <div className="custom-box full-width">

            <label>
              Upload Reference Images
            </label>

            <p className="upload-info">
              Only PNG, JPG and JPEG files are allowed
            </p>

            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              multiple
              onChange={handleImageChange}
            />

            {/* SELECTED FILES */}

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

                      <span>📎</span>

                      <span>
                        {file.name}
                      </span>

                    </div>

                    <button
                      type="button"
                      className="delete-file-btn"
                      onClick={() =>
                        deleteImage(index)
                      }
                    >
                      Delete
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* SUBMIT */}

          <button
            className="submit-btn"
            type="submit"
          >
            Submit Custom Request
          </button>

        </form>

      </section>

    </div>

  );
}

export default Customization;
