const router = require("express").Router();
router.route("/").get((req, res) => {
    res.render("verify", {});
})

router.route("/:captcharesponse").post(async (req, res) => {
    console.log("tst")
    const captchaVerified = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=6Lea7XwaAAAAAHuLwVPwMynFGecPiXjDmE_-HIym&response=${req.params.captcharesponse}`, {
        method: "POST"
    }).then(_res => _res.json())
    console.log(captchaVerified);
});

module.exports = router;