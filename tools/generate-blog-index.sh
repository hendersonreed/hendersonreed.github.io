cd docs/posts || exit
echo -e "<h1>Writing</h1>\n" > tmp_index.html
echo -e "<ul>\n" >> tmp_index.html
# get all the files except for index.html, sort them numerically, reverse it (newest first),
# and fix file extensions.
post_locations=$(ls | grep -v "index.html" | sort -g | tac)
echo "$post_locations" | awk '{ print "<li><a href=\""$1"\">"$1"</a></li>"}' >> tmp_index.html
echo "</ul>" >> tmp_index.html
cd - || exit
cat header.html docs/posts/tmp_index.html footer.html > docs/posts/index.html
rm docs/posts/tmp_index.html
