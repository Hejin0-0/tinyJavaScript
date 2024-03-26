// DOM에서 'preview' 요소 가져오기
const preview = document.getElementById("preview");

// DOM에서 'styles' 요소 가져오기
const styles = document.getElementById("styles");

// 클래스가 'settings'인 모든 입력 요소 가져오기
const ranges = document.querySelectorAll(".settings input");

// DOM에서 'copy-styles' 버튼 요소 가져오기
const copyBtn = document.getElementById("copy-styles");

// 각 range 입력에 'generateStyles' 함수를 트리거하는 이벤트 리스너 추가
// Add event listener to each range input
ranges.forEach((slider) => {
	slider.addEventListener("input", generateStyles);
});

// 입력 값에 따라 스타일을 생성하고 업데이트하는 함수
// Function to generate and update styles
function generateStyles() {
	// 각 입력 필드에서 값을 가져오기
	const xShadow = document.getElementById("x-shadow").value;
	const yShadow = document.getElementById("y-shadow").value;
	const blurRadius = document.getElementById("blur-r").value;
	const spreadRadius = document.getElementById("spread-r").value;
	const shadowColor = document.getElementById("shadow-color").value;
	const shadowOpacity = document.getElementById("shadow-opacity").value;
	const shadowInset = document.getElementById("inset-shadow").checked;
	const borderRadius = document.getElementById("border-r").value;

	// 입력 값에 기반하여 box shadow CSS 속성 값 생성
	// Create the box shadow CSS property value
	const boxShadow = `${
		shadowInset ? "inset " : ""
	} ${xShadow}px ${yShadow}px ${blurRadius}px ${spreadRadius}px ${hexToRgba(
		shadowColor,
		shadowOpacity
	)}`;
	/*
    ${shadowInset ? "inset " : ""}: 그림자가 내부에 적용되는지 외부에 적용되는지를 결정. shadowInset이 참일 경우에는 "inset"을 추가하고, 거짓이면 빈 문자열을 추가.

    ${xShadow}px ${yShadow}px ${blurRadius}px ${spreadRadius}px: 그림자의 가로 위치(xShadow), 세로 위치(yShadow), 흐림 정도(blurRadius), 퍼짐 정도(spreadRadius)를 설정.

    ${hexToRgba(shadowColor, shadowOpacity)}: 그림자의 색상과 투명도 설정. hexToRgba 함수를 사용하여 16진수 형식의 색상(shadowColor)을 RGBA 형식으로 변환하고, 그림자의 투명도(shadowOpacity)를 설정.
    */

	// 미리보기 요소 스타일 업데이트하기 (생성된 박스 쉐도우 및 보더 반경으로)
	// Update the preview element styles
	preview.style.boxShadow = boxShadow;
	preview.style.borderRadius = `${borderRadius}px`;

	// 생성된 스타일로 textarea 업데이트하기
	// Update textarea with generated styles
	styles.textContent = `box-shadow: ${boxShadow};\nborder-radius: ${borderRadius}px;`;
}

// 16진 색상과 투명도를 rgba 형식으로 변환하는 함수
// Function to convert hex color and opacity to rgba format
function hexToRgba(shadowColor, shadowOpacity) {
	const r = parseInt(shadowColor.substr(1, 2), 16);
	const g = parseInt(shadowColor.substr(3, 2), 16);
	const b = parseInt(shadowColor.substr(5, 2), 16);

	return `rgba(${r}, ${g}, ${b}, ${shadowOpacity})`;
}

// 생성된 스타일을 클립보드로 복사하는 함수
// Function to copy the generated styles
function copyStyles() {
	// 'styles' 요소의 내용 선택하기
	styles.select();

	// 선택된 내용을 클립보드로 복사하기
	document.execCommand("copy");

	// 복사된 상태를 나타내는 버튼 텍스트 업데이트하기
	copyBtn.innerText = "Copied!";

	// 잠시 후 버튼 텍스트 재설정하기
	setTimeout(() => {
		copyBtn.innerText = "Copy Styles";
	}, 500);
}

// 초기 입력 값에 기반하여 스타일을 초기화하기 위해 'generateStyles' 함수 호출하기
generateStyles();
