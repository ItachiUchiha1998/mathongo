var iden1 = document.getElementById('nameOfTheTeacher').innerHTML;
var iden2 = document.getElementById('nameOfTheMiniCourse').innerHTML;
var iden3 = document.getElementById('name').innerHTML;
var disqus_config = function () {
        this.page.url = "http://localhost:8080"+iden1 + iden2 + iden3 ;//+ iden1 + iden2 + iden3 ;
        this.page.identifier = "123" + iden1 + iden2 + iden3;
};
(function() {
        var d = document, s = d.createElement('script');
        s.src = 'https://mathongo-1.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
})();