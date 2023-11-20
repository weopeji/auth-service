(async () => {

    if(
        typeof getCookie('accessToken') != 'undefined'
    )
    {
        $.ajax({
            "url": "http://127.0.0.1:3000/auth/getUser",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
            },
            "data": JSON.stringify({
                "accessToken": getCookie('accessToken'),
                "refreshToken": getCookie('refreshToken'),
            }),
            error: function(xhr, status, error)
            {
                delCookie('accessToken');
                location.reload();
            },
            success: function(data,status,xhr)
            {
                if(
                    typeof data.status != 'undefined' &&
                    data.status == 'OK'
                )
                {
                    $('.userDataName').html(data._User.name);
                    $('.userDataEmail').html(data._User.email);
                    $('.card-content_more').css('display', 'none');
                };

                $('.card-content_more').css('display', 'block');
            },
        })
    };

    $('button[data="logout"]').click(function () {
        delCookie('accessToken');
        location.reload();
    })

    $('button[data="go_reg"]').click(function () 
    {
        var _Name       = $('#register_name').val();
        var _Email      = $('#register_email').val();
        var _Password   = $('#register_password').val();

        if (
            _Name.length > 0 || 
            _Email.length > 0 ||
            _Password.length > 0
        ) {
            $.ajax({
                "url": "http://127.0.0.1:3000/auth/register",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                },
                "data": JSON.stringify({
                    "name": _Name,
                    "email": _Email,
                    "password": _Password
                }),
                error: function(xhr, status, error)
                {
                    alert(xhr.responseJSON.message);
                },
                success: function(data,status,xhr)
                {
                    setCookie('accessToken', data.accessToken);

                    location.reload();
                },
            })
        };
    });

    $('button[data="go_login"]').click(function () 
    {
        var _Email      = $('#login_email').val();
        var _Password   = $('#login_password').val();

        if (
            _Email.length > 0 ||
            _Password.length > 0
        ) {
            $.ajax({
                "url": "http://127.0.0.1:3000/auth/login",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json",
                },
                "data": JSON.stringify({
                    "email": _Email,
                    "password": _Password
                }),
                error: function(xhr, status, error)
                {
                    alert(xhr.responseJSON.message);
                },
                success: function(data,status,xhr)
                {
                    setCookie('accessToken', data.accessToken);
                    location.reload();
                },
            })
        };
    });

})()