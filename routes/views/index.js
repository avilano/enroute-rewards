var express = require('express'),
		router = new express.Router(),
		// logger = require(`${base_path}/logger`)('routes/views'),
		config = require(`${base_path}/config`),
		db = require(`${base_path}/db`);

function isAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/auth/slack');
}

async function showConfiguration(req, res) {
	res.render('configuration', {
		app: {
			title: config.get('title')
		},
		config: {
			app: await config.getApp(),
			local: await config.getAll(),
			rewards: await config.getRewards()
		},
		user: {
			isAdmin: config.isAdmin(req.user)
		},
		view: {
			title: 'Configuration',
			url: 'configuration'
		}
	});
}

async function showLeaderboard(req, res) {
	res.render('leaderboard', {
		app: {
			title: config.get('title')
		},
		config: {
			app: await config.getApp(),
			local: await config.getAll()
		},
		leaderboard: await db.getUsers(),
		user: {
			isAdmin: config.isAdmin(req.user)
		},
		view: {
			title: 'Leaderboard',
			url: 'leaderboard'
		}
	});
}

router.get('/', isAuthenticated, async (req, res) => {
	if (config.isAdmin(req.user)) {
		await showConfiguration(req, res);
	} else {
		await showLeaderboard(req, res);
	}
});

router.get('/configuration/', isAuthenticated, async (req, res) => {
	if (config.isAdmin(req.user)) {
		await showConfiguration(req, res);
	} else {
		res.redirect('/');
	}
});

router.get('/leaderboard/', isAuthenticated, async (req, res) => {
	await showLeaderboard(req, res);
});

router.get('/logout/', function(req, res) {
	req.session.destroy(function() {
		req.logOut();
		res.status(200);
		res.redirect('/');
	});
});

module.exports = router;
