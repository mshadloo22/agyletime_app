<!DOCTYPE html>

@yield('htmltag', '<html>')

<head>
    <title>
        @section('title')
        Agyle Time -
        @show
    </title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="icon" type="image/png" href="/public/favicon.ico">

    @yield('stylesheets')

    <!--[if lt IE 9]>
    <script src="https://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
</head>
<body style="background-attachment: fixed;">

@yield('content')

</body>
</html>