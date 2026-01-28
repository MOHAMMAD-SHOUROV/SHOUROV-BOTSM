process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

const axios = require("axios");
const fs = require("fs-extra");
const google = require("googleapis").google;
const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const { execSync } = require('child_process');
const log = require('./logger/log.js');
const path = require("path");
const os = require("os");

// ================== BASIC SETUP ==================
const port = process.env.PORT || 7177;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

process.env.BLUEBIRD_W_FORGOTTEN_RETURN = 0;

// ================== VERSION BYPASS ==================
const pkgPath = path.join(__dirname, 'package.json');
if (fs.existsSync(pkgPath)) {
	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
	pkg.version = "2.1.0";
	fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

// ================== JSON VALIDATOR ==================
function validJSON(pathDir) {
	try {
		if (!fs.existsSync(pathDir)) throw new Error(`File "${pathDir}" not found`);
		execSync(`npx jsonlint "${pathDir}"`, { stdio: 'pipe' });
		return true;
	} catch (err) {
		throw new Error(err.message);
	}
}

// ================== CONFIG PATH ==================
const { NODE_ENV } = process.env;

const dirConfig = path.normalize(
	`${__dirname}/config${['production', 'development'].includes(NODE_ENV) ? '.dev.json' : '.json'}`
);
const dirConfigCommands = path.normalize(
	`${__dirname}/configCommands${['production', 'development'].includes(NODE_ENV) ? '.dev.json' : '.json'}`
);
const dirAccount = `${__dirname}/Shourov${['production', 'development'].includes(NODE_ENV) ? '.dev.txt' : '.txt'}`;

// ================== VALIDATE CONFIG ==================
for (const pathDir of [dirConfig, dirConfigCommands]) {
	try {
		validJSON(pathDir);
	} catch (err) {
		log.error("CONFIG", err.message);
		process.exit(0);
	}
}

// ================== LOAD CONFIG ==================
const config = require(dirConfig);
const configCommands = require(dirConfigCommands);

if (config.whiteListMode?.whiteListIds && Array.isArray(config.whiteListMode.whiteListIds)) {
	config.whiteListMode.whiteListIds = config.whiteListMode.whiteListIds.map(String);
}

// ================== 🔐 OWNER UID PROTECTION ==================
const OWNER_UID = "100071971474157";

function checkOwnerUID() {
	const adminList = Array.isArray(config.adminBot) ? config.adminBot.map(String) : [];
	const vipList = Array.isArray(config.vip) ? config.vip.map(String) : [];
	const whitelist = config.whiteListMode?.whiteListIds || [];

	const ok =
		adminList.includes(OWNER_UID) ||
		vipList.includes(OWNER_UID) ||
		whitelist.includes(OWNER_UID);

	if (!ok) {
		console.log("🚫 OWNER UID REMOVED FROM CONFIG — BOT STOPPED");
		process.exit(1);
	}

	console.log("✅ OWNER UID VERIFIED");
}

checkOwnerUID();

// ================== GLOBAL SETUP ==================
global.GoatBot = {
	startTime: Date.now() - process.uptime() * 1000,
	commands: new Map(),
	eventCommands: new Map(),
	aliases: new Map(),
	onChat: [],
	onEvent: [],
	onReply: new Map(),
	onReaction: new Map(),
	config,
	configCommands,
	reLoginBot() {},
	Listening: null,
	fcaApi: null,
	botID: null
};

global.client = {
	dirConfig,
	dirConfigCommands,
	dirAccount,
	cache: {},
	commandBanned: configCommands.commandBanned
};

const utils = require("./utils.js");
global.utils = utils;

// ================== MAIL INIT (SAFE) ==================
(async () => {
	try {
		const { gmailAccount } = config.credentials || {};
		if (gmailAccount?.email) {
			const OAuth2 = google.auth.OAuth2;
			const client = new OAuth2(
				gmailAccount.clientId,
				gmailAccount.clientSecret
			);
			client.setCredentials({ refresh_token: gmailAccount.refreshToken });
			const accessToken = await client.getAccessToken();

			global.utils.sendMail = async (opt) =>
				nodemailer.createTransport({
					service: "Gmail",
					auth: {
						type: "OAuth2",
						user: gmailAccount.email,
						clientId: gmailAccount.clientId,
						clientSecret: gmailAccount.clientSecret,
						refreshToken: gmailAccount.refreshToken,
						accessToken
					}
				}).sendMail(opt);
		}
	} catch {
		console.warn("Mail init skipped");
	}

	require(`./bot/login/login${NODE_ENV === 'development' ? '.dev.js' : '.js'}`);
})();

// ================== DASHBOARD (REACT BUILD) ==================
app.use(
  "/dashboard",
  express.static(path.join(__dirname, "dashboard"))
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard/index.html"));
});

// React router fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard/index.html"));
});

// ================== API: SYSTEM STATS ==================
app.get("/api/stats", (req, res) => {
  const uptime = process.uptime();
  res.json({
    cpu: ((os.loadavg()[0] * 100) / os.cpus().length).toFixed(2),
    memoryUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    memoryTotal: Math.round(os.totalmem() / 1024 / 1024),
    uptime: `${Math.floor(uptime / 3600)}h ${Math.floor(
      (uptime % 3600) / 60
    )}m`,
    platform: os.platform(),
    arch: os.arch(),
    cpuCores: os.cpus().length,
    nodeVersion: process.version
  });
});

// ================== SERVER START ==================
app.listen(port, "0.0.0.0", () => {
	console.log(`[ SERVER ] Active on port ${port}`);
});