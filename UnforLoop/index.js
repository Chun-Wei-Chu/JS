for (var i = 0; i < rows; i++) {
    // do stuff
}

---->

var i = 0;
(function doSort() {
    // update progress
    // do stuff
    i++;
    if (i < rows) {
        setTimeout(doSort, 0);
    }
})();
