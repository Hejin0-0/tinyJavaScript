const resultEl = document.getElementById("result");
const lengthEl = document.getElementById("length");
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");
const generateEl = document.getElementById("generate");
const clipboard = document.getElementById("clipboard");

const randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol,
};

clipboard.addEventListener("click", () => {
	const textarea = document.createElement("textarea");
	const password = resultEl.innerHTML;

	if (!password) {
		return;
	}

	textarea.value = password;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand("copy");
	textarea.remove();
	alert("Password copied to clipboard");
});

generateEl.addEventListener("click", () => {
	const length = +lengthEl.value;
	const hasLower = lowercaseEl.checked;
	const hasUpper = uppercaseEl.checked;
	const hasNumber = numbersEl.checked;
	const hasSymbol = symbolsEl.checked;

	resultEl.innerText = generatePassword(
		hasLower,
		hasUpper,
		hasNumber,
		hasSymbol,
		length
	);
});

function generatePassword(lower, upper, number, symbol, length) {
	let generatePassword = "";
	const typeCount = lower + upper + number + symbol;
	const typeArr = [{ lower }, { upper }, { number }, { symbol }].filter(
		(item) => Object.values(item)[0]
	);

	// Doesn't have a selected type
	if (typeCount === 0) {
		return "";
	}

	// Create a loop
	for (let i = 0; i < length; i += typeCount) {
		typeArr.forEach((type) => {
			const funcName = Object.keys(type)[0];
			generatePassword += randomFunc[funcName]();
		});
	}

	const finalPassword = generatePassword.slice(0, length);

	return finalPassword;
}

function getRandomLower() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
	return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
	const symbols = "!@#$%^&*(){}[]=<>/,.";
	return symbols[Math.floor(Math.random() * symbols.length)];
}

// SOCIAL PANEL JS
const floatingBtn = document.querySelector(".floating-btn");
const closeBtn = document.querySelector(".close-btn");
const socialPanelContainer = document.querySelector(".social-panel-container");

floatingBtn.addEventListener("click", () => {
	socialPanelContainer.classList.toggle("visible");
});

closeBtn.addEventListener("click", () => {
	socialPanelContainer.classList.remove("visible");
});
