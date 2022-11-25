FROM quay.io/souravkl11/raganork:multidevice

RUN git clone https://github.com/souravkl11/raganork-md /rgnk
WORKDIR /rgnk
ENV TZ=Asia/Kolkata
RUN yarn install --ignore-engines --network-concurrency 1
EXPOSE 3000
CMD ["node", "index.js"]
