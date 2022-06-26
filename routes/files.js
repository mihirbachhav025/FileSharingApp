const router = require("express-promise-router")();
const fileContoller  = require('../controllers/files');
const upload = require('../routeHelpers/routeHelpers')
router.route("/files").post(upload,fileContoller.postFile);
router.route("/files/:uuid").get(fileContoller.getFileDetails);
router.route("/files/download/:uuid").get(fileContoller.getFile);
router.route("/files/send").post(fileContoller.sendEmail);

module.exports = router;
