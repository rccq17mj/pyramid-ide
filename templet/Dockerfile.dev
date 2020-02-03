### 打包步骤
# 拉取基础镜像
FROM node:alpine as builder

# 设置用户
USER root

# 拷贝依赖文件
COPY package.json /app/
COPY yarn.lock /app/

# 设置工作目录
WORKDIR /app/

# 只安装 dependencies 忽略 devDependencies
# RUN npm install --production
RUN yarn

# 拷贝源代码
COPY ./ ./
RUN yarn build

### 运行步骤
# 选择更小体积的基础镜像
FROM nginx:alpine

# 拷贝nginx配置文件
COPY /docker/nginx.conf /etc/nginx/conf.d/default.conf

# 拷贝生成的打包文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]

