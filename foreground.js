const videoid = new URLSearchParams(location.search).get("v");
chrome.runtime.sendMessage({ message: "send_comments", videoId: videoid });

let comments = [];
let video_time = 0.0;
let interval = null;

{
	/* <img id="img" class="style-scope yt-img-shadow" alt="Verus" height="40" width="40" src="https://yt3.ggpht.com/ytc/AKedOLRfYUzpEN0wgX9DQU-f_uhDLfi1dpyEs141_Gyk=s48-c-k-c0x00ffffff-no-rj"></img> */
}

document.addEventListener("keyup", (event) => {
	if (event.key === "a") clearInterval(interval);
});
const displayComment = (author, comment) => {
	let youtubeVideo = document
		.querySelector(".video-stream")
		.getBoundingClientRect();
	const center = {
		x: youtubeVideo.left + youtubeVideo.width / 5,
		y: youtubeVideo.top + youtubeVideo.height,
	};

	let bar = document
		.querySelector(".ytp-scrubber-container")
		.getBoundingClientRect();

	let commentCard = document.createElement("div");
	// let img = document.createElement("img");
	// img.src =
	// 	"https://yt3.ggpht.com/ytc/AKedOLRfYUzpEN0wgX9DQU-f_uhDLfi1dpyEs141_Gyk=s48-c-k-c0x00ffffff-no-rj";
	// img.width = 40;
	// img.height = 40;
	// // img.classList.add("style-scope yt-img-shadow");
	// commentCard.appendChild(img);

	commentCard.innerText = author;
	commentCard.classList.add("popup");
	commentCard.style.left = `${center.x}px`;
	commentCard.style.top = `${center.y}px`;
	console.log(commentCard.innerText);

	document.querySelector("body").append(commentCard);

	// commentCard.style.left = `${bar.x}px`;
	// commentCard.style.top = `${bar.y - 25}px`;
	let newX = 0.0;
	let newY = 0.0;
	let motionSway = 0.01;
	let naturalSway = 0.1;
	let animatedValue = 0.0;
	let alteredOpacity = 0.0;
	let opacitySpeed = 0.007;

	const animate = () => {
		newY = center.y - animatedValue;
		newX =
			center.x +
			60.0 * Math.sin(motionSway * animatedValue) +
			naturalSway;

		commentCard.style.top = `${newY}px`;
		commentCard.style.left = `${newX}px`;

		alteredOpacity = Math.sin(opacitySpeed * animatedValue);

		commentCard.style.opacity = alteredOpacity;

		animatedValue = animatedValue + 1;

		if (commentCard.style.opacity < 0) {
			return;
		} else {
			requestAnimationFrame(animate);
		}
	};
	animate();
};
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.h == "sentcomments") {
		comments = request.comments;
		// console.log(request.comments);
		interval = setInterval(() => {
			video_time = Math.floor(
				document.querySelector(".video-stream").currentTime
			);
			// console.log(video_time);
			comments.forEach((comment) => {
				if (comment.time_stamp == video_time) {
					console.log(comment.comment);
					displayComment(comment.author + ":" + comment.comment);
				}
			});
		}, 1000);
	}
});
