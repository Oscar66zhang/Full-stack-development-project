/*
 Navicat Premium Dump Script

 Source Server         : localhost27017
 Source Server Type    : MongoDB
 Source Server Version : 80304 (8.3.4)
 Source Host           : localhost:27017
 Source Schema         : react-manage

 Target Server Type    : MongoDB
 Target Server Version : 80304 (8.3.4)
 File Encoding         : 65001

 Date: 12/08/2026 17:32:33
*/


// ----------------------------
// Collection structure for depts
// ----------------------------
db.getCollection("depts").drop();
db.createCollection("depts");

// ----------------------------
// Documents of depts
// ----------------------------
db.getCollection("depts").insert([ {
    _id: "dept_root_001",
    deptName: "公司总部",
    parentId: "0",
    userName: "admin",
    createTime: "2025-01-01 00:00:00",
    updateTime: "2025-04-21 12:00:00"
} ]);
db.getCollection("depts").insert([ {
    _id: "dept_001",
    deptName: "技术部",
    parentId: "dept_root_001",
    userName: "zhangsan",
    createTime: "2025-01-02 00:00:00",
    updateTime: "2025-04-21 12:00:00"
} ]);
db.getCollection("depts").insert([ {
    _id: "dept_001_01",
    deptName: "前端组",
    parentId: "dept_001",
    userName: "lisi",
    createTime: "2025-01-03 00:00:00",
    updateTime: "2025-04-21 12:00:00"
} ]);
db.getCollection("depts").insert([ {
    _id: "dept_001_02",
    deptName: "后端组",
    parentId: "dept_001",
    userName: "wangwu",
    createTime: "2025-01-03 00:00:00",
    updateTime: "2025-04-21 12:00:00"
} ]);
db.getCollection("depts").insert([ {
    _id: "dept_002",
    deptName: "产品部",
    parentId: "dept_root_001",
    userName: "zhaoliu",
    createTime: "2025-01-02 00:00:00",
    updateTime: "2025-04-21 12:00:00"
} ]);

// ----------------------------
// Collection structure for driverdists
// ----------------------------
db.getCollection("driverdists").drop();
db.createCollection("driverdists");
db.getCollection("driverdists").createIndex({
    id: Int32("1")
}, {
    name: "id_1",
    unique: true
});

// ----------------------------
// Documents of driverdists
// ----------------------------

// ----------------------------
// Collection structure for driverlists
// ----------------------------
db.getCollection("driverlists").drop();
db.createCollection("driverlists");
db.getCollection("driverlists").createIndex({
    driverId: Int32("1")
}, {
    name: "driverId_1",
    unique: true
});

// ----------------------------
// Documents of driverlists
// ----------------------------
db.getCollection("driverlists").insert([ {
    _id: ObjectId("6a4c91ae3dcb5932115c8a26"),
    driverName: "Tom",
    driverId: Int32("123"),
    driverPhone: "15612318891",
    cityName: "北京",
    grade: true,
    driverLevel: Int32("1"),
    accountStatus: Int32("0"),
    carNo: "A32789",
    vehicleBrand: "大众",
    vehicleName: "经济型",
    onlineTime: Int32("0"),
    driverAmount: Int32("0"),
    rating: Int32("5"),
    driverScore: Int32("100"),
    pushOrderCount: Int32("0"),
    orderCompleteCount: Int32("9"),
    createAt: ISODate("2026-07-07T02:36:26.402Z"),
    updateAt: ISODate("2026-07-07T02:36:26.402Z"),
    createTime: ISODate("2026-07-07T05:42:06.785Z"),
    __v: Int32("0")
} ]);
db.getCollection("driverlists").insert([ {
    _id: ObjectId("6a4ca2bcd0d67af5a7d77cd4"),
    driverName: "Jake",
    driverId: Int32("23"),
    driverPhone: "15612318892",
    cityName: "北京",
    grade: true,
    driverLevel: Int32("1"),
    accountStatus: Int32("0"),
    carNo: "A32782",
    vehicleBrand: "大众",
    vehicleName: "经济型",
    onlineTime: Int32("0"),
    driverAmount: Int32("0"),
    rating: Int32("5"),
    driverScore: Int32("100"),
    pushOrderCount: Int32("0"),
    orderCompleteCount: Int32("0"),
    createAt: ISODate("2026-07-07T06:54:29.986Z"),
    updateAt: ISODate("2026-07-07T06:54:29.986Z"),
    createTime: ISODate("2026-07-07T06:54:52.659Z"),
    __v: Int32("0")
} ]);
db.getCollection("driverlists").insert([ {
    _id: ObjectId("6a4da3f8d5da750fbb47d91f"),
    driverName: "Mike",
    driverId: Int32("124544"),
    driverPhone: "15612318892",
    cityName: "北京",
    grade: false,
    driverLevel: Int32("1"),
    accountStatus: Int32("0"),
    carNo: "A32782",
    vehicleBrand: "大众",
    vehicleName: "经济型",
    onlineTime: Int32("0"),
    driverAmount: Int32("0"),
    rating: Int32("5"),
    driverScore: Int32("100"),
    pushOrderCount: Int32("0"),
    age: Int32("30"),
    orderCompleteCount: Int32("0"),
    createAt: ISODate("2026-07-08T00:54:36.634Z"),
    updateAt: ISODate("2026-07-08T00:54:36.634Z"),
    createTime: ISODate("2026-07-08T01:12:24.846Z"),
    __v: Int32("0")
} ]);

// ----------------------------
// Collection structure for menus
// ----------------------------
db.getCollection("menus").drop();
db.createCollection("menus");

// ----------------------------
// Documents of menus
// ----------------------------
db.getCollection("menus").insert([ {
    _id: ObjectId("660000000000000000000001"),
    menuName: "工作台",
    icon: "DashboardOutlined",
    menuType: 1,
    menuState: 1,
    path: "/dashboard",
    component: "/dashboard",
    parentId: "",
    createTime: ISODate("2026-07-01T07:17:36.466Z")
} ]);
db.getCollection("menus").insert([ {
    _id: ObjectId("660000000000000000000002"),
    menuName: "系统管理",
    icon: "SettingOutlined",
    menuType: 1,
    menuState: 1,
    path: "/system",
    parentId: "",
    createTime: ISODate("2026-07-01T07:17:36.466Z")
} ]);
db.getCollection("menus").insert([ {
    _id: ObjectId("660000000000000000000003"),
    menuName: "用户管理",
    icon: "UserOutlined",
    menuType: 1,
    menuState: 1,
    path: "/system/user",
    component: "/systemManage/user",
    parentId: "660000000000000000000002",
    createTime: ISODate("2026-07-01T07:17:36.466Z")
} ]);
db.getCollection("menus").insert([ {
    _id: ObjectId("660000000000000000000005"),
    menuName: "部门管理",
    icon: "ApartmentOutlined",
    menuType: 1,
    menuState: 1,
    path: "/system/dept",
    component: "/systemManage/dept",
    parentId: "660000000000000000000002",
    createTime: ISODate("2026-07-01T07:17:36.466Z")
} ]);
db.getCollection("menus").insert([ {
    _id: ObjectId("660000000000000000000006"),
    menuName: "菜单管理",
    icon: "MenuOutlined",
    menuType: 1,
    menuState: 1,
    path: "/system/menu",
    component: "/systemManage/menu",
    parentId: "660000000000000000000002",
    createTime: ISODate("2026-07-01T07:17:36.466Z")
} ]);
db.getCollection("menus").insert([ {
    _id: ObjectId("660000000000000000000007"),
    menuName: "角色管理",
    icon: "TeamOutlined",
    menuType: 1,
    menuState: 1,
    path: "/system/role",
    component: "/systemManage/role",
    parentId: "660000000000000000000002",
    createTime: ISODate("2026-07-01T07:17:36.466Z")
} ]);
db.getCollection("menus").insert([ {
    _id: ObjectId("660000000000000000000008"),
    menuName: "订单管理",
    icon: "ShoppingCartOutlined",
    menuType: 1,
    menuState: 1,
    path: "/order",
    parentId: "",
    createTime: ISODate("2026-07-01T07:17:36.466Z")
} ]);
db.getCollection("menus").insert([ {
    _id: ObjectId("660000000000000000000009"),
    menuName: "订单列表",
    icon: "UnorderedListOutlined",
    menuType: 1,
    menuState: 1,
    path: "/order/list",
    component: "/order/list",
    parentId: "660000000000000000000008",
    createTime: ISODate("2026-07-01T07:17:36.466Z")
} ]);
db.getCollection("menus").insert([ {
    _id: ObjectId("660000000000000000000010"),
    menuName: "新增订单",
    menuType: 2,
    menuState: 1,
    menuCode: "order:create",
    parentId: "660000000000000000000009",
    createTime: ISODate("2026-07-01T07:17:36.466Z")
} ]);
db.getCollection("menus").insert([ {
    _id: ObjectId("660000000000000000000011"),
    menuName: "司机分布",
    icon: "EnvironmentOutlined",
    menuType: 1,
    menuState: 1,
    path: "/order/map",
    component: "/order/map",
    parentId: "660000000000000000000008",
    createTime: ISODate("2026-07-01T07:17:36.466Z")
} ]);
db.getCollection("menus").insert([ {
    _id: ObjectId("660000000000000000000012"),
    menuName: "司机列表",
    icon: "IdcardOutlined",
    menuType: 1,
    menuState: 1,
    path: "/order/list",
    component: "/order/list",
    parentId: "660000000000000000000008",
    createTime: ISODate("2026-07-01T07:17:36.466Z")
} ]);

// ----------------------------
// Collection structure for orderlists
// ----------------------------
db.getCollection("orderlists").drop();
db.createCollection("orderlists");
db.getCollection("orderlists").createIndex({
    orderId: Int32("1")
}, {
    name: "orderId_1",
    unique: true
});

// ----------------------------
// Documents of orderlists
// ----------------------------
db.getCollection("orderlists").insert([ {
    _id: ObjectId("6a4b68b3c17518eabed20579"),
    cityName: "上海",
    userName: "Jake",
    mobile: 16712319811,
    startAddress: "上海虹桥火车站",
    endAddress: "东方明珠广播电视塔",
    orderAmount: Int32("111"),
    userPayAmount: Int32("100"),
    driverAmount: Int32("100"),
    payType: Int32("1"),
    driverName: "Mike",
    vehicleName: "经济型",
    state: Int32("1"),
    useTime: "2026-07-01T00:00:00.000Z",
    endTime: "2026-07-01T01:00:00.000Z",
    route: [
        {
            lng: "121.442794",
            lat: "31.236181"
        },
        {
            lng: "121.446129",
            lat: "31.237228"
        }
    ],
    remark: "",
    createAt: ISODate("2026-07-06T08:30:51.187Z"),
    updateAt: ISODate("2026-07-06T08:43:28.533Z"),
    createTime: ISODate("2026-07-06T08:34:59.224Z"),
    orderId: "6a4b68b3c17518eabed20579",
    __v: Int32("0")
} ]);

// ----------------------------
// Collection structure for roles
// ----------------------------
db.getCollection("roles").drop();
db.createCollection("roles");

// ----------------------------
// Documents of roles
// ----------------------------
db.getCollection("roles").insert([ {
    _id: ObjectId("6a432e2461ed484f880ef481"),
    roleName: "系统管理员",
    remark: "拥有系统全部权限",
    permissionList: {
        checkedKeys: [
            "660000000000000000000004",
            "660000000000000000000010"
        ],
        halfCheckedKeys: [
            "660000000000000000000001",
            "660000000000000000000002",
            "660000000000000000000003",
            "660000000000000000000005",
            "660000000000000000000006",
            "660000000000000000000007",
            "660000000000000000000008",
            "660000000000000000000009",
            "660000000000000000000011",
            "660000000000000000000012"
        ]
    },
    createTime: ISODate("2026-06-30T02:47:00.294Z"),
    updateTime: ISODate("2026-06-30T02:47:00.294Z")
} ]);
db.getCollection("roles").insert([ {
    _id: ObjectId("6a432e2461ed484f880ef482"),
    roleName: "普通操作员",
    remark: "拥有基础业务操作权限",
    permissionList: {
        checkedKeys: [ ],
        halfCheckedKeys: [ ]
    },
    createTime: ISODate("2026-06-30T02:47:00.295Z"),
    updateTime: ISODate("2026-06-30T02:47:00.295Z")
} ]);

// ----------------------------
// Collection structure for users
// ----------------------------
db.getCollection("users").drop();
db.createCollection("users");

// ----------------------------
// Documents of users
// ----------------------------
db.getCollection("users").insert([ {
    _id: ObjectId("6a421d162b7167a9df009384"),
    userId: 1001,
    userName: "Mike",
    userEmail: "Mike@example.com",
    deptId: "dept002",
    state: 2,
    mobile: "13800000000",
    job: "后端工程师",
    role: 2,
    roleList: "admin",
    createId: 1001,
    deptName: "开发",
    userImg: "https://example.com/avatar.jpg",
    createAt: ISODate("2026-06-29T07:21:58.181Z"),
    updateAt: ISODate("2026-06-29T07:21:58.181Z"),
    password: "scrypt$b00955ff75d96c7d18e503a762a88e8b$1eadfa022cda48ccc0aeeb804192b6d04049888d66246d710e423cf47eb302a240255ff7f2430679bf750857a8bfdacfc70429969e14c8ee92e02ca8fcd72fd7"
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("6a4465c487761e7d5538fc41"),
    userId: Int32("1002"),
    userName: "1123",
    userEmail: "2546463919@qq.com",
    userImg: "blob:http://localhost:5174/54c836b7-0c49-4d90-b724-6f9c11d4629f",
    deptName: "dept_001_01",
    createAt: ISODate("2026-07-01T00:46:48.659Z"),
    updateAt: ISODate("2026-07-01T00:46:48.659Z"),
    __v: Int32("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("6a4dc21fd5da750fbb47d920"),
    userId: Int32("1003"),
    userName: "Jake",
    userEmail: "2546463913@qq.com",
    userImg: "",
    deptName: "dept_001_02",
    createAt: ISODate("2026-07-08T00:54:36.634Z"),
    updateAt: ISODate("2026-07-08T00:54:36.634Z"),
    __v: Int32("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("6a4dc22bd5da750fbb47d921"),
    userId: Int32("1004"),
    userName: "Jake",
    userEmail: "2546463912@qq.com",
    userImg: "",
    deptName: "dept_002",
    createAt: ISODate("2026-07-08T00:54:36.634Z"),
    updateAt: ISODate("2026-07-08T00:54:36.634Z"),
    __v: Int32("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("6a4dc234d5da750fbb47d922"),
    userId: Int32("1005"),
    userName: "mike",
    userEmail: "2546463923@qq.com",
    userImg: "",
    deptName: "dept_001_02",
    createAt: ISODate("2026-07-08T00:54:36.634Z"),
    updateAt: ISODate("2026-07-08T00:54:36.634Z"),
    __v: Int32("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("6a4dc241d5da750fbb47d923"),
    userId: Int32("1006"),
    userName: "Jake1",
    userEmail: "3546463913@qq.com",
    userImg: "",
    deptName: "dept_001_01",
    createAt: ISODate("2026-07-08T00:54:36.634Z"),
    updateAt: ISODate("2026-07-08T00:54:36.634Z"),
    __v: Int32("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("6a4dc24dd5da750fbb47d924"),
    userId: Int32("1007"),
    userName: "Jake",
    userEmail: "2546363913@qq.com",
    userImg: "",
    deptName: "dept_002",
    createAt: ISODate("2026-07-08T00:54:36.634Z"),
    updateAt: ISODate("2026-07-08T00:54:36.634Z"),
    __v: Int32("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("6a4dc257d5da750fbb47d925"),
    userId: Int32("1008"),
    userName: "Jerry",
    userEmail: "2246463913@qq.com",
    userImg: "",
    deptName: "dept_002",
    createAt: ISODate("2026-07-08T00:54:36.634Z"),
    updateAt: ISODate("2026-07-08T00:54:36.634Z"),
    __v: Int32("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("6a4dc266d5da750fbb47d926"),
    userId: Int32("1009"),
    userName: "Oadda",
    userEmail: "2532463913@qq.com",
    userImg: "",
    deptName: "dept_001_01",
    createAt: ISODate("2026-07-08T00:54:36.634Z"),
    updateAt: ISODate("2026-07-08T00:54:36.634Z"),
    __v: Int32("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("6a4dc39bd5da750fbb47d92b"),
    userId: Int32("1014"),
    userName: "12312",
    userEmail: "25464622913@qq.com",
    userImg: "",
    deptName: "dept_001_01",
    createAt: ISODate("2026-07-08T00:54:36.634Z"),
    updateAt: ISODate("2026-07-08T00:54:36.634Z"),
    __v: Int32("0")
} ]);
db.getCollection("users").insert([ {
    _id: ObjectId("6a7c3b982eec3f5d5d5ab762"),
    userId: Int32("1015"),
    userName: "admin",
    userEmail: "2546463232@qq.com",
    password: "scrypt$7f1aa3ac4bcac633d90d5f90610d42e5$75542b3b7452866ebe90bd6de78385d79d60e7896e83422b25b5ef5fd16333941dfd5691177eba3705c3cd8dee7dc4fd6c08910d4c2cdf901ef770367156b96a",
    role: Int32("2"),
    deptName: "默认部门",
    state: Int32("1"),
    createAt: ISODate("2026-08-12T09:19:23.511Z"),
    updateAt: ISODate("2026-08-12T09:19:23.511Z"),
    __v: Int32("0")
} ]);
