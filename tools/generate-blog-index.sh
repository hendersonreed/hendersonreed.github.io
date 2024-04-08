cd src || exit
rm posts/index.md # delete the out-of-date-index
echo -e "# Writing\n" > posts/index.md
find posts/ -mindepth 1 ! -name "index.md" | sort -g | tac | sed "s/\.md$/\.html/" | awk '{ print "["$1"]"}' >> posts/index.md
cd - || exit
