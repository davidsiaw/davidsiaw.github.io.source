rm -rf build
git clone git@github.com:davidsiaw/davidsiaw.github.io build
mv build/.git gitbak
rm -rf build
mkdir -p build/weaver
bundle install
bundle exec weaver build --root https://davidsiaw.github.io
mv gitbak build/.git
cd build
echo $DOMAIN_NAME > CNAME
git add .
git commit -m "update"
git push
cd ..
