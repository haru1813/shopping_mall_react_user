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

  export const httpRequest = async function(method, url, body, token){
    try{
        const response = await fetch(url, {
          method: method,
          body: JSON.stringify(body),
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok){
          const errorData = await response.json();
          //throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(errorData)}`);
          throw new Error(`status:${response.status},error:${JSON.stringify(errorData)}`);
        }
  
        const data = await response.json(); // 응답 JSON 파싱
        return { status: response.status, data: data }; // status와 data를 객체로 반환
    } catch (error){
      //console.error("HTTP 요청 에러:", error);
      console.error(error);
      const regex = /status:(\d+)/;
      const match = error.message.match(regex);
      return { status: parseInt(match[1]) || null, error: error.message };
    }
  }
  
  export const sendData = async (url,body,method) => {
    try{
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
        const data = await response.json(); // 응답 JSON 파싱
        return { status: response.status, data: data }; // status와 data를 객체로 반환
    }
    catch(error){
        console.log(error);
        // const jsonString = error.message.split(" : ")[1];
        // const jsonData = JSON.parse(jsonString);
        // return { status: jsonData.status || null, error: error.message };
    }
  };
  
  export const getYmd10 = function(){
    var d = new Date();
    return d.getFullYear() + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
  }