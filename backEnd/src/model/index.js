const mongoose = require("mongoose");

const { mongoPath } = require("../config/config.default");

async function main() {
  await mongoose.connect(mongoPath);
}

main()
  .then((res) => {
    console.log("mongoDB 连接成功");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  //用户模块
  User: mongoose.model("User", require("./systmeManage/userModel")),
  Role: mongoose.model("Role", require("./systmeManage/roleModel")),
  Dept: mongoose.model("Dept", require("./systmeManage/deptModel")),
};
