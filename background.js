var filtered_comments = [];
var sorted_comments = [];
function send_comments(videoId, tab_id) {
	var link = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&order=relevance&textFormat=plainText&videoId=${videoId}&key=AIzaSyDFamiFXOdOLzb-XU2VS0Uyr3pysYeN0-Y`;
	// console.log(link);
	$.ajax({
		url: link,
		method: "GET",
		statusCode: {
			200: (comments) => {
				filter_comments(comments);
				// console.log(comments);
				chrome.tabs.sendMessage(tab_id, {
					h: "sentcomments",
					comments: sorted_comments,
				});
			},
			400: () => {
				console.log("Error");
			},
			404: () => {
				console.log("Error");
			},
		},
	});
}

function filter_comments(comments) {
	// console.log(comments);
	filtered_comments = comments.items.map((item) => {
		return {
			author: item.snippet.topLevelComment.snippet.authorDisplayName,
			comment: item.snippet.topLevelComment.snippet.textDisplay,
			profile: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
		};
	});

	time_expression = new RegExp("[0-9]{0,2}:[0-9]{1,2}");
	// ^([0-1]?\d|2[0-3])(?::([0-5]?\d))?(?::([0-5]?\d))?$

	filtered_comments.forEach((item) => {
		if (time_expression.test(item.comment)) {
			sorted_comments.push({
				time_stamp: item.comment.match(time_expression)[0],
				author: item.author,
				comment: item.comment,
				profile: item.profile,
			});
		}
	});

	sorted_comments = sorted_comments.map((comment) => {
		let time = [];
		let seconds = 0.0;
		time = comment.time_stamp.split(":");
		seconds = parseFloat(time[0] * 60) + parseFloat(time[1]);
		return {
			time_stamp: seconds,
			author: comment.author,
			comment: comment.comment,
			profile: comment.profile,
		};
	});
	console.log(sorted_comments);
}

chrome.tabs.onUpdated.addListener((id, changeinfo, tab) => {
	if (changeinfo.status === "complete") {
		if (/^https:\/\/www\.youtube\.com\/watch*/.test(tab.url)) {
			chrome.tabs.executeScript(id, { file: "./foreground.js" });
			chrome.tabs.insertCSS(id, { file: "./style.css" });
		}
	}
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message == "send_comments") {
		send_comments(request.videoId, sender.tab.id);
	}
	// console.log(request);
});
