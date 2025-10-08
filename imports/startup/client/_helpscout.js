// biome-ignore-all lint: keeping this code as is for legacy reasons
!((e, t, n) => {
	function a() {
		var e = t.getElementsByTagName("script")[0],
			n = t.createElement("script");
		(n.type = "text/javascript"),
			(n.async = !0),
			(n.src = "https://beacon-v2.helpscout.net"),
			e.parentNode.insertBefore(n, e);
	}

	if (
		((e.Beacon = n =
			(t, n, a) => {
				e.Beacon.readyQueue.push({ method: t, options: n, data: a });
			}),
		(n.readyQueue = []),
		"complete" === t.readyState)
	)
		return a();
})(window, document, window.Beacon || (() => {}));

Beacon("config", {
	docsEnabled: false,
	messagingEnabled: true,
	enableFabAnimation: false,
	color: "#003778",
	mode: "neutral",
	chatEnabled: false,
	display: {
		style: "manual",
	},
});
