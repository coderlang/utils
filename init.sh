git submodule init
git submodule update
cd 3rd_party && git checkout master && cd ..
node ./3rd_party/script/cmd/init.js