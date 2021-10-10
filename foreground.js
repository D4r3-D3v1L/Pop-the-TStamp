const videoid = new URLSearchParams(location.search).get("v");
chrome.runtime.sendMessage({ message: "send_comments", videoId: videoid });

let comments = [];
let video_time = 0.0;
let interval = null;

document.addEventListener("keyup", (event) => {
	if (event.key === "a") clearInterval(interval);
});

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
					console.log(comment);
					displayComment(comment.author, comment.comment);
				}
			});
		}, 1000);
	}
});
