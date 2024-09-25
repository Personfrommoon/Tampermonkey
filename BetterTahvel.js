
// ==UserScript==
// @name         BetterTahvel
// @namespace    http://tampermonkey.net/
// @version      2024--09-25
// @description  Tahvel remake
// @author       Kristofer Valk
// @match        https://tahvel.edu.ee/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.ee
// @grant        none
// ==/UserScript==

const UPDATE_COOLDOWN = 100;
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

(function () {
	"use strict";

	function getCookie(name) {
		const dc = document.cookie;
		const prefix = name + "=";
		let begin = dc.indexOf("; " + prefix);
		let end;

		if (begin == -1) {
			begin = dc.indexOf(prefix);
			if (begin != 0) return null;
		} else {
			begin += 2;
			end = document.cookie.indexOf(";", begin);

			if (end == -1) {
				end = dc.length;
			}
		}

		return decodeURI(dc.substring(begin + prefix.length, end));
	}

	function Login() {
		var myCookie = getCookie("XSRF-TOKEN");

		if (myCookie != null) {
			console.log("Logged In");

			let updateQueued = false;
			const observer = new MutationObserver(() => {
				if (updateQueued) return;
				updateQueued = true;

				setTimeout(() => {
					updateQueued = false;
					NavBar();
                    colorGrades();
				}, UPDATE_COOLDOWN);
			});

			var config = { attributes: true, childList: true, subtree: true };
			observer.observe(document.body, config);

			return;
		}

		console.log("Not Logged In");
		document.querySelector("body").remove();
		window.location.href = "https://tahvel.edu.ee/hois_back/haridLogin";
		return;
	}



	function NavBar() {
		const sideNav = document.getElementById("sidenav-list");

		if (sideNav.children[10] === undefined) return;
		console.log("Navbar");

		sideNav.children[10].remove();
		sideNav.children[9].remove();
		sideNav.children[7].remove();
		sideNav.children[6].remove();
		sideNav.children[5].remove();
		sideNav.children[4].remove();

		let newSidebarButton = sideNav.children[4].children[0].children[0];
		newSidebarButton.innerHTML = newSidebarButton.innerHTML.replace(
			"Teated",
			"Tunnitöö"
		);
		newSidebarButton.setAttribute("href", "#/students/study");

		newSidebarButton = sideNav.children[4];
		newSidebarButton.remove();
		sideNav.insertBefore(newSidebarButton, sideNav.children[2]);

		let homeworkButton = sideNav.children[3].children[0].children[0];
		homeworkButton.innerHTML = homeworkButton.innerHTML.replace(
			"Ülesanded",
			"Kodutööd"
		);

		document.getElementById("repr-link-wrapper").remove();
		document.getElementById("site-sidenav-wrapper").style.background =
			"transparent";
	}

    function colorGrades() {
        let grades = document.querySelectorAll("span.layout-align-start-center.layout-row > span")
        let bad = ["2", "MA", "1", "X"]

        for (let i = 0; i < grades.length; i++) {
            const grade = grades[i];
            if (bad.includes(grade.textContent)) {
                grade.style.fontWeight = 'bold';
                grade.style.color = '#FF0000';
            }
        }
    }
    document.querySelector("div").style.backgroundImage = "url('https://media.istockphoto.com/id/1148091793/photo/technology-abstract.jpg?s=2048x2048&w=is&k=20&c=YOwK9T0qMskR1w7surFGHVHjd7USEUPWi9gTQKg1qy8=')"


	setTimeout(Login, 100);
})();
