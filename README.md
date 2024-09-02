## 开发

号码管理平台项目前端项目

## 注意事项

推荐使用`nvm`管理node版本,项目开发为nodejs 16.5.0

```bash
nvm list

nvm install 16.5.0

nvm use 16.5.0

```

```bash
# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev
```

浏览器访问 http://localhost:8013

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```
