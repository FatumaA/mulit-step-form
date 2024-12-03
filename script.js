const stepInfo = document.getElementById("stepInfo");
const navLeftGroup = document.getElementById("navLeft");
const navRightGroup = document.getElementById("navRight");

const nameInput = document.getElementById("name");
const idNumInput = document.getElementById("idNum");
const emailInput = document.getElementById("email");
const birthdateInput = document.getElementById("birthdate");
const documentInput = document.getElementById("document");
const departmentInput = document.getElementById("department");
const skillsInput = document.getElementById("skills");
const termsCheckbox = document.getElementById("terms");

const nameVal = document.getElementById("name-val");
const idVal = document.getElementById("id-val");
const emailVal = document.getElementById("email-val");
const bdVal = document.getElementById("bd-val");
const cvVal = document.getElementById("cv-val");
const deptVal = document.getElementById("dept-val");
const skillsVal = document.getElementById("skills-val");

const form = document.getElementById("myForm");
const formStepsID = ["one", "two", "three", "four"];
let currentFormStep = 0;

const editButtons = {
	"name-edit": 0,
	"id-edit": 0,
	"email-edit": 0,
	"bd-edit": 0,
	"cv-edit": 1,
	"dept-edit": 1,
	"skills-edit": 2,
};

const updateSummaryValues = () => {
	nameVal.textContent = nameInput.value;
	idVal.textContent = idNumInput.value;
	emailVal.textContent = emailInput.value;
	bdVal.textContent = birthdateInput.value;
	const fileName = documentInput.files[0]?.name;
	if (fileName) {
		const extension = fileName.split(".").pop();
		const baseName = fileName.split(".")[0];
		const truncatedName =
			baseName.length > 10 ? baseName.substring(0, 10) + "..." : baseName;
		cvVal.textContent = `${truncatedName}.${extension}`;
	} else {
		cvVal.textContent = "No file selected";
	}
	deptVal.textContent = departmentInput.value;
	skillsVal.textContent = skillsInput.value || "No skills submitted";
};

const updateStepVisibility = () => {
	formStepsID.forEach((step) => {
		document.getElementById(step).style.display = "none";
	});

	document.getElementById(formStepsID[currentFormStep]).style.display = "block";

	stepInfo.textContent = `Step ${currentFormStep + 1} of ${formStepsID.length}`;

	if (currentFormStep === 3) {
		updateSummaryValues();
	}

	navLeftGroup.style.display = currentFormStep === 0 ? "none" : "block";
	navRightGroup.style.display =
		currentFormStep === formStepsID.length - 1 ? "none" : "block";

	const currentStep = document.getElementById(formStepsID[currentFormStep]);
	const firstInput = currentStep.querySelector("input, select, textarea");
	if (firstInput) {
		firstInput.focus();
	}
};

const showError = (input, message) => {
	const formControl = input.parentElement;
	const errorSpan = formControl.querySelector(".error-message");
	input.classList.add("error");
	input.setAttribute("aria-invalid", "true");
	input.setAttribute("aria-describedby", errorSpan.id);
	errorSpan.textContent = message;
};

const clearError = (input) => {
	const formControl = input.parentElement;
	const errorSpan = formControl.querySelector(".error-message");
	input.classList.remove("error");
	input.removeAttribute("aria-invalid");
	input.removeAttribute("aria-describedby");
	errorSpan.textContent = "";
};

const validateStep = (currentStep) => {
	let isValid = true;

	if (currentStep === 0) {
		if (nameInput.value.trim() === "") {
			showError(nameInput, "Name is required");
			isValid = false;
		}
		if (idNumInput.value.trim() === "") {
			showError(idNumInput, "ID number is required");
			isValid = false;
		}
		if (emailInput.value.trim() === "" || !emailInput.validity.valid) {
			showError(emailInput, "A valid email is required");
			isValid = false;
		}
		if (birthdateInput.value === "") {
			showError(birthdateInput, "Date of birth is required");
			isValid = false;
		}
	} else if (currentStep === 1) {
		if (!documentInput.files[0]) {
			showError(documentInput, "CV/Resume is required");
			isValid = false;
		}
		if (departmentInput.value === "") {
			showError(departmentInput, "Department selection is required");
			isValid = false;
		}
	} else if (currentStep === 2) {
		if (!termsCheckbox.checked) {
			showError(termsCheckbox, "Terms and conditions must be accepted");
			isValid = false;
		}
	}

	return isValid;
};

const realtimeValidation = () => {
	nameInput.addEventListener("input", () => {
		if (nameInput.value.trim() !== "") clearError(nameInput);
	});

	idNumInput.addEventListener("input", () => {
		if (idNumInput.value.trim() !== "") clearError(idNumInput);
	});

	emailInput.addEventListener("input", () => {
		if (emailInput.value.trim() !== "") clearError(emailInput);
	});

	birthdateInput.addEventListener("change", () => {
		if (birthdateInput.value !== "") clearError(birthdateInput);
	});

	documentInput.addEventListener("change", () => {
		if (documentInput.files[0]) clearError(documentInput);
	});

	departmentInput.addEventListener("change", () => {
		if (departmentInput.value !== "") clearError(departmentInput);
	});

	termsCheckbox.addEventListener("change", () => {
		if (termsCheckbox.checked) clearError(termsCheckbox);
	});
};

document.addEventListener("DOMContentLoaded", () => {
	navLeftGroup.style.display = "none";
	updateStepVisibility();
	realtimeValidation();

	navRightGroup.addEventListener("click", () => {
		if (currentFormStep < formStepsID.length - 1) {
			if (validateStep(currentFormStep)) {
				currentFormStep++;
				updateStepVisibility();
			}
		}
	});

	navLeftGroup.addEventListener("click", () => {
		if (currentFormStep > 0) {
			currentFormStep--;
			updateStepVisibility();
		}
	});

	Object.keys(editButtons).forEach((buttonId) => {
		const button = document.getElementById(buttonId);
		button.addEventListener("click", (e) => {
			e.preventDefault();
			currentFormStep = editButtons[buttonId];
			updateStepVisibility();
		});
	});
});

form.addEventListener("submit", (e) => {
	e.preventDefault();
	if (validateStep(2)) {
		alert("Form submitted successfully!");
		form.reset();
		currentFormStep = 0;
		updateStepVisibility();
	}
});
