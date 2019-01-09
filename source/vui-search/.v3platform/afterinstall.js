/**
 * npm install 命令执行之后执行,自动安装v3插件依赖
 */
try {
    const installer = require('v3-installer');
    installer._install(undefined, true);
} catch (err) {
    return;
}