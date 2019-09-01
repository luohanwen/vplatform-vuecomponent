/**
 * @author xujw 2018-9-13 10:12:02
 * 执行npm instll命令前清除不存在的本地插件依赖
 */

console.log('开始安装node插件依赖，请稍后...');

const fs = require('fs');
const path = require('path');
let packageJsonPath = path.resolve(__dirname, '../package.json');
let packlockJsonPath = path.resolve(__dirname, '../package-lock.json');
try {
    let packageJson = require(packageJsonPath);
    let packlockJson = require(packlockJsonPath);
    let devDependencies = packageJson.devDependencies;
    let notExistPlugins = [];
    // 找出当前项目不存在的本地插件，然后在package.json和package-lock.json中移除依赖信息
    for (const key in devDependencies) {
        if (devDependencies[key].startsWith('file:')) {
            let pluginPath = devDependencies[key].replace('file:', '');
            if (!path.isAbsolute(pluginPath)) {
                pluginPath = path.resolve(__dirname, '../', pluginPath);
            }
            if (!fs.existsSync(pluginPath)) {
                notExistPlugins.push(key);
            }
        }
    }
    if (notExistPlugins.length > 0) {
        let packlockDeps = packlockJson.dependencies;
        notExistPlugins.forEach(plugin => {
            devDependencies[plugin] = undefined;
            packlockDeps[plugin] = undefined;
        });
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, '\t'));
        fs.writeFileSync(packlockJsonPath, JSON.stringify(packlockJson, null, '\t'));
    }
} catch (err) {
    return;
}