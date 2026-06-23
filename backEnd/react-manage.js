/*
 Navicat Premium Dump Script

 Source Server         : localhost
 Source Server Type    : MongoDB
 Source Server Version : 80004 (8.0.4)
 Source Host           : localhost:27017
 Source Schema         : react-manage

 Target Server Type    : MongoDB
 Target Server Version : 80004 (8.0.4)
 File Encoding         : 65001

 Date: 23/06/2026 22:19:20
*/


// ----------------------------
// Collection structure for roles
// ----------------------------
db.getCollection("roles").drop();
db.createCollection("roles");

// ----------------------------
// Documents of roles
// ----------------------------

// ----------------------------
// Collection structure for users
// ----------------------------
db.getCollection("users").drop();
db.createCollection("users");

// ----------------------------
// Documents of users
// ----------------------------
db.getCollection("users").insert([ {
    _id: "63bc321b300732c27697f203",
    createId: 0,
    deptId: "63bc31ae300732c27697f1f4",
    deptName: "测试",
    role: 1,
    roleList: "63bc3187300732c27697f1e6",
    state: 1,
    userEmail: "lucy@mars.com",
    userId: 1000017,
    userImg: "https://zos.alipayobjects.com/rmsportal/xxxx.jpg",
    userName: "Test"
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("6a37dc2e72a9ce33357bcfbc"),
    userName: "Jake",
    userEmail: "Jake@example.com",
    userImg: "https://example.com/avatar.jpg",
    role: Int32("1"),
    roleList: "admin",
    deptId: "dept001",
    deptName: "开发",
    state: Int32("1"),
    createAt: ISODate("2026-06-21T12:42:20.497Z"),
    updateAt: ISODate("2026-06-21T12:42:20.497Z"),
    __v: Int32("0")
} ]);
