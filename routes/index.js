let express = require('express');
let router = express.Router();
require('dotenv').config();

const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;

const dbClient = new MongoClient(uri, { useUnifiedTopology: true });

async function dbConnect() {
	await dbClient.connect();
	filesDB = dbClient.db("files");
	videoCollection = filesDB.collection("video");
	fotoCollection = filesDB.collection("foto");
	musicaCollection = filesDB.collection("musica");
	originalsCollection = filesDB.collection("originals");
	storyCollection = filesDB.collection("stories");
	btsCollection = filesDB.collection("backstage");
	visiteCollection = filesDB.collection("visite");
}
let filesDB, videoCollection, fotoCollection, musicaCollection, originalsCollection, storyCollection, btsCollection, visiteCollection;
dbConnect().then(msg => { console.log("Connessione riuscita!") }).catch(err => { console.log("Errore connessione! " + err) });

function rangeList() {
	let ans = [];
	for (let i = 0; i <= 100; i++) {
		ans.push(i);
	}
	return ans;
}

async function updateVisits(n) {
	numberOfVisits = n + 1;
	const filter = { page: "index" };
	let update = {
		$set: {
			page: "index",
			visite: numberOfVisits
		}
	}
	let options = { upsert: true };
	await visiteCollection.updateOne(filter, update, options);
}

/* GET home page. */
router.get('/', function (req, res, next) {
	originalsCollection.countDocuments(function (error, numero) {
		if (error) {
			console.log(error);
		} else {
			originalsCollection.find({ position: numero }).toArray(function (error, videos) {
				if (error) {
					console.log(error);
				} else {
					visiteCollection.find({ page: "index" }).toArray(function (error, numberOfVisits) {
						if (error) {
							console.log(error);
						} else {
							updateVisits(numberOfVisits[0].visite);
							res.render('index', { title: '96 Studio', video: videos[0] });
						}
					});
				}
			});
		}
	})

});

/* GET Chi Siamo. */
router.get('/chi-siamo', function (req, res, next) {
	res.render('chi_siamo', { title: '96 Studio | Chi Siamo' });
});

/* GET Fotografia. */
// let photoCategories = ["Commercial", "Food", "Ritratti", "Paesaggi", "Progetti"];
router.get('/fotografia', function (req, res, next) {
	res.render('fotografia', { title: '96 Studio | Fotografia' });
});
router.get('/fotografia/category', function (req, res, next) {
	fotoCollection.find({ category: req.query.category }).toArray(function (error, photos) {
		if (error) {
			console.log(error);
		} else {
			res.render('photo-categories', { title: '96 Studio | Fotografia', photos, size: rangeList(), length: photos.length });
		}
	});
});
router.get('/fotografia/progetti', function (req, res, next) {
	res.render('progetti-categories', { title: '96 Studio | Fotografia' });
});
router.get('/fotografia/progetti/work', function (req, res, next) {
	fotoCollection.find({ titolo: req.query.titolo }).toArray(function (error, photos) {
		if (error) {
			console.log(error);
		} else {
			res.render('progetti-single', { title: '96 Studio | Fotografia', photos, size: rangeList(), length: photos.length });
		}
	});
})


/* GET Videomaking. */
router.get('/videomaking', function (req, res, next) {
	videoCollection.find({}).toArray(function (error, videos) {
		if (error) {
			console.log(error);
		} else {
			res.render('videomaking', { title: '96 Studio | Videomaking', videos, size: rangeList() });
		}
	});
});
router.get('/videomaking/work', function (req, res, next) {
	videoCollection.find({ titolo: req.query.titolo }).toArray(function (error, videos) {
		if (error) {
			console.log(error);
		} else {
			btsCollection.find({ titolo: req.query.titolo, tipo: "Foto" }).toArray(function (error, photoBts) {
				if (error) {
					console.log(error);
				} else {
					btsCollection.find({ titolo: req.query.titolo, tipo: "Video" }).toArray(function (error, videoBts) {
						if (error) {
							console.log(error);
						} else {
							res.render('video-single', { title: '96 Studio | Videomaking', video: videos[0], photoBts, videoBts, size: rangeList() });
						}
					});
				}
			});
		}
	});
});
router.get('/videomaking/category', function (req, res, next) {
	videoCollection.find({ category: req.query.category }).toArray(function (error, videos) {
		if (error) {
			console.log(error);
		} else {
			res.render('video-category', { title: '96 Studio | Videomaking', videos, size: rangeList(), categoria: req.query.category });
		}
	});
});

/* GET Musica. */
router.get('/musica', function (req, res, next) {
	musicaCollection.find({}).toArray(function (error, musics) {
		if (error) {
			console.log(error);
		} else {
			res.render('musica', { title: '96 Studio | Musica', musics, size: rangeList() });
		}
	});
});
router.get('/musica/category', function (req, res, next) {
	musicaCollection.find({ category: req.query.category }).toArray(function (error, musics) {
		if (error) {
			console.log(error);
		} else {
			res.render('music-category', { title: '96 Studio | Musica', musics, size: rangeList(), categoria: req.query.category });
		}
	});
});

/* GET Prod Originali. */
router.get('/produzioni-originali', function (req, res, next) {
	originalsCollection.find({}).toArray(function (error, originals) {
		if (error) {
			console.log(error);
		} else {
			res.render('originals', { title: '96 Studio | Produzioni Originali', originals, size: rangeList() });
		}
	});
});
router.get('/produzioni-originali/work', function (req, res, next) {
	originalsCollection.find({ titolo: req.query.titolo }).toArray(function (error, originals) {
		if (error) {
			console.log(error);
		} else {
			btsCollection.find({ titolo: req.query.titolo, tipo: "Foto" }).toArray(function (error, photoBts) {
				if (error) {
					console.log(error);
				} else {
					btsCollection.find({ titolo: req.query.titolo, tipo: "Video" }).toArray(function (error, videoBts) {
						if (error) {
							console.log(error);
						} else {
							res.render('original-single', { title: '96 Studio | Produzioni Originali', original: originals[0], photoBts, videoBts, size: rangeList() });
						}
					});
				}
			});
		}
	});
});
router.get('/produzioni-originali/category', function (req, res, next) {
	originalsCollection.find({ category: req.query.category }).toArray(function (error, originals) {
		if (error) {
			console.log(error);
		} else {
			res.render('originals-category', { title: '96 Studio | Produzioni Originali', originals, size: rangeList(), categoria: req.query.category });
		}
	});
});

/* GET Storie. */
router.get('/storie', function (req, res, next) {
	storyCollection.find({}).toArray(function (error, stories) {
		if (error) {
			console.log(error);
		} else {
			res.render('stories', { title: '96 Studio | Storie', stories, size: rangeList() });
		}
	});
});
router.get('/storie/text', function (req, res, next) {
	storyCollection.find({ titolo: req.query.titolo }).toArray(function (error, stories) {
		if (error) {
			console.log(error);
		} else {
			btsCollection.find({ titolo: req.query.titolo, tipo: "Foto" }).toArray(function (error, photoBts) {
				if (error) {
					console.log(error);
				} else {
					btsCollection.find({ titolo: req.query.titolo, tipo: "Video" }).toArray(function (error, videoBts) {
						if (error) {
							console.log(error);
						} else {
							res.render('story-single', { title: '96 Studio | Storie', story: stories[0], photoBts, videoBts, size: rangeList() });
						}
					});
				}
			});
		}
	});
});
router.get('/storie/category', function (req, res, next) {
	storyCollection.find({ category: req.query.category }).toArray(function (error, stories) {
		if (error) {
			console.log(error);
		} else {
			res.render('story-category', { title: '96 Studio | Storie', stories, size: rangeList(), categoria: req.query.category });
		}
	});
});


/* GET Members. 
router.get('/chi-siamo/edoardo', function (req, res, next) {
	res.render('coming-soon', { title: '96 Studio | Edoardo' });
});
router.get('/chi-siamo/christian', function (req, res, next) {
	res.render('coming-soon', { title: '96 Studio | Christian' });
});
router.get('/chi-siamo/tamer', function (req, res, next) {
	res.render('coming-soon', { title: '96 Studio | Tamer' });
});
router.get('/chi-siamo/lorenzo', function (req, res, next) {
	res.render('coming-soon', { title: '96 Studio | Lorenzo' });
});
router.get('/chi-siamo/francesco', function (req, res, next) {
	res.render('coming-soon', { title: '96 Studio | Francesco' });
});
*/
module.exports = router;
