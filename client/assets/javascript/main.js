function setCookie(name, value, days, path) 
{
    
    path = path || '/';
    days = days || 1000;

    value = encodeURIComponent(value);

    var last_date = new Date();
    last_date.setDate(last_date.getDate() + days);
    var value = escape(value) + ((days==null) ? "" : "; expires="+last_date.toUTCString());
    document.cookie = name + "=" + value + "; path=" + path; // вешаем куки
}

function getCookie(name) 
{
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function delCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    location.reload();
}