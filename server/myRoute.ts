import { WebApp } from "meteor/webapp";

WebApp.connectHandlers.use("/greet", (req, res) => {
	const name = req.query.name || "visiteur";
	res.setHeader("Content-Type", "text/html");
	res.end(`<html><body><h1>Salut ${name}</h1></body></html>`);
});
