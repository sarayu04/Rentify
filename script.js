document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const propertyForm = document.getElementById("property-form");
  const applyFilterBtn = document.getElementById("apply-filter");
  const propertyList = document.getElementById("property-list");
  const propertyListBuyer = document.getElementById("property-list-buyer");
  const likeButtons = document.querySelectorAll(".like-btn");

  let properties = [];
  let loggedInUser = null;

  // Function to handle login
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // For simplicity, let's consider any input as valid
    loggedInUser = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
    };
    document.getElementById("login").style.display = "none";
    document.getElementById("seller-dashboard").style.display = "block";
    document.getElementById("buyer-dashboard").style.display = "block";
  });

  // Function to handle property form submission
  propertyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // Form validation (for simplicity, let's assume all fields are required)
    const place = document.getElementById("place").value;
    const area = document.getElementById("area").value;
    const bedrooms = document.getElementById("bedrooms").value;
    const bathrooms = document.getElementById("bathrooms").value;
    const nearby = document.getElementById("nearby").value;
    if (!place || !area || !bedrooms || !bathrooms || !nearby) {
      alert("All fields are required");
      return;
    }
    const property = { place, area, bedrooms, bathrooms, nearby };
    properties.push(property);
    displayProperties(properties);
    propertyForm.reset();
  });

  // Function to handle filter application
  applyFilterBtn.addEventListener("click", function () {
    const filterPlace = document
      .getElementById("filter-place")
      .value.toLowerCase();
    const filterBedrooms = document.getElementById("filter-bedrooms").value;
    const filteredProperties = properties.filter((property) => {
      return (
        (filterPlace
          ? property.place.toLowerCase().includes(filterPlace)
          : true) &&
        (filterBedrooms ? property.bedrooms == filterBedrooms : true)
      );
    });
    displayProperties(filteredProperties, "buyer");
  });

  // Function to display properties
  function displayProperties(properties, mode = "seller") {
    const list = mode === "seller" ? propertyList : propertyListBuyer;
    list.innerHTML = "";
    properties.forEach((property, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>Place:</strong> ${property.place} <br>
        <strong>Area:</strong> ${property.area} <br>
        <strong>Bedrooms:</strong> ${property.bedrooms} <br>
        <strong>Bathrooms:</strong> ${property.bathrooms} <br>
        <strong>Nearby:</strong> ${property.nearby} <br>
        ${
          mode === "seller"
            ? `
          <button onclick="editProperty(${index})">Edit</button>
          <button onclick="deleteProperty(${index})">Delete</button>
          <button class="like-btn" onclick="likeProperty(${index})">Like</button>
          <span class="like-count">0</span>`
            : `
          <button onclick="showSellerDetails()">I'm Interested</button>`
        }
      `;
      list.appendChild(li);
    });
    if (mode === "buyer") {
      updateLikeCounts();
    }
  }

  // Function to update like counts
  function updateLikeCounts() {
    likeButtons.forEach((button, index) => {
      button.nextElementSibling.textContent = properties[index].likes || 0;
    });
  }

  // Function to handle property like
  window.likeProperty = function (index) {
    if (!properties[index].likes) {
      properties[index].likes = 1;
    } else {
      properties[index].likes++;
    }
    updateLikeCounts();
  };

  // Function to edit property
  window.editProperty = function (index) {
    const property = properties[index];
    document.getElementById("place").value = property.place;
    document.getElementById("area").value = property.area;
    document.getElementById("bedrooms").value = property.bedrooms;
    document.getElementById("bathrooms").value = property.bathrooms;
    document.getElementById("nearby").value = property.nearby;
    properties.splice(index, 1);
  };

  // Function to delete property
  window.deleteProperty = function (index) {
    properties.splice(index, 1);
    displayProperties(properties);
  };

  // Function to show seller details
  window.showSellerDetails = function () {
    if (!loggedInUser) {
      alert("Please login to view seller details");
      return;
    }
    alert(`Seller details:
      Name: ${loggedInUser.firstName} ${loggedInUser.lastName}
      Email: ${loggedInUser.email}
      Phone: ${loggedInUser.phone}`);
  };
});
