const API_URL =
  "https://aura-2-lightning-feedback-db.vercel.app/api/feedback";


const form =
  document.getElementById("feedbackForm");

const ratingButtons =
  document.querySelectorAll("#rating button");

const ratingValue =
  document.getElementById("ratingValue");

const submitButton =
  document.getElementById("submitButton");

const statusBox =
  document.getElementById("status");


let selectedRating = 0;


// ------------------------------------
// STAR RATING
// ------------------------------------

ratingButtons.forEach((button) => {

  button.addEventListener("click", () => {

    selectedRating =
      Number(button.dataset.rating);

    ratingValue.value =
      selectedRating;

    updateStars();

  });

});


function updateStars() {

  ratingButtons.forEach((button) => {

    const starRating =
      Number(button.dataset.rating);

    if (starRating <= selectedRating) {

      button.classList.add("active");

    } else {

      button.classList.remove("active");

    }

  });

}


// ------------------------------------
// STATUS MESSAGE
// ------------------------------------

function showStatus(message, type) {

  statusBox.textContent = message;

  statusBox.className =
    `status ${type}`;

}


// ------------------------------------
// SUBMIT FEEDBACK
// ------------------------------------

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    // Require rating

    if (!selectedRating) {

      showStatus(
        "Please choose a rating first.",
        "error"
      );

      return;

    }


    const feedback = {

      rating: selectedRating,

      name:
        document
          .getElementById("name")
          .value
          .trim(),

      liked:
        document
          .getElementById("liked")
          .value
          .trim(),

      problems:
        document
          .getElementById("problems")
          .value
          .trim(),

      improvements:
        document
          .getElementById("improvements")
          .value
          .trim(),

      comments:
        document
          .getElementById("comments")
          .value
          .trim()

    };


    // Require actual written feedback

    if (
      !feedback.liked &&
      !feedback.problems &&
      !feedback.improvements &&
      !feedback.comments
    ) {

      showStatus(
        "Please write some feedback before submitting.",
        "error"
      );

      return;

    }


    submitButton.disabled = true;

    submitButton.textContent =
      "Submitting...";

    statusBox.className = "status";


    try {

      const response =
        await fetch(
          API_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(feedback)
          }
        );


      let result;

      try {

        result = await response.json();

      } catch {

        result = {};

      }


      if (!response.ok) {

        throw new Error(
          result.error ||
          "The server couldn't save your feedback."
        );

      }


      showStatus(
        "Thanks! Your feedback was submitted successfully.",
        "success"
      );


      // Clear form

      form.reset();

      selectedRating = 0;

      ratingValue.value = "";

      updateStars();


    } catch (error) {

      console.error(error);

      showStatus(
        error.message ||
        "Couldn't submit your feedback. Please try again.",
        "error"
      );

    } finally {

      submitButton.disabled = false;

      submitButton.textContent =
        "Submit Feedback";

    }

  }
);
