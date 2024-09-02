# loongnix
# FROM cr.loongnix.cn/library/nginx:1.23.1-alpine
# FROM registry.cn-hangzhou.aliyuncs.com/fxdom/loongnix-nginx:1.23.1-alpine

# x86
# FROM nginx:1.23.1-alpine
FROM registry.cn-hangzhou.aliyuncs.com/fxdom/nginx:1.23.1-alpine

LABEL org.opencontainers.image.authors="fx"

COPY ./dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
