const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/react-manage')
    .then(() => {
        console.log('✅ 数据库连接成功');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ 数据库连接失败:', err);
        process.exit(1);
    })