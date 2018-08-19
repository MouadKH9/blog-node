$(document).ready( () => {

  $(".link-me").each((index,el)=>{
    var title = $(el).data('ref');
    title = title.replace(/\s+/g, '-').toLowerCase();
    $(el).prop('href','article/'+title);
  });

});
