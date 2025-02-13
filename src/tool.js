import $ from 'jquery';

export const ajax_send = function(formData, url,type){
      let return_date;
      $.ajax({
        type: type,
        url: url,
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        dataType: "json",
        success: function (data) {
          console.log(data);
          return_date = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.responseText);
        },
      });
      return return_date;
  };