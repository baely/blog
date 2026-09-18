FROM hugomods/hugo:0.158.0 AS hugo
WORKDIR /src
COPY . .
# Supply a checkout/export of the content branch at .content in the build context.
RUN CONTENT_DIR=/src/.content ./scripts/build.sh

FROM nginx:alpine AS nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/sites.conf
COPY --from=hugo /src/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
