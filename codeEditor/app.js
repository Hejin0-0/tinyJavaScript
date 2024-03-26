// Catching commonly used elements to minimize dom queries
const livePreviewFrame = document.getElementById("live-preview");
const htmlEditor = document.getElementById("html");
const cssEditor = document.getElementById("css");
const jsEditor = document.getElementById("js");

// 라이브 프리뷰 iframe을 설정하고 필요한 스크립트를 포함하는 함수
// Function to set up the live preview iframe and include necessary scripts
function initializeLivePreview() {
	livePreviewFrame.contentWindow.document.body.innerHTML = ""; // 라이브 프리뷰 iframe의 본문을 비움
	const styleElement = document.createElement("style"); // <style> 요소를 생성
	styleElement.setAttribute("id", "live-preview-style"); // id 속성을 설정
	livePreviewFrame.contentWindow.document.head.appendChild(styleElement); // <style> 요소를 라이브 프리뷰 iframe의 head에 추가

	const pagedJsScript = document.createElement("script"); // <script> 요소를 생성
	pagedJsScript.src =
		"https://unpkg.com/pagedjs/dist/paged.legacy.polyfill.js"; // 스크립트의 소스를 설정
	livePreviewFrame.contentWindow.document.head.appendChild(pagedJsScript); // <script> 요소를 라이브 프리뷰 iframe의 head에 추가
}

// HTML 코드 에디터에서 가져온 HTML 코드로 라이브 프리뷰 iframe을 업데이트하는 함수
// Function to update the live preview iframe with the html code from editor
function updateLiveHTMLPreview(codeEditors) {
	livePreviewFrame.contentWindow.document.body.innerHTML =
		codeEditors.html.getValue(); // HTML 코드를 가져와 라이브 프리뷰 iframe의 본문을 업데이트
}

// CSS 코드 에디터에서 가져온 CSS 코드로 라이브 프리뷰 iframe을 업데이트하는 함수
// Function to update the live preview iframe with the css code from editor
function updateLiveCSSPreview(codeEditors) {
	const styleElement =
		livePreviewFrame.contentWindow.document.getElementById(
			"live-preview-style"
		); // 라이브 프리뷰 iframe 내의 <style> 요소를 가져옴
	styleElement.innerHTML = codeEditors.css.getValue(); // CSS 코드를 가져와 <style> 요소의 내용을 업데이트
}

// JavaScript 코드 에디터에서 가져온 JavaScript 코드로 라이브 프리뷰 iframe을 업데이트하는 함수
// Function to update the live preview iframe with the js code from editor
function updateLiveJSReview(codeEditors) {
	const scriptElement = document.createElement("script"); // <script> 요소를 생성
	scriptElement.innerHTML = codeEditors.js.getValue(); // JavaScript 코드를 가져와 <script> 요소의 내용을 설정
	livePreviewFrame.contentWindow.document.body.appendChild(scriptElement); // <script> 요소를 라이브 프리뷰 iframe의 본문에 추가
}

// HTML, CSS, JavaScript에 대한 CodeMirror 에디터를 초기화하는 함수
// Function to initialize CodeMirror editors for html, css and javascript
function initializeCodeEditors() {
	function getDefaultOptions(object) {
		const defaultOptions = {
			lineNumbers: true,
			autoCloseTags: true,
			autoCloseBrackets: true,
			theme: "panda-syntax",
		};

		if (object) {
			const keys = Object.keys(object);
			for (const key of keys) {
				defaultOptions[key] = object[key];
			}
		}
		return defaultOptions;
	}

	const codeEditors = {
		html: CodeMirror(
			htmlEditor,
			getDefaultOptions({
				mode: "text/html",
				value: "",
			})
		),
		css: CodeMirror(
			cssEditor,
			getDefaultOptions({
				mode: "css",
				value: "",
				extraKeys: { "Ctrl-Space": "autocomplete" },
				hintOptions: {
					completeSingle: false,
					closeOnUnfocus: false,
				},
			})
		),

		js: CodeMirror(
			jsEditor,
			getDefaultOptions({
				mode: "javascript",
				value: "",
			})
		),
	};
	return codeEditors;
}

// CodeMirror 에디터 및 이벤트 리스너를 사용하여 라이브 프리뷰 스튜디오를 설정하는 함수
// Function to set up the live preview studio with CodeMirror editors and event listeners
function setupLivePreviewStudio() {
	const codeEditors = initializeCodeEditors(); // CodeMirror 에디터 초기화

	// HTML 에디터 변경 이벤트 리스너
	CodeMirror.on(codeEditors.html, "change", () => {
		updateLiveHTMLPreview(codeEditors);
	});

	// CSS 에디터 변경 이벤트 리스너
	CodeMirror.on(codeEditors.css, "change", () => {
		updateLiveCSSPreview(codeEditors);
	});

	// JavaScript 에디터 변경 이벤트 리스너
	CodeMirror.on(codeEditors.js, "change", () => {
		updateLiveJSReview(codeEditors);
	});
}

// DOM이 완전히 로드된 후 라이브 프리뷰 스튜디오 설정을 위한 이벤트 리스너
// Event listener to set up the live preview studio after the dom is fully loaded
document.addEventListener("DOMContentLoaded", () => {
	initializeLivePreview(); // 라이브 프리뷰 초기화
	setupLivePreviewStudio(); // 라이브 프리뷰 스튜디오 설정
});
