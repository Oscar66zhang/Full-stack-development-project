const Router = require('@koa/router');
const router = new Router();
const { verifyToken } = require('../../util/jwt');
const c = require('../../controllers/dashBoard/dashboardController');

router.get('/dashboard/getReportData', verifyToken(false), c.getReportData);
router.get('/dashboard/getLineData', verifyToken(false), c.getLineData);
router.get('/dashboard/getPieCityData', verifyToken(false), c.getPieCityData);
router.get('/dashboard/getPieAgeData', verifyToken(false), c.getPieAgeData);
router.get('/dashboard/getRadarData', verifyToken(false), c.getRadarData);

module.exports = router;
