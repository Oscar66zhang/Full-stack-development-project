const Router = require('@koa/router');
const router = new Router();
const { verifyToken } = require('../../util/jwt');
const c = require('../../controllers/dashBoard/dashboardController');

router.get('/dashboard/getReportData', verifyToken(), c.getReportData);
router.get('/dashboard/getLineData', verifyToken(), c.getLineData);
router.get('/dashboard/getPieCityData', verifyToken(), c.getPieCityData);
router.get('/dashboard/getPieAgeData', verifyToken(), c.getPieAgeData);
router.get('/dashboard/getRadarData', verifyToken(), c.getRadarData);

module.exports = router;
